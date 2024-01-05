from unicodedata import category
from rest_framework import serializers
from uuid import UUID

from core.serializers import LanguageMasterSerializer
from packages.models import Service
from .models import (
    AccountLanguage,
    TwitterAccount,
    CategoryMaster,
    AccountCategory,
    User,
    BankAccount,
    Role,
    Wallet,
    WalletNetwork,
    WalletProvider,
)


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
    category_ids = serializers.ListField(child=serializers.UUIDField(), write_only=True)

    class Meta:
        model = AccountCategory
        fields = ["category_ids"]

    def create(self, validated_data):
        category_ids = validated_data.pop("category_ids", [])
        twitter_account = self.context["request"].user_account.twitter_account
        for category_id in category_ids:
            AccountCategory.objects.get_or_create(
                twitter_account=twitter_account, category_id=category_id
            )
        return {"account_id": twitter_account, "category_ids": category_ids}


class DeleteAccountCategorySerializer(serializers.ModelSerializer):
    account_category_ids = serializers.ListField(
        child=serializers.UUIDField(), write_only=True
    )

    class Meta:
        model = AccountCategory
        fields = ["account_category_ids"]


class TwitterAccountSerializer(serializers.ModelSerializer):
    account_categories = AccountCategorySerializer(
        source="cat_twitter_account_id", many=True, read_only=True
    )
    service_types = serializers.SerializerMethodField()

    class Meta:
        model = TwitterAccount
        exclude = ("access_token",)

    def get_service_types(self, twitter_account):
        services = Service.objects.filter(
            package__influencer__twitter_account=twitter_account
        )

        # Extract service types and prices
        service_data = [
            {"serviceType": service.service_master.name, "price": service.price}
            for service in services
        ]

        return service_data


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"


class AccountLanguageSerializer(serializers.ModelSerializer):
    language = LanguageMasterSerializer(read_only=True)

    class Meta:
        model = AccountLanguage
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    twitter_account = TwitterAccountSerializer(read_only=True)
    role = RoleSerializer(read_only=True)
    account_languages = AccountLanguageSerializer(
        many=True, read_only=True, source="acc_user_account_id"
    )

    class Meta:
        model = User
        exclude = (
            "password",
            "otp",
            "otp_expiration",
            "is_superuser",
            "is_staff",
            "is_active",
            "groups",
            "user_permissions",
            "jwt",
        )


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


class WalletConnectSerializer(serializers.Serializer):
    wallet_address_id = serializers.CharField(max_length=100)
    wallet_provider_id = serializers.CharField(max_length=100)
    wallet_network_id = serializers.CharField(max_length=100)

    # From the request.user_account, add a wallet to that particular user id
    def create(self, validated_data):
        wallet_address_id = validated_data.pop("wallet_address_id")
        wallet_provider_id = WalletProvider.objects.get(
            wallet_provider=validated_data.pop("wallet_provider_id")
        )
        wallet_network_id = WalletNetwork.objects.get(
            wallet_network=validated_data.pop("wallet_network_id")
        )
        user_account = self.context["request"].user_account

        # Check if there are any other wallets for the user
        other_wallets = Wallet.objects.filter(user_id=user_account).exists()

        wallet = Wallet.objects.create(
            wallet_address_id=wallet_address_id,
            wallet_provider_id=wallet_provider_id,
            wallet_network_id=wallet_network_id,
            user_id=user_account,
            is_primary=not other_wallets,  # Set is_primary to True if there are no other wallets
        )

        return wallet


class WalletProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletProvider
        fields = "__all__"


class WalletNetworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletNetwork
        fields = "__all__"


class WalletSerializer(serializers.ModelSerializer):
    wallet_provider_id = WalletProviderSerializer(read_only=True)
    wallet_network_id = WalletNetworkSerializer(read_only=True)

    class Meta:
        model = Wallet
        fields = "__all__"
