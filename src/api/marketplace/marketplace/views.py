from django.shortcuts import redirect, render
from accounts.serializers import UserSerializer
from tweepy import Client, OAuth2UserHandler
from django.http import (
    HttpResponse,
    HttpResponseRedirect,
)
from decouple import config
from accounts.models import Role, TwitterAccount, User
import datetime
from .authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, api_view
from .services import JWTOperations
from .constants import TWITTER_SCOPES, TWITTER_CALLBACK_URL

import logging

logger = logging.getLogger(__name__)

# This is OAuth2.0 PKCE authentication instance that'll be used to interact with Client for V2 version of API
oauth2_user_handler = OAuth2UserHandler(
    client_id=config("CLIENT_ID"),
    redirect_uri=TWITTER_CALLBACK_URL,
    scope=TWITTER_SCOPES,
    client_secret=config("CLIENT_SECRET"),
)


def logoutUser(request):
    response = HttpResponse("Token Deleted")
    response = JWTOperations.deleteJwtToken(res=response, cookie_name="jwt")
    return response


def authTwitterUser(request, role):
    request.session["role"] = role
    auth_url = oauth2_user_handler.get_authorization_url()
    return HttpResponseRedirect(auth_url)


def twitterLoginCallback(request):
    role = request.session.get("role", "")
    authorization_response_url = request.build_absolute_uri()
    try:
        # Authenticate User
        authentication_result = authenticateUser(authorization_response_url)
        userData = authentication_result["userData"]
        access_token = authentication_result["access_token"]
        refresh_token = authentication_result["refresh_token"]
        # Create USER and JWT and send response
        return createJWT(userData, access_token, role, refresh_token)
    except Exception as e:
        logger.error("Error in twitterLoginCallback -", e)
        return HttpResponseRedirect(
            config("FRONT_END_URL") + "influencer/?authenticationStatus=error"
        )


# Helper functions
def authenticateUser(authorization_response_url):
    max_attempts = 4
    attempt = 0
    while attempt < max_attempts:
        try:
            access_token_obj = oauth2_user_handler.fetch_token(
                authorization_response_url
            )
            access_token = access_token_obj["access_token"]
            refresh_token = access_token_obj["refresh_token"]

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
                    "url",
                ],
            ).data
            logger.info("Twitter User Authenticated", userData)
            return {
                "userData": userData,
                "access_token": access_token,
                "refresh_token": refresh_token,
            }
        except Exception as e:
            attempt += 1
            logger.error(
                f"Error authenticating User - Attempt {attempt}/{max_attempts}:", e
            )
    # If authentication fails after max_attempts, redirect to an error page
    return HttpResponseRedirect(
        config("FRONT_END_URL") + "influencer/?authenticationStatus=error"
    )


def createUser(userData, access_token, role, refresh_token):
    try:
        existing_user = TwitterAccount.objects.filter(twitter_id=userData.id).first()

        # Operations for twitter user account
        if existing_user is None:
            newUser = TwitterAccount.objects.create(
                twitter_id=userData.id,
                name=userData.name,
                user_name=userData.username,
                access_token=access_token,
                refresh_token=refresh_token,
                description=userData.description,
                profile_image_url=userData.profile_image_url,
                followers_count=userData.public_metrics["followers_count"],
                following_count=userData.public_metrics["following_count"],
                tweet_count=userData.public_metrics["tweet_count"],
                listed_count=userData.public_metrics["listed_count"],
                verified=userData.verified,
                joined_at=userData.created_at,
                location=userData.location,
                url=userData.url,
            )

            newUser.save()
        else:
            existing_user.access_token = access_token
            # Update the user data
            existing_user.name = userData.name
            existing_user.refresh_token = refresh_token
            existing_user.user_name = userData.username
            existing_user.profile_image_url = userData.profile_image_url
            existing_user.followers_count = userData.public_metrics["followers_count"]
            existing_user.following_count = userData.public_metrics["following_count"]
            existing_user.tweet_count = userData.public_metrics["tweet_count"]
            existing_user.listed_count = userData.public_metrics["listed_count"]
            existing_user.verified = userData.verified
            existing_user.joined_at = userData.created_at
            existing_user.location = userData.location
            existing_user.url = userData.url
            existing_user.save()

        # Operations for Main User account
        current_twitter_user = TwitterAccount.objects.filter(
            twitter_id=userData.id
        ).first()
        existing_user_account = User.objects.filter(
            twitter_account=current_twitter_user
        ).first()

        if existing_user_account is None:
            new_user_account = User.objects.create(
                username=userData.username,
                first_name=userData.name,
                twitter_account_id=current_twitter_user.id,
                role=Role.objects.filter(name=role).first(),
            )
            new_user_account.save()
        else:
            existing_user_account.last_login = datetime.datetime.now()
            existing_user_account.save()

        current_user = User.objects.filter(twitter_account=current_twitter_user).first()
        logger.info("User Successfully created/updated")
        return current_user
    except Exception as e:
        logger.error("Error creating/updating user account -", e)
        return HttpResponseRedirect(
            config("FRONT_END_URL") + "influencer/?authenticationStatus=error"
        )


def createJWT(userData, access_token, role, refresh_token):
    try:
        # Creating/Updating twitter and user table
        current_user = createUser(userData, access_token, role, refresh_token)

        # Creating a response object with JWT cookie
        if role == "business_owner":
            redirect_url = (
                f"{config('FRONT_END_URL')}business/?authenticationStatus=success"
            )
        elif role == "influencer":
            redirect_url = (
                f"{config('FRONT_END_URL')}influencer/?authenticationStatus=success"
            )

        response = redirect(redirect_url)

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
            response, cookie_name="jwt", payload=payload
        )
        response.data = {
            "isSuccess": True,
            "data": UserSerializer(current_user).data,
            "message": "Logged in successfully",
        }
        logger.info("JWT created successfully")
        return response
    except Exception as e:
        logger.error("Error while creating jwt - ", e)
        return redirect(
            f"{config('FRONT_END_URL')}influencer/?authenticationStatus=error"
        )
