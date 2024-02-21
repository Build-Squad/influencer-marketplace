from django.shortcuts import redirect
from accounts.serializers import UserSerializer
from tweepy import Client
from django.http import (
    HttpResponse,
    HttpResponseRedirect,
)
from decouple import config
from accounts.models import AccountCategory, CategoryMaster, Role, TwitterAccount, User, UserReferrals
import datetime
from rest_framework.decorators import authentication_classes, api_view
from .services import JWTOperations
from .constants import TWITTER_SCOPES, TWITTER_CALLBACK_URL
import os
import re
import base64
import logging
import hashlib
from requests_oauthlib import OAuth2Session
import json

logger = logging.getLogger(__name__)

client_id = config("CLIENT_ID")
client_secret = config("CLIENT_SECRET")
auth_url = "https://twitter.com/i/oauth2/authorize"
token_url = "https://api.twitter.com/2/oauth2/token"
redirect_uri = TWITTER_CALLBACK_URL

twitter = None

def logoutUser(request):
    response_data = {
        'isSuccess': True,
        'data': None,
        'message': 'Logged out successfully'
    }
    response = HttpResponse(content_type='application/json')

    response = JWTOperations.deleteJwtToken(res=response, cookie_name="jwt")
    response.content = json.dumps(response_data)
    return response

def storingCredsPerSession(request):
    try:
        global twitter
        # Creating a new code verifier to update the previous variables.
        code_verifier = base64.urlsafe_b64encode(os.urandom(30)).decode("utf-8")
        code_verifier = re.sub("[^a-zA-Z0-9]+", "", code_verifier)

        # Sending the code challenge to Twitter authentication.
        code_challenge = hashlib.sha256(code_verifier.encode("utf-8")).digest()
        code_challenge = base64.urlsafe_b64encode(code_challenge).decode("utf-8")
        code_challenge = code_challenge.replace("=", "")

        twitter = OAuth2Session(client_id, redirect_uri=redirect_uri, scope=TWITTER_SCOPES)
        authorization_url, state = twitter.authorization_url(
            auth_url, code_challenge=code_challenge, code_challenge_method="S256"
        )
        request.session["code_verifier"] = code_verifier
        request.session["code_challenge"] = code_challenge
        request.session["oauth_state"] = state

        print("While Making the URL, code_verifier, code_challenge", code_verifier, code_challenge)
        return authorization_url

    except Exception as e:
        print(e)
        logger.error(f"createNewCredentials - {e}")
        return None

def authTwitterUser(request, role):
    try:
        request.session["role"] = role
        referral_code = request.GET.get("referral_code", "")
        if referral_code:
            request.session["referral_code"] = referral_code
        auth_url = storingCredsPerSession(request)
        return redirect(auth_url)
    except Exception as e:
        logger.error("authTwitterUser -", e)
        if role == "business_owner":
            redirect_uri = f"{config('FRONT_END_URL')}business/?authenticationStatus=error"
        else:
            redirect_uri = f"{config('FRONT_END_URL')}influencer/?authenticationStatus=error"
        return HttpResponseRedirect(redirect_uri)


def twitterLoginCallback(request):
    # Exchange the authorization code for an access token
    code = request.GET.get("code")
    role = request.session.get("role", "")
    referral_code = request.session.get("referral_code", "")
    try:
        # Authenticate User
        authentication_result = authenticateUser(request, code)
        userData = authentication_result["userData"]
        access_token = authentication_result["access_token"]
        refresh_token = authentication_result["refresh_token"]
        # Create USER and JWT and send response
        return createJWT(userData, access_token, role, refresh_token, referral_code)
    except Exception as e:
        logger.error("Error in twitterLoginCallback -", e)
        if role == "business_owner":
            redirect_uri = f"{config('FRONT_END_URL')}business/?authenticationStatus=error"
        else:
            redirect_uri = f"{config('FRONT_END_URL')}influencer/?authenticationStatus=error"
        return HttpResponseRedirect(redirect_uri)


