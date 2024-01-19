from unicodedata import category
from marketplace.services import truncateWalletAddress
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
    BusinessAccountMetaData,
)


class BusinessAccountMetaDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessAccountMetaData
        fields = "__all__"


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
    user_id = serializers.SerializerMethodField()

    class Meta:
        model = TwitterAccount
        exclude = ("access_token",)

    def get_user_id(self, twitter_account):
        user = User.objects.filter(twitter_account=twitter_account)
        return user[0].id

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

    # Truncate the address to first 4 and last 4 characters
    wallet_address_id = serializers.SerializerMethodField()

    def get_wallet_address_id(self, wallet):
        if wallet.wallet_address_id:
            return truncateWalletAddress(wallet.wallet_address_id)
        return None

    class Meta:
        model = Wallet
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    twitter_account = TwitterAccountSerializer(read_only=True)
    role = RoleSerializer(read_only=True)
    account_languages = AccountLanguageSerializer(
        many=True, read_only=True, source="acc_user_account_id"
    )
    username = serializers.CharField(required=False)
    wallets = WalletSerializer(many=True, read_only=True, source="wallet_user_id")

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


class TwitterReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TwitterAccount
        fields = ("id", "twitter_id", "name", "user_name")


class InfluencerSerializer(serializers.ModelSerializer):
    # Only return the twitter username and first name last name and the id of the user
    twitter_account = TwitterReadSerializer(read_only=True)

    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "twitter_account")


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

    def get_or_create_wallet_provider(self, name):
        try:
            wallet_provider = WalletProvider.objects.get(wallet_provider=name)
            return wallet_provider
        except WalletProvider.DoesNotExist:
            wallet_provider = WalletProvider.objects.create(wallet_provider=name)
            wallet_provider.save()
            return wallet_provider

    def get_or_create_wallet_network(self, name):
        try:
            return WalletNetwork.objects.get(wallet_network=name)
        except WalletNetwork.DoesNotExist:
            wallet_network = WalletNetwork.objects.create(wallet_network=name)
            wallet_network.save()
            return wallet_network

    # From the request.user_account, add a wallet to that particular user id
    def create(self, validated_data):
        wallet_address_id = validated_data.pop("wallet_address_id")
        wallet_provider_id = self.get_or_create_wallet_provider(
            validated_data.pop("wallet_provider_id")
        )
        wallet_network_id = self.get_or_create_wallet_network(
            validated_data.pop("wallet_network_id")
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
