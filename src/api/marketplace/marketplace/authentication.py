from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from accounts.models import TwitterAccount
from .services import JWTOperations

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        payload, token = JWTOperations.getPayload(req=request, cookie_name="jwt")

        # Extract user ID from the payload
        user_id = payload.get("id")
        if not user_id:
            raise exceptions.AuthenticationFailed("Invalid JWT payload")

        # Retrieve the corresponding user object
        try:
            twitterUser = TwitterAccount.objects.filter(
                twitter_id=payload["id"]
            ).first()
        except TwitterAccount.DoesNotExist:
            raise exceptions.AuthenticationFailed("User does not exist")
        request.twitterUser = twitterUser
        request.token = token
