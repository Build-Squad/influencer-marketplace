from unicodedata import category
from marketplace.services import truncateWalletAddress
from rest_framework import serializers

from core.serializers import LanguageMasterSerializer, RegionMasterSerializer
from orders.models import Order, OrderItem, Review
from packages.models import Package, Service
from .models import (
    AccountLanguage,
    AccountRegion,
    Bookmark,
    TwitterAccount,
    CategoryMaster,
    AccountCategory,
    User,
    BankAccount,
    Role,
    Wallet,
    WalletNetwork,
    WalletNonce,
    WalletProvider,
    BusinessAccountMetaData,
)

from django.shortcuts import get_object_or_404
from django.db.models import Avg


class BusinessAccountMetaDataSerializer(serializers.ModelSerializer):
    influencer_ids = serializers.SerializerMethodField(read_only=True)
    is_twitter_connected = serializers.SerializerMethodField(read_only=True)
    is_wallet_connected = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = BusinessAccountMetaData
        fields = "__all__"

    def get_influencer_ids(self, business_meta_data):
        completed_orders = Order.objects.filter(
            buyer=business_meta_data.user_account, status="completed"
        )
        influencer_ids = set()

        for completed_order in completed_orders:
            completed_order_items = OrderItem.objects.filter(order_id=completed_order)
            package_ids = completed_order_items.values_list("package_id", flat=True)
            influencers = Package.objects.filter(id__in=package_ids).values_list(
                "influencer_id", flat=True
            )
            influencer_ids.update(influencers)

        return list(influencer_ids)

    def get_is_twitter_connected(self, business_meta_data):
        userAccount = business_meta_data.user_account
        if userAccount.twitter_account:
            return True
        return False


    def get_is_wallet_connected(self, business_meta_data):
        user_wallet = Wallet.objects.filter(user_id = business_meta_data.user_account)
        if(user_wallet):
            return True
        return False


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
    rating = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = TwitterAccount
        exclude = ("access_token", "refresh_token")

    def get_user_id(self, twitter_account):
        user = User.objects.filter(twitter_account=twitter_account)
        return user[0].id

    def get_service_types(self, twitter_account):
        services = Service.objects.filter(
            package__influencer__twitter_account=twitter_account
        )

        # Extract service types and prices
        service_data = [
            {
                "serviceType": service.service_master.name,
                "price": service.price,
                "currencySymbol": service.currency.symbol,
                "packageStatus": Package.objects.filter(service_package_id=service)[0].status
            }
            for service in services
        ]

        return service_data

    def get_rating(self, twitter_account):
        user = get_object_or_404(User, twitter_account=twitter_account)
        reviews = Review.objects.filter(
            order__order_item_order_id__package__influencer=user,
            order__deleted_at=None,
            order__status="completed"
        )
        total_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
        return total_rating

    def get_is_bookmarked(self, twitter_account):
        if "request" in self.context and hasattr(self.context["request"], "user_account"):
            user = self.context["request"].user_account
            target_user = User.objects.get(twitter_account=twitter_account)
            bookmark = Bookmark.objects.filter(
                user_id=user, target_user=target_user)
            if bookmark:
                return True
            return False

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"


class AccountLanguageSerializer(serializers.ModelSerializer):
    language = LanguageMasterSerializer(read_only=True)

    class Meta:
        model = AccountLanguage
        fields = "__all__"


class AccountRegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountRegion
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


class WalletCompleteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Wallet
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    twitter_account = TwitterAccountSerializer(required=False)
    role = RoleSerializer(read_only=True)
    account_languages = AccountLanguageSerializer(
        many=True, read_only=True, source="acc_user_account_id"
    )
    username = serializers.CharField(required=False)
    wallets = WalletSerializer(many=True, read_only=True, source="wallet_user_id")
    region = AccountRegionSerializer(
        read_only=True, source="region_user_account"
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

    def update(self, instance, validated_data):
        # Update User fields
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get(
            'first_name', instance.first_name)
        instance.last_name = validated_data.get(
            'last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        # Update TwitterAccount fields
        twitter_account_data = validated_data.get('twitter_account')
        if twitter_account_data:
            twitter_account = instance.twitter_account
            twitter_account.description = twitter_account_data.get(
                'description', twitter_account.description)
            twitter_account.save()

        return instance


class TwitterReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TwitterAccount
        fields = ("id", "twitter_id", "name", "user_name", "profile_image_url")


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


class OTPAuthenticationV2Serializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(max_length=100)


class OTPVerificationV2Serializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6)
    email = serializers.EmailField()
    username = serializers.CharField(max_length=100)


class EmailVerificationSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6)


class WalletAuthSerializer(serializers.Serializer):
    wallet_address_id = serializers.CharField(max_length=100)
    wallet_provider_id = serializers.CharField(max_length=100)
    wallet_network_id = serializers.CharField(max_length=100)
    signature = serializers.CharField(max_length=100)
    message = serializers.CharField(max_length=255)


class WalletConnectSerializer(serializers.Serializer):
    wallet_address_id = serializers.CharField(max_length=100)
    wallet_provider_id = serializers.CharField(max_length=100, required=False)
    wallet_network_id = serializers.CharField(max_length=100, required=False)

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
        if "wallet_provider_id" in validated_data:
            wallet_provider_id = self.get_or_create_wallet_provider(
                validated_data.pop("wallet_provider_id")
            )
        else:
            wallet_provider_id = None
        if "wallet_network_id" in validated_data:
            wallet_network_id = self.get_or_create_wallet_network(
                validated_data.pop("wallet_network_id")
            )
        else:
            wallet_network_id = None
        user_account = self.context["request"].user_account

        wallet = Wallet.objects.create(
            wallet_address_id=wallet_address_id,
            wallet_provider_id=wallet_provider_id,
            wallet_network_id=wallet_network_id,
            user_id=user_account,
        )

        return wallet

class WalletNonceSerializer(serializers.ModelSerializer):

    class Meta:
        model = WalletNonce
        fields = '__all__'


class CreateBookmarkSerializer(serializers.Serializer):
    target_user = serializers.UUIDField()
