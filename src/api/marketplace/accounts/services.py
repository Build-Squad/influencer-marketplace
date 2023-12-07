from tweepy import Client, OAuth2UserHandler
from decouple import config
import datetime


class TwitterAuthenticationService:
    def __init__(self):
        # Add scopes here
        self.SCOPES = [
            "offline.access",
            "tweet.read",
            "tweet.write",
            "users.read",
            "follows.read",
            "follows.write",
            "mute.read",
        ]

        self.USER_FIELDS = [
            "description",
            "profile_image_url",
            "public_metrics",
            "verified",
        ]

        self.callback_url = f"{config('SERVER')}account/twitter-auth"

        # This is OAuth2.0 PKCE authentication instance that'll be used to interact with Client for V2 version of API
        self.oauth2_user_handler = OAuth2UserHandler(
            client_id=config("CLIENT_ID"),
            redirect_uri=self.callback_url,
            scope=self.SCOPES,
            client_secret=config("CLIENT_SECRET"),
        )

    def get_twitter_oauth_url(self):
        auth_url = self.oauth2_user_handler.get_authorization_url()
        return auth_url

    def get_twitter_access_token(self, authorization_response_url):
        access_token_obj = self.oauth2_user_handler.fetch_token(
            authorization_response_url)
        access_token = access_token_obj["access_token"]
        return access_token

    def get_twitter_client_data(self, request):
        authorization_response_url = request.build_absolute_uri()
        access_token = self.get_twitter_access_token(
            authorization_response_url)
        client = Client(access_token)
        userData = client.get_me(
            user_auth=False, user_fields=self.USER_FIELDS).data
        return userData

    def get_jwt_payload(self, twitter_user):
        payload = {
            "id": twitter_user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=86400),
            "iat": datetime.datetime.utcnow(),
        }
        return payload
