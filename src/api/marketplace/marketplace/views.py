from django.shortcuts import redirect
from django.contrib.auth.models import User
from tweepy import OAuth2UserHandler
from django.http import JsonResponse, HttpResponseBadRequest


CONSUMER_KEY = "Mp98xRu1ZVLfrndEyInM4ObLw"
CONSUMER_SECRET = "UHC387WEtwFuklIjZ60V65Ns0Tze1s0U1ZLK6EhOEMcdMnT1nH"
ACCESS_TOKEN = "1722312724565434368-8W2cBj1jVzCVgJDzJaHgFdeoSRlOew"
ACCESS_SECRET = "GOQGmBwXM7jgc6bnqGkcRn6jX25ibxwWTbTdwWrkYKOBq"
CLIENT_ID = "UXRNdzBqU3B4X29kLVRDSDBlN2c6MTpjaQ"
CLIENT_SECRET = "UGyk7GeJ-dgC14RPfasEGQlUjJWhtAK5BQ9p-ksThG6xHIwouW"

# Defines scope for OAuth2 with PKCE
SCOPES = [
    "offline.access",
    "tweet.read",
    "tweet.write",
    "users.read",
    "follows.read",
    "follows.write",
    "mute.read",
]
callback_url = "http://127.0.0.1:8000/twitter-login-callback"
oauth2_user_handler = OAuth2UserHandler(
    client_id=CLIENT_ID,
    redirect_uri=callback_url,
    scope=SCOPES,
)


def authTwitterUser(request):
    auth_url = oauth2_user_handler.get_authorization_url()
    return JsonResponse({"auth_url": auth_url})


def twitterLoginCallback(request):
    if "code" not in request.GET:
        return HttpResponseBadRequest(
            "Authorization code not found in the callback URL."
        )
    authorization_response_url = request.build_absolute_uri()

    try:
        access_token = oauth2_user_handler.fetch_token(authorization_response_url)
    except Exception as e:
        return HttpResponseBadRequest(f"Error fetching access token: {str(e)}")

    # Redirect to your frontend or any desired URL
    return redirect("http://localhost:3000/")
