import asyncio
import logging
from accounts.models import TwitterAccount, User, Wallet
from core.models import Configuration
from notifications.models import Notification
from orders.services import create_notification_for_order, create_notification_for_order_item, create_order_item_status_update_message, \
    create_order_item_tracking, create_order_tracking, create_post_verification_failed_notification, create_reminider_notification
from orders.models import Escrow, OnChainTransaction, Order, OrderItem, OrderItemMetaData, OrderItemMetric
from tweepy import Client

from decouple import config

from celery import shared_task
from django.utils import timezone

from celery_once import QueueOnce

from marketplace import celery_app

from pyxfluencer import validate_escrow_to_cancel, validate_escrow_to_delivered
from pyxfluencer.utils import get_local_keypair_pubkey

logger = logging.getLogger(__name__)

"""
Sends a tweet for a given order item.

Parameters:
- order_item_id (UUID): The ID of the order item.

Returns:
- bool: True if the tweet is successfully published, False otherwise.

Raises:
- Exception: If the order item does not exist or there is an error publishing the tweet.

"""

TWITTER_POST_TWITTER_URL = 'https://api.twitter.com/2/tweets'
CONSUMER_KEY = config("CONSUMER_KEY")
CONSUMER_SECRET = config("CONSUMER_SECRET")
ACCESS_TOKEN = config("ACCESS_TOKEN")
ACCESS_SECRET = config("ACCESS_SECRET")
VALIDATOR_KEY_PATH = config("VALIDATOR_KEY_PATH")
TWEET_LIMIT = 280
NETWORK = config("NETWORK")
TWEET_FIELDS = ['public_metrics', 'organic_metrics', 'non_public_metrics']


def cancel_escrow(order_id: str, status: str):
    try:
        # Get order and corresponding escrow
        order = Order.objects.get(id=order_id)
        escrow = Escrow.objects.get(order=order)

        buyer_primary_wallet = Wallet.objects.get(
            id=escrow.business_wallet.id)
        influencer_primary_wallet = Wallet.objects.get(
            id=escrow.influencer_wallet.id)

        val_auth_keypair, _ = get_local_keypair_pubkey(path=VALIDATOR_KEY_PATH)

        on_chain_transaction = OnChainTransaction.objects.get(
            escrow=escrow, transaction_type='cancel_escrow'
        )

        result = asyncio.run(validate_escrow_to_cancel(validator_authority=val_auth_keypair, business_address=buyer_primary_wallet.wallet_address_id,
                                              influencer_address=influencer_primary_wallet.wallet_address_id, order_code=order.order_number, network=NETWORK))

        # Update all the values of the on_chain_transaction with result.value[0]
        transaction_result = result.value[0]

        on_chain_transaction.confirmation_status = transaction_result.confirmation_status
        on_chain_transaction.confirmations = transaction_result.confirmations
        on_chain_transaction.err = transaction_result.err
        on_chain_transaction.slot = transaction_result.slot
        on_chain_transaction.is_confirmed = transaction_result.err is None

        on_chain_transaction.save()

        # After the above task is finished successfully, update the order status to cancelled
        order.status = status
        order.save()

        create_order_tracking(order=order, status=status)
        create_notification_for_order(order=order, old_status='accepted', new_status=status)

        escrow.status = "cancelled"
        escrow.save()

        return True

    except Exception as e:
        logger.error('Error in cancelling escrow: %s', str(e))
        return False


@celery_app.task(base=QueueOnce, once={'graceful': True})
def confirm_escrow(order_id: str):
    try:
        # Get order and corresponding escrow
        order = Order.objects.get(id=order_id)
        escrow = Escrow.objects.get(order=order)

        buyer_primary_wallet = Wallet.objects.get(
            id=escrow.business_wallet.id)
        influencer_primary_wallet = Wallet.objects.get(
            id=escrow.influencer_wallet.id)

        val_auth_keypair, _ = get_local_keypair_pubkey(path=VALIDATOR_KEY_PATH)

        asyncio.run(validate_escrow_to_delivered(validator_authority=val_auth_keypair, business_address=buyer_primary_wallet.wallet_address_id,
                                                 influencer_address=influencer_primary_wallet.wallet_address_id, order_code=order.order_number, network=NETWORK))

        order.status = 'completed'
        order.save()

        escrow.status = "delivered"
        escrow.save()

    except Exception as e:
        raise Exception('Error in confirming escrow', str(e))

