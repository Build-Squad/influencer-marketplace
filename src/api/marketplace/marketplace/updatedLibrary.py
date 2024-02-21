from tweepy import OAuth2UserHandler

class CustomOAuth2UserHandler(OAuth2UserHandler):
    def refresh_token(self, refresh_token):
        new_token = super().refresh_token(
            "https://api.twitter.com/2/oauth2/token",
            refresh_token=refresh_token,
            body=f"grant_type=refresh_token&client_id={self.client_id}",
        )
        return new_token
