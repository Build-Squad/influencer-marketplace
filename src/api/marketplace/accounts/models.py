from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import SET_NULL
from django.dispatch import receiver
from core.models import Currency, LanguageMaster, RegionMaster
from django.db.models.signals import post_save
from core.models import Country
import uuid
from django.utils import timezone


class TwitterAccount(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="Twitter Account ID",
        default=uuid.uuid4,
        editable=False,
    )
    twitter_id = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    user_name = models.CharField(max_length=100, blank=True, null=True)
    access_token = models.CharField(max_length=255, blank=True, null=True)
    refresh_token = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    profile_image_url = models.CharField(max_length=255, blank=True, null=True)
    followers_count = models.IntegerField(blank=True, null=True)
    following_count = models.IntegerField(blank=True, null=True)
    tweet_count = models.IntegerField(blank=True, null=True)
    listed_count = models.IntegerField(blank=True, null=True)
    verified = models.BooleanField(default=False, blank=True, null=True)
    joined_at = models.DateTimeField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    url = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "twitter_account"

    def __str__(self):
        return self.user_name

class Role(models.Model):
    id = models.UUIDField(
        primary_key=True, verbose_name="Role ID", default=uuid.uuid4, editable=False
    )
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "role"

    def __str__(self):
        return self.name


class User(AbstractUser):
    STATUS_CHOICES = (("active", "active"), ("inactive", "inactive"))
    LOGIN_METHOD_CHOICES = (
        ("email", "email"), ("twitter", "twitter"), ("wallet", "wallet"))
    id = models.UUIDField(
        primary_key=True, verbose_name="User ID", default=uuid.uuid4, editable=False
    )
    email = models.EmailField(blank=True, null=True)
    username = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(
        choices=STATUS_CHOICES, max_length=25, blank=True, null=True
    )
    role = models.ForeignKey(
        Role, related_name="user_role_id", on_delete=SET_NULL, null=True, blank=True
    )
    joined_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True, blank=True)
    otp = models.CharField(max_length=25, blank=True, null=True)
    otp_expiration = models.DateTimeField(blank=True, null=True)
    email_verified_at = models.DateTimeField(blank=True, null=True)
    twitter_account = models.ForeignKey(
        TwitterAccount,
        related_name="user_twitter_account_id",
        on_delete=SET_NULL,
        null=True,
        blank=True,
    )
    jwt = models.CharField(max_length=255, blank=True, null=True)
    login_method = models.CharField(
        choices=LOGIN_METHOD_CHOICES, max_length=25, blank=True, null=True
    )
    ordering = ("email",)

    class Meta:
        db_table = "user"

    def __str__(self):
        return self.username
    
class CategoryMaster(models.Model):
    CATEGORY_CHOICES = (("custom", "custom"), ("standard", "standard"))
    id = models.UUIDField(
        primary_key=True,
        verbose_name="Category Master ID",
        default=uuid.uuid4,
        editable=False,
    )
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    show_on_main = models.BooleanField(default=False, blank=True, null=True)
    is_verified = models.BooleanField(default=False, blank=True, null=True)
    type = models.CharField(
        choices=CATEGORY_CHOICES, max_length=25, blank=True, null=True
    )
    image = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "category_master"

    def __str__(self):
        return self.name


class AccountCategory(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="Account Category ID",
        default=uuid.uuid4,
        editable=False,
    )
    twitter_account = models.ForeignKey(
        TwitterAccount,
        related_name="cat_twitter_account_id",
        on_delete=SET_NULL,
        null=True,
    )
    category = models.ForeignKey(
        CategoryMaster,
        related_name="cat_category_master_id",
        on_delete=SET_NULL,
        null=True,
    )

    class Meta:
        db_table = "account_category"

    def __str__(self):
        return self.twitter_account.user_name + " - " + self.category.name


class AccountRegion(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="Account Region ID",
        default=uuid.uuid4,
        editable=False,
    )
    user_account = models.OneToOneField(
        User,
        related_name="region_user_account",
        on_delete=SET_NULL,
        null=True,
        blank=True,
    )
    region = models.ForeignKey(
        RegionMaster,
        related_name="region_master_id",
        on_delete=SET_NULL,
        null=True,
        blank=True,
    )

    class Meta:
        db_table = "account_region"

    def __str__(self):
        return self.region.regionName