logger = logging.getLogger(__name__)

def check_order_status(pk):
    try:
        # Get order
        order = Order.objects.get(id=pk)
    except Order.DoesNotExist:
        raise Exception('Order does not exist')

    # Get all the order items
    order_items = OrderItem.objects.filter(order_id=order)

    is_completed = True

    if not all(order_item.is_verified for order_item in order_items):
        is_completed = False

    if is_completed:
        confirm_escrow.apply_async(args=[order.id])
        # Create a Order Tracking for the order
        create_order_tracking(order=order, status=order.status)
        # Send notification to business
        create_notification_for_order(order=order, old_status='accepted', new_status='completed')


def tweet(text, client):
    try:
        """
            By default, tweepy uses the OAuth 1.0 Context that even though provided with the bearer token will 
            instead call the API with the auth of the dev portal account and not the user's account.
            To fix this, we need to explicitly set the auth to OAuth 2.0 by setting the user_auth to False, 
            which in turn will use the bearer token of the user's account.
            
        """
        res = client.create_tweet(text=text, user_auth=False)
        tweet_id = res.data['id']
        return tweet_id
    except Exception as e:
        logger.error('Error in publishing tweet: %s', str(e))


def like_tweet(tweet_id, client):
    try:
        res = client.like(tweet_id=tweet_id, user_auth=False)
        return tweet_id if res.data['liked'] else None
    except Exception as e:
        logger.error('Error in liking tweet: %s', str(e))


def reply_to_tweet(text, in_reply_to_tweet_id, client):
    try:
        res = client.create_tweet(
            text=text, in_reply_to_tweet_id=in_reply_to_tweet_id, user_auth=False)
        return res.data['id']
    except Exception as e:
        logger.error('Error in replying to tweet: %s', str(e))


def quote_tweet(text, tweet_id, client):
    try:
        res = client.create_tweet(
            text=text, quote_tweet_id=tweet_id, user_auth=False)
        return res.data['id']
    except Exception as e:
        logger.error('Error in quoting tweet: %s', str(e))


def poll(text, poll_options, poll_duration_minutes, client):
    try:
        res = client.create_tweet(text=text,
                                  poll_options=poll_options, poll_duration_minutes=poll_duration_minutes,
                                  user_auth=False)
        return res.data['id']
    except Exception as e:
        logger.error('Error in creating poll: %s', str(e))


def retweet(tweet_id, client):
    try:
        res = client.retweet(tweet_id=tweet_id, user_auth=False)
        return res.data['rest_id']
    except Exception as e:
        logger.error('Error in retweeting tweet: %s', str(e))


def thread(text, client):
    """
    We need to split the text into multiple tweets on the basis of commas
    For the first tweet, we will call the create_tweet method
    For the rest of the tweets, we will call the reply_to_tweet method with the in_reply_to_tweet_id parameter set to
    the tweet_id of the first tweet
    """
    try:
        tweets = text.split(',')
        published_tweet_id = ''
        for i, text in enumerate(tweets):
            if len(text) <= TWEET_LIMIT:
                if i == 0:
                    res = client.create_tweet(text=text, user_auth=False)
                    published_tweet_id = res.data['id']
                else:
                    res = client.create_tweet(
                        text=text, in_reply_to_tweet_id=published_tweet_id, user_auth=False)
            else:
                raise Exception(
                    f"Tweet is longer than {TWEET_LIMIT} characters")
        return published_tweet_id
    except Exception as e:
        logger.error('Error in creating thread: %s', str(e))


