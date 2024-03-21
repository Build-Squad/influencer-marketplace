from rest_framework import serializers

from .models import UserReferrals

class UserReferralsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserReferrals
        fields = "__all__"