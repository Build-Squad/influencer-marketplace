from django.shortcuts import redirect
from tweepy import API, Client, OAuth1UserHandler
from django.http import JsonResponse, HttpResponseBadRequest
from decouple import config

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
callback_url = "https://127.0.0.1:8000/twitter-login-callback"

# This is OAuth1.0 authentication instance that'll be used to interact with API/Client for V1/V2 version of API
oauth1_user_handler = OAuth1UserHandler(
    config("CONSUMER_KEY"), config("CONSUMER_SECRET"), callback=callback_url
)


def authTwitterUser(request):
    auth_url = oauth1_user_handler.get_authorization_url()
    return JsonResponse({"auth_url": auth_url})


def twitterLoginCallback(request):
    if "oauth_verifier" not in request.GET:
        return HttpResponseBadRequest(
            "Authorization oauth_verifier not found in the callback URL."
        )

    try:
        access_token, access_token_secret = oauth1_user_handler.get_access_token(
            request.GET.get("oauth_verifier")
        )

        # Tweepy Instance for accessing API V1 services
        api = API(oauth1_user_handler)

        # Tweepy Instance for accessing API V2 services
        client = Client(
            consumer_key=config("CONSUMER_KEY"),
            consumer_secret=config("CONSUMER_SECRET"),
            access_token=access_token,
            access_token_secret=access_token_secret,
        )
        user = client.get_me()
        print(user)

        # Store
    except Exception as e:
        return HttpResponseBadRequest(f"Error fetching access token: {str(e)}")

    # Redirect to your frontend or any desired URL
    return redirect("http://localhost:3000/")
