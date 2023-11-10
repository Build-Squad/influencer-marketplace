from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from tweepy import OAuthHandler, API, OAuth2UserHandler


CONSUMER_KEY = "Mp98xRu1ZVLfrndEyInM4ObLw"
CONSUMER_SECRET = "UHC387WEtwFuklIjZ60V65Ns0Tze1s0U1ZLK6EhOEMcdMnT1nH"
ACCESS_TOKEN = "1722312724565434368-8W2cBj1jVzCVgJDzJaHgFdeoSRlOew"
ACCESS_SECRET = "GOQGmBwXM7jgc6bnqGkcRn6jX25ibxwWTbTdwWrkYKOBq"
CLIENT_ID = "UXRNdzBqU3B4X29kLVRDSDBlN2c6MTpjaQ"
CLIENT_SECRET = "UGyk7GeJ-dgC14RPfasEGQlUjJWhtAK5BQ9p-ksThG6xHIwouW"

# Ref - https://developer.twitter.com/en/docs/authentication/oauth-2-0/authorization-code
SCOPES = [
    "offline.access",
    "tweet.read",
    "tweet.write",
    "users.read",
    "follows.read",
    "follows.write",
    "mute.read",
]


def authTwitterUser(request):
    callback_url = "http://127.0.0.1:8000/twitter-login-callback"
    oauth2_user_handler = OAuth2UserHandler(
        client_id=CLIENT_ID,
        redirect_uri=callback_url,
        scope=SCOPES,
    )
    auth_url = oauth2_user_handler.get_authorization_url()
    return redirect(auth_url)


def twitterLoginCallback(request):
    # auth_handler = OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    # auth_handler.set_access_token(
    #     request.GET["oauth_token"], request.GET["oauth_verifier"]
    # )

    # api = API(auth_handler)

    # TODO: Store the access token and refresh token securely.

    return redirect("http://localhost:3000/")