@shared_task
def twitter_task(order_item_id):
    try:
        # Get order item
        order_item = OrderItem.objects.get(id=order_item_id)
    except OrderItem.DoesNotExist:
        raise Exception('Order item does not exist')

    if order_item.status != 'scheduled':
        raise Exception('Order item is not in scheduled status')

    try:
        # Get the influencer
        influencer = User.objects.get(id=order_item.package.influencer.id)

        # Get the twitter account
        twitter_account = TwitterAccount.objects.get(
            id=influencer.twitter_account.id)
    except (Order.DoesNotExist, User.DoesNotExist, TwitterAccount.DoesNotExist) as e:
        raise Exception(str(e))

    ACCESS_CODE = twitter_account.access_token

    # Get all the order item meta datas
    order_item_meta_datas = OrderItemMetaData.objects.filter(
        order_item=order_item)

    # Get the tweet text
    text = ''
    tweet_id = ''
    in_reply_to_tweet_id = ''
    poll_options = []
    poll_duration_minutes = 0
    for order_item_meta_data in order_item_meta_datas:
        if order_item_meta_data.field_name == 'text':
            text = order_item_meta_data.value
        elif order_item_meta_data.field_name == 'tweet_id':
            # Split the tweet_id and get the last part
            tweet_id = order_item_meta_data.value.split('/')[-1].split('?')[0]
        elif order_item_meta_data.field_name == 'in_reply_to_tweet_id':
            # Split the tweet_id and get the last part
            in_reply_to_tweet_id = order_item_meta_data.value.split(
                '/')[-1].split('?')[0]
        elif order_item_meta_data.field_name == 'poll_options':
            # This will be a comma separated string, convert to list
            options = order_item_meta_data.value.split(',')
            poll_options = [option.strip() for option in options]
        elif order_item_meta_data.field_name == 'poll_duration_minutes':
            # Convert to integer
            poll_duration_minutes = int(order_item_meta_data.value)

    client = Client(bearer_token=ACCESS_CODE,
                    consumer_key=CONSUMER_KEY,
                    consumer_secret=CONSUMER_SECRET,
                    access_token=ACCESS_TOKEN,
                    access_token_secret=ACCESS_SECRET
                    )
    try:
        service_type = order_item.service_master.twitter_service_type
        res = None
        # Switch case for different service types
        if service_type == 'tweet':
            res = tweet(text=text, client=client)
        elif service_type == 'like_tweet':
            res = like_tweet(tweet_id=tweet_id, client=client)
        elif service_type == 'reply_to_tweet':
            res = reply_to_tweet(text=text, in_reply_to_tweet_id=in_reply_to_tweet_id, client=client)
        elif service_type == 'quote_tweet':
            res = quote_tweet(text=text, tweet_id=tweet_id, client=client)
        elif service_type == 'poll':
            res = poll(text=text, poll_options=poll_options, poll_duration_minutes=poll_duration_minutes, client=client)
        elif service_type == 'retweet':
            res = retweet(tweet_id=tweet_id, client=client)
        elif service_type == 'thread':
            res = thread(text=text, client=client)

        if res:
            order_item.published_tweet_id = res
            order_item.status = 'published'
            order_item.save()

            # Get the countfown time for the validate_order_item task
            COUNTDOWN_TIME_FOR_VALIDATION = int(Configuration.objects.get(
                key='countdown_time_for_validation').value)

            # Call the validate_order_item task to run 2 minutes after now
            validate_order_item.apply_async(
                args=[order_item.id], countdown=COUNTDOWN_TIME_FOR_VALIDATION)

            # Create a order item tracking for the order item
            create_order_item_tracking(
                order_item=order_item, status=order_item.status)

            # Check if the order is completed
            check_order_status(pk=order_item.order_id.id)

            # Create notification for order item
            create_notification_for_order_item(
                order_item=order_item, old_status='scheduled', new_status='published')
            create_order_item_status_update_message(
                order_item=order_item, updated_by=order_item.package.influencer)
        else:
            order_item.status = 'cancelled'
            order_item.save()

            # Create a order item tracking for the order item
            create_order_item_tracking(
                order_item=order_item, status='failed')

            create_notification_for_order_item(
                order_item=order_item, old_status='scheduled', new_status='failed')

    except Exception as e:
        logger.error('Error in twitter task: %s', str(e))