class BusinessAccountMetaData(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="Business Meta Data Id",
        default=uuid.uuid4,
        editable=False,
    )
    business_name = models.CharField(max_length=100, blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    founded = models.CharField(max_length=100, blank=True, null=True)
    headquarters = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(null=True, blank=True)
    phone = models.CharField(max_length=100, blank=True, null=True)
    website = models.CharField(max_length=100, blank=True, null=True)
    twitter_account = models.CharField(max_length=100, blank=True, null=True)
    linked_in = models.CharField(max_length=100, blank=True, null=True)
    user_account = models.ForeignKey(
        User,
        related_name="user_business_meta_data",
        on_delete=SET_NULL,
        null=True,
        blank=True,
    )
    user_email = models.EmailField(blank=True, null=True)

    class Meta:
        db_table = "business_account_meta_data"

    def __str__(self):
        return self.business_name


@receiver(post_save, sender=User)
def create_business_account_metadata(sender, instance, created, **kwargs):
    """
    Signal handler to create BusinessAccountMetaData instance when a User with role 'business_owner' is created.
    """
    if created and instance.role and instance.role.name == "business_owner":
        BusinessAccountMetaData.objects.create(
            user_account=instance, user_email=instance.email
        )


class AccountLanguage(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="Account Language ID",
        default=uuid.uuid4,
        editable=False,
    )
    user_account = models.ForeignKey(
        User, related_name="acc_user_account_id", on_delete=SET_NULL, null=True
    )
    language = models.ForeignKey(
        LanguageMaster,
        related_name="acc_language_master_id",
        on_delete=SET_NULL,
        null=True,
    )

    class Meta:
        db_table = "account_language"


class BankAccount(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="Bank Account ID",
        default=uuid.uuid4,
        editable=False,
    )
    influencer = models.ForeignKey(
        User, related_name="bank_acc_influencer_id", on_delete=SET_NULL, null=True
    )
    account_holder_name = models.CharField(max_length=150, blank=True, null=True)
    account_number = models.CharField(max_length=50, blank=True, null=True)
    bank_name = models.CharField(max_length=100, blank=True, null=True)
    branch_name = models.CharField(max_length=100, blank=True, null=True)
    account_type = models.CharField(max_length=100, blank=True, null=True)
    country = models.ForeignKey(
        Country, related_name="bank_account_country_id", on_delete=SET_NULL, null=True
    )
    currency = models.ForeignKey(
        Currency, related_name="bank_account_currency_id", on_delete=SET_NULL, null=True
    )
    is_verified = models.BooleanField(default=True, blank=True, null=True)

    class Meta:
        db_table = "bank_account"


class WalletProvider(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="Wallet Provider ID",
        default=uuid.uuid4,
        editable=False,
    )
    wallet_provider = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.wallet_provider


class WalletNetwork(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="Wallet Network ID",
        default=uuid.uuid4,
        editable=False,
    )
    wallet_network = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.wallet_network


class Wallet(models.Model):
    id = models.UUIDField(
        primary_key=True, verbose_name="Wallet ID", default=uuid.uuid4, editable=False
    )
    user_id = models.ForeignKey(
        User, related_name="wallet_user_id", on_delete=SET_NULL, null=True, blank=True
    )
    wallet_network_id = models.ForeignKey(
        WalletNetwork, related_name="wallet_network_id", on_delete=SET_NULL, null=True
    )
    wallet_provider_id = models.ForeignKey(
        WalletProvider, related_name="wallet_provider_id", on_delete=SET_NULL, null=True
    )
    is_primary = models.BooleanField(default=True, blank=True, null=True)
    wallet_address_id = models.CharField(max_length=255, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.wallet_address_id

    class Meta:
        db_table = "wallet"

    def delete(self, *args, **kwargs):
        if not self.is_primary:
            self.deleted_at = timezone.now()
            self.save()
        else:
            raise Exception('Primary wallet cannot be removed')

class WalletNonce(models.Model):
    id = models.UUIDField(
        primary_key=True, verbose_name="Wallet Nonce ID", default=uuid.uuid4, editable=False
    )
    wallet_address = models.CharField(max_length=255, blank=True, null=True)
    nonce = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.wallet_address

    class Meta:
        db_table = "wallet_nonce"
