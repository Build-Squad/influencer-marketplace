from accounts.models import TwitterAccount, User
from orders.services import create_notification_for_order, create_notification_for_order_item
from orders.models import Order, OrderItem, OrderItemMetaData

from tweepy import Client

from decouple import config

from celery import shared_task
from datetime import datetime
from django.utils import timezone


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


def checkOrderStatus(order_id):
    try:
        # Get order
        order = Order.objects.get(id=order_id)
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

        # Send notification to business
        create_notification_for_order(order, 'accepted', 'completed')

@shared_task
def send_tweet(order_item_id):
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
    for order_item_meta_data in order_item_meta_datas:
        if order_item_meta_data.field_name == 'content':
            text = order_item_meta_data.value

    if not text:
        raise Exception('No content for tweet')

    client = Client(bearer_token=ACCESS_CODE,
                    consumer_key=CONSUMER_KEY,
                    consumer_secret=CONSUMER_SECRET,
                    access_token=ACCESS_TOKEN,
                    access_token_secret=ACCESS_SECRET
                    )
    try:
        """
            By default, tweepy uses the OAuth 1.0 Context that even though provided with the bearer token will 
            instead call the API with the auth of the dev portal account and not the user's account.
            To fix this, we need to explicitly set the auth to OAuth 2.0 by setting the user_auth to False, 
            which in turn will use the bearer token of the user's account.
            
        """
        res = client.create_tweet(text=text, user_auth=False)
        tweet_id = res.data['id']
        order_item.published_tweet_id = tweet_id
        order_item.status = 'published'
        order_item.save()

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
        celery_task = send_tweet.apply_async(
            args=[order_item_id], countdown=delay_until_publish)
        if celery_task:
            order_item.celery_task_id = celery_task.id
            order_item.status = 'scheduled'
            order_item.save()

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
            celery_task = send_tweet.AsyncResult(order_item.celery_task_id)
            celery_task.revoke(terminate=True)
            order_item.celery_task_id = None
            order_item.status = 'cancelled'
            order_item.save()

            # Send notification to business
            create_notification_for_order_item(
                order_item, 'scheduled', 'cancelled')
    except Exception as e:
        raise Exception(str(e))
