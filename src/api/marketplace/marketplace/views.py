from django.shortcuts import redirect
from tweepy import Client, OAuth2UserHandler
from django.http import (
    JsonResponse,
    HttpResponseBadRequest,
    HttpResponse,
    HttpResponseRedirect,
)
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


def isAuthenticated(request):
    your_cookie_value = request.COOKIES.get("access_token")

    if your_cookie_value:
        response = JsonResponse(
            {"isAuthenticated": True, "message": f"Cookie value: {your_cookie_value}"}
        )
        response["Access-Control-Allow-Credentials"] = "true"
        return response
    else:
        response = JsonResponse(
            {"isAuthenticated": False, "message": "Cookie not found"}
        )
        response["Access-Control-Allow-Credentials"] = "true"
        return response


def logoutUser(request):
    response = HttpResponse("Delete Cookie")
    response.set_cookie(
        "access_token",
        "",
        max_age=0,
        secure=True,
        httponly=True,
        samesite="None",
    )
    response["Access-Control-Allow-Credentials"] = "true"
    return response


def authTwitterUser(request):
    auth_url = oauth2_user_handler.get_authorization_url()
    return JsonResponse({"auth_url": auth_url})


def twitterLoginCallback(request):
    authorization_response_url = request.build_absolute_uri()

    try:
        access_token_obj = oauth2_user_handler.fetch_token(authorization_response_url)
        access_token = access_token_obj["access_token"]
        print("Access token fetched successfully: ", access_token)

        # Creating Twitter API tweepy V2 instance.
        client = Client(access_token)

        userData = client.get_me(user_auth=False).data

        # Checking if the user with the ID already exists in our database
        existing_user = Users.objects.filter(id=userData.id).first()

        if existing_user is None:
            newUser = Users.objects.create(
                id=userData.id,
                name=userData.name,
                userName=userData.username,
                accessToken=access_token,
            )

            newUser.save()
        else:
            existing_user.accessToken = access_token
            existing_user.save()

    except Exception as e:
        return HttpResponseBadRequest(f"Error fetching access token: {str(e)}")

    response = HttpResponseRedirect("http://localhost:3000/")
    # Store JWT token not access token directly.
    response.set_cookie(
        "access_token",
        access_token,
        max_age=86400,
        path="/",
        secure=True,
        samesite="None",
    )
    response["Access-Control-Allow-Credentials"] = "true"
    return response