def schedule_tweet(order_item_id):
    try:
        # Get order item
        order_item = OrderItem.objects.get(id=order_item_id)
    except OrderItem.DoesNotExist:
        raise Exception('Order item does not exist')

    try:
        # Ensure that the order item is in accepted status
        if order_item.status not in ['accepted', 'cancelled']:
            raise Exception('Order item is not in accepted / cancelled status')

        if not order_item.approved:
            raise Exception('Order item is not approved by the business')

        # Get the publish_date
        publish_date = order_item.publish_date

        # Calculate the delay until the publish_date
        delay_until_publish = (publish_date - timezone.now()).total_seconds()

        # Check if publish_date is in the future
        if delay_until_publish < 0:
            raise Exception('Publish date is in the past')

        # Schedule the task
        celery_task = twitter_task.apply_async(
            args=[order_item_id], countdown=delay_until_publish)
        if celery_task:
            old_status = order_item.status
            order_item.celery_task_id = celery_task.id
            order_item.status = 'scheduled'
            order_item.save()

            create_order_item_tracking(order_item=order_item, status=order_item.status)

            # Send notification to business
            create_notification_for_order_item(
                order_item=order_item, old_status=old_status, new_status='scheduled')

            create_order_item_status_update_message(
                order_item=order_item, updated_by=order_item.package.influencer)
    except Exception as e:
        raise Exception(str(e))


def cancel_tweet(order_item_id):
    try:
        # Get order item
        order_item = OrderItem.objects.get(id=order_item_id)
    except OrderItem.DoesNotExist:
        raise Exception('Order item does not exist')

    try:
        # Ensure that the order item is in scheduled status
        if order_item.status != 'scheduled':
            raise Exception('Order item is not in scheduled status')

        # Cancel the task
        if order_item.celery_task_id:
            celery_task = twitter_task.AsyncResult(order_item.celery_task_id)
            celery_task.revoke(terminate=True)
            order_item.celery_task_id = None
            order_item.status = 'cancelled'
            order_item.save()

            create_order_item_tracking(order_item=order_item, status=order_item.status)

            # Send notification to business
            create_notification_for_order_item(
                order_item=order_item, old_status='scheduled', new_status='cancelled')
            create_order_item_status_update_message(
                order_item=order_item, updated_by=order_item.package.influencer)
    except Exception as e:
        raise Exception(str(e))


def check_notification_sent(order_item_id):
    notification = Notification.objects.filter(
        module_id=order_item_id, module='order_item_reminder'
    )
    if notification.exists():
        return True
    return False


@celery_app.task(base=QueueOnce, once={'keys': [], 'graceful': True})
def schedule_reminder_notification():
    try:
        # Get all order items that are accepted and have a publish_date in the next 30 minutes
        order_items = OrderItem.objects.filter(
            status='accepted',
            publish_date__lte=timezone.now() + timezone.timedelta(minutes=30),
            publish_date__gte=timezone.now())

        for order_item in order_items:
            if not check_notification_sent(order_item_id=order_item.id):
                # Send notification to business
                create_reminider_notification(order_item=order_item)
    except Exception as e:
        raise Exception(str(e))


def is_post_published(order_item_id) -> bool:
    try:
        # Get order item
        order_item = OrderItem.objects.get(id=order_item_id)
    except OrderItem.DoesNotExist:
        raise Exception('Order item does not exist')

    try:
        # Get the twitter account of the influencer
        twitter_account = TwitterAccount.objects.get(
            id=order_item.package.influencer.twitter_account.id)
        client = Client(bearer_token=twitter_account.access_token,
                        consumer_key=CONSUMER_KEY,
                        consumer_secret=CONSUMER_SECRET,
                        access_token=ACCESS_TOKEN,
                        access_token_secret=ACCESS_SECRET
                        )
        res = client.get_tweet(
            id=order_item.published_tweet_id, user_auth=False)

        return str(res.data.get('id', '')) == str(order_item.published_tweet_id)
    except Exception as e:
        logger.error('Error in checking if post is published: %s', str(e))
        return False


