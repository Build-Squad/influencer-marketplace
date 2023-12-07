from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from accounts.models import User
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
            userAccount = User.objects.filter(
                id=payload["id"]
            ).first()
        except userAccount.DoesNotExist:
            raise exceptions.AuthenticationFailed("User does not exist")
        request.user_account = userAccount
        request.token = token
