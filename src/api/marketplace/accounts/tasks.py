from marketplace import celery_app
from marketplace.updatedLibrary import CustomOAuth2UserHandler
from .models import TwitterAccount

from decouple import config
from marketplace.constants import TWITTER_SCOPES, TWITTER_CALLBACK_URL


@celery_app.task()
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
                new_token = oauth2_user_handler.refresh_token(
                    old_token["refresh_token"]
                )

                # Update the TwitterAccount model with the new tokens
                twitter_account.access_token = new_token["access_token"]
                twitter_account.refresh_token = new_token["refresh_token"]
                twitter_account.save()

                print(f"Updated tokens for TwitterAccount {twitter_account.id}")
            else:
                print(f"Refresh token for {twitter_account.id} not present")
    except Exception as e:
        raise e
