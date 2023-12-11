from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from accounts.models import User
from .services import JWTOperations

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        try:
            payload, token = JWTOperations.getPayload(
                req=request, cookie_name="jwt")

            # Check for the expiration of the token
            if JWTOperations.isTokenExpired(payload):
                raise exceptions.AuthenticationFailed("Token has expired")

            # Extract user ID from the payload
            user_id = payload.get("id")
            if not user_id:
                raise exceptions.AuthenticationFailed(
                    "No user ID found in the token")

            # Retrieve the corresponding user object
            try:
                userAccount = User.objects.get(id=user_id)
            except userAccount.DoesNotExist:
                raise exceptions.AuthenticationFailed(
                    "No user found for the given token")

            request.user_account = userAccount
            request.token = token
        except Exception as e:
            print("Error", e)
            raise exceptions.AuthenticationFailed(e)
