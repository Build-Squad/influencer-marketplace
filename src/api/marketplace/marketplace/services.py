import jwt
from decouple import config
from rest_framework import exceptions


# JWT cookie related operations
class JWTOperations:
    def getPayload(req, cookie_name):
        token = req.COOKIES.get(cookie_name)
        if not token:
            raise exceptions.AuthenticationFailed("JWT Token not present in the request!")
        try:
            payload = jwt.decode(token, config("JWT_SECRET"), algorithms=["HS256"])
        except jwt.DecodeError:
            raise exceptions.AuthenticationFailed("Invalid JWT token")
        return payload, token

    def setJwtToken(res, payload, cookie_name):
        token = jwt.encode(payload, config("JWT_SECRET"), algorithm="HS256")
        res.set_cookie(
            cookie_name,
            token,
            max_age=86400,  # Expires after the day it is generated.
            path="/",
            secure=True,
            httponly=True,
            samesite="None",
        )
        return res

    def deleteJwtToken(res, cookie_name):
        res.set_cookie(
            cookie_name,
            "",
            max_age=0,
            secure=True,
            httponly=True,
            samesite="None",
        )
        return res