def is_post_liked(order_item_id) -> bool:
    try:
        # Get order item
        order_item = OrderItem.objects.get(id=order_item_id)
    except OrderItem.DoesNotExist:
        raise Exception('Order item does not exist')

    try:
        # Get the twitter account of the influencer
        twitter_account = TwitterAccount.objects.get(
            id=order_item.package.influencer.twitter_account.id)
        client = Client(bearer_token=twitter_account.access_token,
                        consumer_key=CONSUMER_KEY,
                        consumer_secret=CONSUMER_SECRET,
                        access_token=ACCESS_TOKEN,
                        access_token_secret=ACCESS_SECRET
                        )
        res = client.get_liking_users(
            id=order_item.published_tweet_id, user_auth=False)
        # res.data is an array of {id, username, name} objects
        # Check that twitter_account.twitter_id is in the array
        return True if any(
            str(user['id']) == str(twitter_account.twitter_id) for user in res.data) else False
    except Exception as e:
        logger.error('Error in checking if post is liked: %s', str(e))
        return False


@celery_app.task(base=QueueOnce, once={'graceful': True})
def validate_order_item(order_item_id):
    try:
        # Get order item
        order_item = OrderItem.objects.get(id=order_item_id)
        if order_item.status != 'published':
            raise Exception('Order item is not in published status')
        is_published = False
        if order_item.service_master.twitter_service_type == 'like_tweet':
            is_published = is_post_liked(order_item_id=order_item.id)
        else:
            is_published = is_post_published(order_item_id=order_item.id)
        if is_published:
            order_item.is_verified = True
            order_item.save()
            check_order_status(pk=order_item.order_id.id)
        else:
            order_item.is_verified = False
            order_item.save()
            create_post_verification_failed_notification(order_item=order_item)
    except Exception as e:
        raise Exception(str(e))


@celery_app.task()
def store_order_item_metrics():
    # Get the current date
    now = timezone.now()
    # Get all order items that are in published status and verified and service type is not retweet or like
    order_items = OrderItem.objects.filter(
        status='published', 
        service_master__twitter_service_type__in=['tweet', 'reply_to_tweet', 'quote_tweet', 'poll', 'thread']
    )
    for order_item in order_items:
        # Calculate the number of days since the order item was published
        days_since_published = (now - order_item.publish_date).days

        # Check if the current day is the 1st, 2nd, 3rd, 7th, 14th, 21st, or 28th day since the order item was published
        if days_since_published in [1, 2, 3, 7, 14, 21, 28]:
            # Get the twitter account of the influencer
            twitter_account = TwitterAccount.objects.get(
                id=order_item.package.influencer.twitter_account.id)
            client = Client(bearer_token=twitter_account.access_token,
                            consumer_key=CONSUMER_KEY,
                            consumer_secret=CONSUMER_SECRET,
                            access_token=ACCESS_TOKEN,
                            access_token_secret=ACCESS_SECRET
                            )
            try:
                res = client.get_tweet(
                    id=order_item.published_tweet_id, user_auth=False, tweet_fields=TWEET_FIELDS)

                # For all the res.data fields, create a OrderItemMetric object
                public_metrics = res.data['public_metrics']
                organic_metrics = res.data['organic_metrics']
                non_public_metrics = res.data['non_public_metrics']

                order_item_metrics = []

                for key, value in public_metrics.items():
                    order_item_metrics.append(
                        OrderItemMetric(order_item=order_item, metric=key, value=value, type='public_metrics'))

                for key, value in organic_metrics.items():
                    order_item_metrics.append(
                        OrderItemMetric(order_item=order_item, metric=key, value=value, type='organic_metrics'))

                for key, value in non_public_metrics.items():
                    order_item_metrics.append(
                        OrderItemMetric(order_item=order_item, metric=key, value=value, type='non_public_metrics'))

                OrderItemMetric.objects.bulk_create(order_item_metrics)

            except Exception as e:
                logger.error('Error in getting tweet metrics: %s', str(e))
                continue
