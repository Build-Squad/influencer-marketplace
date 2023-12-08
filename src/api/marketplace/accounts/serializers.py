from rest_framework import serializers
from .models import TwitterAccount, CategoryMaster, AccountCategory, User, BankAccount, Role


class TwitterAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = TwitterAccount
        fields = "__all__"


class CategoryMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryMaster
        fields = "__all__"


class AccountCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountCategory
        fields = "__all__"


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    twitter_account = TwitterAccountSerializer(read_only=True)
    role = RoleSerializer(read_only=True)

    class Meta:
        model = User
        exclude = ("password", "otp", "otp_expiration", "is_superuser",
                   "is_staff", "is_active", "groups", "user_permissions")


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = "__all__"


class TwitterAuthSerializer(serializers.Serializer):
    role = serializers.CharField(max_length=100)
