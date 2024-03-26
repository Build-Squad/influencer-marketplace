from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import RewardPoints, UserReferrals

class RewardPointsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardPoints
        fields = "__all__"

class UserReferralsSerializer(serializers.ModelSerializer):
    referred_by = UserSerializer(read_only=True)
    user_account = UserSerializer(read_only=True)
    referred_by_reward_point = RewardPointsSerializer(read_only=True)
    class Meta:
        model = UserReferrals
        fields = "__all__"