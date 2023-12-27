from unicodedata import category
from rest_framework import serializers
from uuid import UUID
from .models import TwitterAccount, CategoryMaster, AccountCategory, User, BankAccount, Role

class CategoryMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryMaster
        fields = "__all__"

class AccountCategorySerializer(serializers.ModelSerializer):
    category = CategoryMasterSerializer(read_only=True)
    class Meta:
        model = AccountCategory
        fields = "__all__"


class CreateAccountCategorySerializer(serializers.ModelSerializer):
    category_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True
    )

    class Meta:
        model = AccountCategory
        fields = ['category_ids']

    def create(self, validated_data):
        category_ids = validated_data.pop('category_ids', [])
        twitter_account = self.context['request'].user_account.twitter_account
        for category_id in category_ids:
            AccountCategory.objects.get_or_create(
                twitter_account=twitter_account, category_id=category_id)
        return {"account_id": twitter_account, "category_ids": category_ids}


class DeleteAccountCategorySerializer(serializers.ModelSerializer):
    account_category_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True
    )

    class Meta:
        model = AccountCategory
        fields = ['account_category_ids']


class TwitterAccountSerializer(serializers.ModelSerializer):
    account_categories = AccountCategorySerializer(
        source='cat_twitter_account_id', many=True, read_only=True)

    class Meta:
        model = TwitterAccount
        exclude = ("access_token", )


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
                   "is_staff", "is_active", "groups", "user_permissions", "jwt")


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


class OTPAuthenticationSerializer(serializers.Serializer):
    email = serializers.EmailField()


class OTPVerificationSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6)
    email = serializers.EmailField()


class EmailVerificationSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6)


class WalletAuthSerializer(serializers.Serializer):
    wallet_address_id = serializers.CharField(max_length=100)
    wallet_provider_id = serializers.CharField(max_length=100)
    wallet_network_id = serializers.CharField(max_length=100)
