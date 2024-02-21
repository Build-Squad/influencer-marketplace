from rest_framework.views import APIView
from accounts.models import User
from marketplace.authentication import JWTAuthentication
from decouple import config
from rest_framework.response import Response
from rest_framework import status
from marketplace.services import (
    handleServerException,
)


class ReferralLink(APIView):
    def createLink(self,code):
        hostname = config('SERVER')
        return f"{hostname}auth-twitter-user/influencer/?referral_code={code}"
    
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        try:
            referral_code = request.user_account.referral_code
            if referral_code:
                referralLink = self.createLink(referral_code)
            if referral_code and referralLink:
                return Response(
                    {
                        "isSuccess": True,
                        "data": {"referralLink": referralLink},
                        "message": "User Referrals retrieved successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "isSuccess": False,
                        "data": None,
                        "message": "User Referrals not found",
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            return handleServerException(e)
        
class ReferralValidity(APIView):
    def check_validity(self, code):
            try:
                User.objects.get(referral_code=code)
                return True
            except User.DoesNotExist:
                return False
    def get(self, request):
        try:
            referral_code = request.GET.get("referral_code", "")
            is_valid = self.check_validity(referral_code)
            return Response(
                {
                    "isSuccess": is_valid,
                    "data": {"isValid": is_valid},
                    "message": f"Is referral code valid? - {is_valid}",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)