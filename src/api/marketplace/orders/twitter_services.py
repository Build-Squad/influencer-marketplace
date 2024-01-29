from accounts.models import TwitterAccount, User
from orders.models import Order, OrderItem, OrderItemMetaData

from tweepy import Client

from decouple import config


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

def send_tweet(order_item_id):
    try:
        # Get order item
        order_item = OrderItem.objects.get(id=order_item_id)
    except OrderItem.DoesNotExist:
        raise Exception('Order item does not exist')

    # Ensure that the order item is in finalized status
    if order_item.status != 'finalized':
        raise Exception('Order item is not in finalized status')
    
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
        res = client.create_tweet(text=text)

        tweet_id = res.data['id']
        order_item.published_tweet_id = tweet_id
        order_item.status = 'published'
        order_item.save()
        return True
    except Exception as e:
        raise Exception(str(e))
