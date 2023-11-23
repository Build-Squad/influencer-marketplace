from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
import jwt
from decouple import config
from accounts.models import TwitterAccount


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get("jwt")
        if not token:
            raise exceptions.AuthenticationFailed('JWT Token not present!')
        try:
            payload = jwt.decode(token, config("JWT_SECRET"), algorithms=["HS256"])
        except jwt.DecodeError:
            raise exceptions.AuthenticationFailed('Invalid JWT token')
        
        # Extract user ID from the payload
        user_id = payload.get('id')

        if not user_id:
            raise exceptions.AuthenticationFailed('Invalid JWT payload')
        
        # Retrieve the corresponding user object
        try:
            user = TwitterAccount.objects.filter(twitter_id=payload["id"]).first()
        except TwitterAccount.DoesNotExist:
            raise exceptions.AuthenticationFailed('User does not exist')
        return user, token
