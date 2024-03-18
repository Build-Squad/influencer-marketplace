import datetime
from decouple import config
from random import randint

from notifications.models import Notification

from .models import User

from tweepy import Client, OAuth2UserHandler


FRONT_END_URL = config('FRONT_END_URL')


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

        self.USER_FIELDS = [
            "description",
            "profile_image_url",
            "public_metrics",
            "verified",
        ]

        self.callback_url = f"{config('SERVER')}account/twitter-auth"

        # This is OAuth2.0 PKCE authentication instance that'll be used to interact with Client for V2 version of API
        self.oauth2_user_handler = OAuth2UserHandler(
            client_id=config("CLIENT_ID"),
            redirect_uri=self.callback_url,
            scope=self.SCOPES,
            client_secret=config("CLIENT_SECRET"),
        )

    def get_twitter_oauth_url(self):
        auth_url = self.oauth2_user_handler.get_authorization_url()
        return auth_url

    def get_twitter_access_token(self, authorization_response_url):
        access_token_obj = self.oauth2_user_handler.fetch_token(
            authorization_response_url)
        access_token = access_token_obj["access_token"]
        return access_token

    def get_twitter_client_data(self, request):
        authorization_response_url = request.build_absolute_uri()
        access_token = self.get_twitter_access_token(
            authorization_response_url)
        client = Client(access_token)
        userData = client.get_me(
            user_auth=False, user_fields=self.USER_FIELDS).data
        return userData

    def get_jwt_payload(self, twitter_user):
        payload = {
            "id": twitter_user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=86400),
            "iat": datetime.datetime.utcnow(),
        }
        return payload


class OTPAuthenticationService:
    def __init__(self):
        pass

    def generateOTP(self):
        try:
            otp = randint(100000, 999999)
            otp_expiration = datetime.datetime.now(
                datetime.timezone.utc) + datetime.timedelta(seconds=300)
            return otp, otp_expiration
        except Exception as e:
            raise e

    def validateOTP(self, otp, user):
        try:
            otp = int(otp)
            user_otp = int(user.otp)
            if user_otp == otp and user.otp_expiration > datetime.datetime.now(datetime.timezone.utc):
                return True
            return False
        except Exception as e:
            raise e


def create_inlfuencer_account_notification(user: User):
    try:
        INLFUENCER_PROFILE_SLUG = FRONT_END_URL + \
            '/influencer/profile' + str(user.id)

        # Club the above 3 notifications in one notification
        Notification.objects.create(
            title='Welcome to Xfluencer',
            message='We are excited to have you on board! To get started, please complete your profile (Bio, Categories, Email, etc.), add your Web3 wallet to your account to receive payouts, and start earning money by listing services for businesses.',
            slug=INLFUENCER_PROFILE_SLUG,
            user_id=user
        )
    except Exception as e:
        raise e


def create_business_account_notification(user: User):
    try:
        BUSINESS_PROFILE_SLUG = FRONT_END_URL + '/business/profile?tab=wallet'
        BUSINESS_EXPLORE_SLUG = FRONT_END_URL + '/business/explore'

        notifications = []
        notifications.append({
            'title': 'Complete Your Profile',
            'message': 'Let influencers and other businesses know more about your brand by completing your profile. Add your company details, update your bio, and share your business goals.',
            'slug': BUSINESS_PROFILE_SLUG,
            'user_id': user.id
        })
        notifications.append({
            'title': 'Explore Influencers & Purchase Services',
            'message': 'Discover influencers who align with your brand values and target audience. Explore their profiles, and purchase their services to promote your brand and reach new audiences',
            'slug': BUSINESS_EXPLORE_SLUG,
            'user_id': user.id
        })
        Notification.objects.bulk_create(
            [Notification(**notification) for notification in notifications]
        )
    except Exception as e:
        raise e


def create_signup_notification(user: User):
    try:
        if user.role.name == 'influencer':
            create_inlfuencer_account_notification(user=user)
        elif user.role.name == 'business_owner':
            create_business_account_notification(user=user)
    except Exception as e:
        raise e
