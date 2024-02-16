from accounts.models import TwitterAccount, User
from notifications.models import Notification
from orders.services import create_notification_for_order, create_notification_for_order_item, create_order_item_tracking, create_order_tracking, create_reminider_notification
from orders.models import Order, OrderItem, OrderItemMetaData

from tweepy import Client

from decouple import config

from celery import shared_task
from datetime import datetime
from django.utils import timezone

from marketplace import celery_app


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


def checkOrderStatus(pk):
    try:
        # Get order
        order = Order.objects.get(id=pk)
    except Order.DoesNotExist:
        raise Exception('Order does not exist')

    # Get all the order items
    order_items = OrderItem.objects.filter(order_id=order)

    is_completed = True

    for order_item in order_items:
        if order_item.status != 'published':
            is_completed = False
            break

    if is_completed:
        order.status = 'completed'
        order.save()
        # Create a Order Tracking for the order
        create_order_tracking(order, order.status)
        # Send notification to business
        create_notification_for_order(order, 'accepted', 'completed')


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
        raise Exception(str(e))


def like_tweet(tweet_id, client):
    try:
        res = client.like_tweet(tweet_id=tweet_id, user_auth=False)
        return res.data['id']
    except Exception as e:
        raise Exception(str(e))


def reply_to_tweet(text, in_reply_to_tweet_id, client):
    try:
        res = client.create_tweet(
            text=text, in_reply_to_tweet_id=in_reply_to_tweet_id, user_auth=False)
        return res.data['id']
    except Exception as e:
        raise Exception(str(e))


def quote_tweet(text, tweet_id, client):
    try:
        res = client.create_tweet(
            text=text, quote_tweet_id=tweet_id, user_auth=False)
        return res.data['id']
    except Exception as e:
        raise Exception(str(e))


def poll(text, poll_options, poll_duration_minutes, client):
    try:
        res = client.create_tweet(text=text,
                                  poll_options=poll_options, poll_duration_minutes=poll_duration_minutes, user_auth=False)
        return res.data['id']
    except Exception as e:
        raise Exception(str(e))


def retweet(tweet_id, client):
    try:
        res = client.retweet(tweet_id=tweet_id, user_auth=False)
        return res.data['id']
    except Exception as e:
        raise Exception(str(e))

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
            tweet_id = order_item_meta_data.value.split('/')[-1]
        elif order_item_meta_data.field_name == 'in_reply_to_tweet_id':
            # Split the tweet_id and get the last part
            in_reply_to_tweet_id = order_item_meta_data.value.split('/')[-1]
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
            res = tweet(text, client)
        elif service_type == 'like_tweet':
            res = like_tweet(tweet_id, client)
        elif service_type == 'reply_to_tweet':
            res = reply_to_tweet(text, in_reply_to_tweet_id, client)
        elif service_type == 'quote_tweet':
            res = quote_tweet(text, tweet_id, client)
        elif service_type == 'poll':
            res = poll(text, poll_options, poll_duration_minutes, client)
        elif service_type == 'retweet':
            res = retweet(tweet_id, client)

        order_item.published_tweet_id = res
        order_item.status = 'published'
        order_item.save()

        # Create a order item tracking for the order item
        create_order_item_tracking(order_item, order_item.status)

        # Check if the order is completed
        checkOrderStatus(order_item.order_id.id)

        # Create notification for order item
        create_notification_for_order_item(
            order_item, 'scheduled', 'published')

    except Exception as e:
        raise Exception(str(e))

    return True


def schedule_tweet(order_item_id):
    try:
        # Get order item
        order_item = OrderItem.objects.get(id=order_item_id)
    except OrderItem.DoesNotExist:
        raise Exception('Order item does not exist')

    try:
        # Ensure that the order item is in accepted status
        if order_item.status != 'accepted':
            raise Exception('Order item is not in accepted status')

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
            order_item.celery_task_id = celery_task.id
            order_item.status = 'scheduled'
            order_item.save()

            create_order_item_tracking(order_item, order_item.status)

            # Send notification to business
            create_notification_for_order_item(
                order_item, 'accepted', 'scheduled')
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

            create_order_item_tracking(order_item, order_item.status)

            # Send notification to business
            create_notification_for_order_item(
                order_item, 'scheduled', 'cancelled')
    except Exception as e:
        raise Exception(str(e))


def check_notification_sent(order_item_id):
    notification = Notification.objects.filter(
        module_id=order_item_id, module='order_item_reminder'
    )
    if notification.exists():
        return True
    return False


@celery_app.task()
def schedule_reminder_notification():
    try:
        # Get all order items that are accepted and have a publish_date in the next 30 minutes
        order_items = OrderItem.objects.filter(
            status='accepted',
            publish_date__lte=timezone.now() + timezone.timedelta(minutes=30),
            publish_date__gte=timezone.now())

        for order_item in order_items:
            if not check_notification_sent(order_item.id):
                # Send notification to business
                create_reminider_notification(order_item)
    except Exception as e:
        raise Exception(str(e))
