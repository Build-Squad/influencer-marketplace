from django.shortcuts import redirect
from tweepy import Client, OAuth2UserHandler
from django.http import (
    JsonResponse,
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseRedirect,
)
from decouple import config
from accounts.models import Role, TwitterAccount, User
import datetime
from .authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, api_view
from .services import JWTOperations

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
callback_url = f"{config('SERVER')}twitter-login-callback"

# This is OAuth2.0 PKCE authentication instance that'll be used to interact with Client for V2 version of API
oauth2_user_handler = OAuth2UserHandler(
    client_id=config("CLIENT_ID"),
    redirect_uri=callback_url,
    scope=SCOPES,
    client_secret=config("CLIENT_SECRET"),
)


# Apply these authentication class wherever JWT authentication is necessary.


def logoutUser(request):
    response = HttpResponse("Token Deleted")
    response = JWTOperations.deleteJwtToken(res=response, cookie_name="jwt")
    return response


def authTwitterUser(request):
    auth_url = oauth2_user_handler.get_authorization_url()
    return JsonResponse({"auth_url": auth_url})


def twitterLoginCallback(request):
    authorization_response_url = request.build_absolute_uri()

    try:
        access_token_obj = oauth2_user_handler.fetch_token(authorization_response_url)
        access_token = access_token_obj["access_token"]

        client = Client(access_token)

        userData = client.get_me(
            user_auth=False,
            user_fields=[
                "description",
                "profile_image_url",
                "public_metrics",
                "verified",
                "created_at",
                "location",
                "url"
            ],
        ).data
        existing_user = TwitterAccount.objects.filter(twitter_id=userData.id).first()

        if existing_user is None:
            newUser = TwitterAccount.objects.create(
                twitter_id=userData.id,
                name=userData.name,
                user_name=userData.username,
                access_token=access_token,
                description=userData.description,
                profile_image_url=userData.profile_image_url,
                followers_count=userData.public_metrics["followers_count"],
                following_count=userData.public_metrics["following_count"],
                tweet_count=userData.public_metrics["tweet_count"],
                listed_count=userData.public_metrics["listed_count"],
                verified=userData.verified,
                joined_at=userData.created_at,
                location=userData.location,
                url=userData.url
            )

            newUser.save()
        else:
            existing_user.access_token = access_token
            # Update the user data
            existing_user.name = userData.name
            existing_user.user_name = userData.username
            existing_user.description = userData.description
            existing_user.profile_image_url = userData.profile_image_url
            existing_user.followers_count = userData.public_metrics[
                "followers_count"
            ]
            existing_user.following_count = userData.public_metrics[
                "following_count"
            ]
            existing_user.tweet_count = userData.public_metrics["tweet_count"]
            existing_user.listed_count = userData.public_metrics["listed_count"]
            existing_user.verified = userData.verified
            existing_user.joined_at = userData.created_at
            existing_user.location = userData.location
            existing_user.url = userData.url
            existing_user.save()

        current_twitter_user = TwitterAccount.objects.filter(
            twitter_id=userData.id
        ).first()
        existing_user_account = User.objects.filter(
            twitter_account=current_twitter_user
        ).first()

        if existing_user_account is None:
            new_user_account = User.objects.create(
                username=userData.username,
                email=userData.username + "@xfluencer.com",
                first_name=userData.name,
                twitter_account_id=current_twitter_user.id,
                role=Role.objects.filter(name="influencer").first(),
            )
            new_user_account.save()
        else:
            existing_user_account.last_login = datetime.datetime.now()
            existing_user_account.save()

        current_user = User.objects.filter(twitter_account=current_twitter_user).first()

        # Creating a response object with JWT cookie
        response = HttpResponseRedirect(
            config("FRONT_END_URL") + "business/?authenticationStatus=success"
        )

        # Convert the UUID to string
        user_id = str(current_user.id)
        # Payload for JWT token
        payload = {
            "id": user_id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=86400),
            "iat": datetime.datetime.utcnow(),
        }
        # Set the JWT token in the response object
        response = JWTOperations.setJwtToken(
            res=response, cookie_name="jwt", payload=payload
        )

        return response

    except Exception as e:
        return HttpResponseRedirect(
            config("FRONT_END_URL") + "business/?authenticationStatus=error"
        )
