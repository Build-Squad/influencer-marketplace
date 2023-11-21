from django.shortcuts import redirect
from tweepy import Client, OAuth2UserHandler
from django.http import JsonResponse, HttpResponseBadRequest
from decouple import config
from marketplace.models import Users

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

# This is OAuth2.0 PKCE authentication instance that'll be used to interact with Client for V2 version of API
oauth2_user_handler = OAuth2UserHandler(
    client_id=config("CLIENT_ID"),
    redirect_uri=callback_url,
    scope=SCOPES,
    client_secret=config("CLIENT_SECRET"),
)


def authTwitterUser(request):
    auth_url = oauth2_user_handler.get_authorization_url()
    return JsonResponse({"auth_url": auth_url})


def twitterLoginCallback(request):
    authorization_response_url = request.build_absolute_uri()

    try:
        access_token_obj = oauth2_user_handler.fetch_token(authorization_response_url)
        access_token = access_token_obj["access_token"]
        client = Client(access_token)

        userData = client.get_me(user_auth=False).data
        print(userData)
        newUser = Users.objects.create(
            id=userData.id,
            name=userData.name,
            userName=userData.username,
            accessToken=access_token,
        )

        newUser.save()

        # Store
    except Exception as e:
        return HttpResponseBadRequest(f"Error fetching access token: {str(e)}")

    # Redirect to your frontend or any desired URL
    return redirect("http://localhost:3000/")
