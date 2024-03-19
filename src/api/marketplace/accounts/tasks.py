from marketplace import celery_app
from marketplace.updatedLibrary import CustomOAuth2UserHandler
from .models import TwitterAccount, User

from decouple import config
from marketplace.constants import TWITTER_SCOPES, TWITTER_CALLBACK_URL
import logging
from django.template.loader import get_template
from django.core.mail import send_mail

from tweepy import Client

from decouple import config

from celery import shared_task

from celery_once import QueueOnce

logger = logging.getLogger(__name__)

CONSUMER_KEY = config("CONSUMER_KEY")
CONSUMER_SECRET = config("CONSUMER_SECRET")
ACCESS_TOKEN = config("ACCESS_TOKEN")
ACCESS_SECRET = config("ACCESS_SECRET")
VALIDATOR_KEY_PATH = config("VALIDATOR_KEY_PATH")


@celery_app.task(base=QueueOnce, once={'graceful': True})
def updateAccessTokens():
    try:
        oauth2_user_handler = CustomOAuth2UserHandler(
            client_id=config("CLIENT_ID"),
            redirect_uri=TWITTER_CALLBACK_URL,
            scope=TWITTER_SCOPES,
            client_secret=config("CLIENT_SECRET"),
        )

        twitter_accounts = TwitterAccount.objects.all()
        for twitter_account in twitter_accounts:
            old_token = {
                "access_token": twitter_account.access_token,
                "refresh_token": twitter_account.refresh_token,
            }

            if old_token["refresh_token"]:
                # Use your OAuth2UserHandler to refresh the token
                try:
                    new_token = oauth2_user_handler.refresh_token(
                        old_token["refresh_token"]
                    )
                except Exception as e:
                    logger.error(f"Error refreshing token: {e}")
                    continue

                # Update the TwitterAccount model with the new tokens
                twitter_account.access_token = new_token["access_token"]
                twitter_account.refresh_token = new_token["refresh_token"]
                twitter_account.save()

                logger.info(f"Updated tokens for TwitterAccount {twitter_account.id}")
            else:
                logger.error(f"Refresh token for {twitter_account.id} not present")
    except Exception as e:
        logger.error(f"Error updating tokens: {e}")


@shared_task(autoretry_for=(Exception,), retry_kwargs={'max_retries': 3, 'countdown': 10})
def sendEmail(subject, message, template_name, context, recipient_list):
    try:
        from_email = config("EMAIL_HOST_USER")
        html_message = get_template(template_name).render(context)
        send_mail(subject=subject, message=message, html_message=html_message,
                  from_email=from_email, recipient_list=recipient_list)
    except Exception as e:
        logger.error(f"Error sending email: {e}")


def promote_xfluencer(user: User, text: str):
    try:
        twitter_account = TwitterAccount.objects.get(
            id=user.twitter_account_id)
        ACCESS_CODE = twitter_account.access_token

        client = Client(bearer_token=ACCESS_CODE,
                        consumer_key=CONSUMER_KEY,
                        consumer_secret=CONSUMER_SECRET,
                        access_token=ACCESS_TOKEN,
                        access_token_secret=ACCESS_SECRET
                        )

        res = client.create_tweet(text=text, user_auth=False)
        tweet_id = res.data['id']

        return tweet_id
    except Exception as e:
        logger.error(f"Error promoting xfluencer: {e}")
        return None