# Helper functions
def authenticateUser(request, code):
    global twitter
    code_verifier = request.session.get("code_verifier", "")
    print("Call back", code_verifier, twitter)
    try:
        if twitter:
            token = twitter.fetch_token(
                token_url=token_url,
                client_secret=client_secret,
                code_verifier=code_verifier,
                code=code,
            )
        else:
            twitter = OAuth2Session(client_id, redirect_uri=redirect_uri, scope=TWITTER_SCOPES)
            token = twitter.fetch_token(
                token_url=token_url,
                client_secret=client_secret,
                code_verifier=code_verifier,
                code=code,
            )
        access_token = token["access_token"]
        refresh_token = token["refresh_token"]
        print("token ==== ", token)

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
                "entities",
            ],
        ).data
        return {
            "userData": userData,
            "access_token": access_token,
            "refresh_token": refresh_token,
        }
    except Exception as e:
        logger.error("Error in authenticateUser -", e)
        return HttpResponseRedirect(
        config("FRONT_END_URL") + "influencer/?authenticationStatus=error"
    )


def manage_categories(hashtags, twitter_account):
    tags = [tag["tag"] for tag in hashtags]
    for tag in tags:
        # Check if tag exists in category master
        category = CategoryMaster.objects.filter(name=tag).first()
        if category is None:
            new_category = CategoryMaster.objects.create(
                name=tag, description=tag)
            new_category.save()
        else:
            new_category = category
        # Check if tag exists in user category
        account_category = AccountCategory.objects.filter(
            category=new_category, twitter_account=twitter_account
        ).first()

        if account_category is None:
            new_account_category = AccountCategory.objects.create(
                category=new_category, twitter_account=twitter_account
            )
            new_account_category.save()

def createUser(userData, access_token, role, refresh_token, referral_code):
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
            if userData.entities is not None:
                if userData.entities["description"] is not None:
                    hashtags = userData.entities["description"]["hashtags"]
                    manage_categories(hashtags, newUser)
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
            if existing_user.description == "":
                existing_user.description = userData.description
            existing_user.save()

        # Operations for Main User account
        current_twitter_user = TwitterAccount.objects.filter(
            twitter_id=userData.id
        ).first()
        existing_user_account = User.objects.filter(
            twitter_account=current_twitter_user
        ).first()

        # Operations for Main User account
        if existing_user_account is None:
            new_user_account = User.objects.create(
                username=userData.username,
                first_name=userData.name,
                twitter_account_id=current_twitter_user.id,
                role=Role.objects.filter(name=role).first(),
            )
            new_user_account.save()

            # New user login with referral_code - 
            if referral_code:
                # Get user account based on referral_code
                try:
                    referred_by = User.objects.get(referral_code=referral_code)
                    if referred_by:
                        UserReferrals.objects.create(user_account=new_user_account, referred_by=referred_by)
                except Exception as e:
                    return {
                        "status": "error",
                        "message": f"No referral given, invalid referral code- {referral_code}",
                    }
            

        else:
            if existing_user_account.role.name != role:
                return {
                    "status": "error",
                    "message": f"Twitter account already connect with {existing_user_account.role.name} account",
                }
            else:
                existing_user_account.last_login = datetime.datetime.now()
                existing_user_account.save()

        current_user = User.objects.filter(twitter_account=current_twitter_user).first()
        logger.info("User Successfully created/updated")
        return {"status": "success", "current_user": current_user}
    except Exception as e:
        logger.error("Error creating/updating user account -", e)
        return {
            "status": "error",
            "message": "Error creating/updating user account",
        }


# The userData here is from twitter
def createJWT(userData, access_token, role, refresh_token, referral_code):
    try:
        # Creating a response object with JWT cookie
        if role == "business_owner":
            redirect_url = f"{config('FRONT_END_URL')}business/"
        elif role == "influencer":
            redirect_url = f"{config('FRONT_END_URL')}influencer/"

        current_user_data = createUser(userData, access_token, role, refresh_token, referral_code)
        if current_user_data["status"] == "error":
            return redirect(
                redirect_url
                + f"?authenticationStatus=error&message={current_user_data['message']}"
            )

        current_user = current_user_data["current_user"]

        # Redirect influencers to their profile page.
        if role == "influencer":
            redirect_url += f"/profile/{current_user.id}"

        redirect_url += "?authenticationStatus=success"

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
        if role == "business_owner":
            redirect_uri = f"{config('FRONT_END_URL')}business/?authenticationStatus=error"
        else:
            redirect_uri = f"{config('FRONT_END_URL')}influencer/?authenticationStatus=error"
        return HttpResponseRedirect(redirect_uri)

