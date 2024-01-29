import requests
import json

from accounts.models import TwitterAccount, User
from orders.models import Order, OrderItem, OrderItemMetaData

"""
Sends a tweet for a given order item.

Parameters:
- order_item_id (UUID): The ID of the order item.

Returns:
- bool: True if the tweet is successfully published, False otherwise.

Raises:
- Exception: If the order item does not exist or there is an error publishing the tweet.

Successful Twitter API Response structure:
    {
      "data": {
        "id": "",
        "text": ""
      }
    }
    
Unsuccessful Twitter API Response structure:
    {
      "title": "Unauthorized",
      "type": "about:blank",
      "status": 401,
      "detail": "Unauthorized"
  }

"""

TWITTER_POST_TWITTER_URL = 'https://api.twitter.com/2/tweets'


def send_tweet(order_item_id):
    try:
        # Get order item
        order_item = OrderItem.objects.get(id=order_item_id)
    except OrderItem.DoesNotExist:
        raise Exception('Order item does not exist')

    try:
        # Get the order
        order = Order.objects.get(id=order_item.order_id)

        # Get the influencer
        influencer = User.objects.get(id=order.package.influencer.id)

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

    payload = json.dumps({
        "text": text,
    })
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ACCESS_CODE,
    }

    response = requests.request(
        "POST", TWITTER_POST_TWITTER_URL, headers=headers, data=payload)

    if response.status_code == 201:
        # Get the tweet id
        tweet_id = response.json()['data']['id']

        # Update the order item
        order_item.published_tweet_id = tweet_id
        order_item.status = 'published'
        order_item.save()

        return True
    else:
        error_message = response.json().get('detail', 'Unknown error')
        raise Exception('Error publishing tweet: ' + error_message)
