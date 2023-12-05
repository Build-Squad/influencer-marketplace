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

        self.callback_url = f"{config('SERVER')}twitter-login-callback"

        # This is OAuth2.0 PKCE authentication instance that'll be used to interact with Client for V2 version of API
        self.oauth2_user_handler = OAuth2UserHandler(
            client_id=config("CLIENT_ID"),
            redirect_uri=self.callback_url,
            scope=self.SCOPES,
            client_secret=config("CLIENT_SECRET"),
        )

    def get_twitter_oauth_url(self, role):
        auth_url = self.oauth2_user_handler.get_authorization_url()
        auth_url += f"&role={role}"
        return auth_url

    def get_twitter_access_token(self, authorization_response_url):
        access_token_obj = self.oauth2_user_handler.fetch_token(
            authorization_response_url)
        access_token = access_token_obj["access_token"]
        return access_token

    def get_twitter_client_data(self):
        access_token = self.get_twitter_access_token()
        client = Client(access_token)
        userData = client.get_me(user_auth=False).data
        return userData

    def get_jwt_payload(self, twitter_user):
        payload = {
            "id": twitter_user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=86400),
            "iat": datetime.datetime.utcnow(),
        }
        return payload
