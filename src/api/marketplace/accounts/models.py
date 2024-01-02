
from pyexpat import model
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import SET_NULL
from core.models import Currency, LanguageMaster
from core.models import Country
import uuid

class TwitterAccount(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Twitter Account ID', default=uuid.uuid4, editable=False)
    twitter_id = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    user_name = models.CharField(max_length=100, blank=True, null=True)
    access_token = models.CharField(max_length=255, blank=True, null=True)
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
        return self.name

class CategoryMaster(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Category Master ID', default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "category_master" 

class AccountCategory(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Account Category ID', default=uuid.uuid4, editable=False)
    twitter_account = models.ForeignKey(TwitterAccount, related_name='cat_twitter_account_id', on_delete=SET_NULL,
                                         null=True)
    category = models.ForeignKey(CategoryMaster, related_name='cat_category_master_id', on_delete=SET_NULL,
                                         null=True)

    class Meta:
        db_table = "account_category"


class Role(models.Model):
    id = models.UUIDField(
        primary_key=True, verbose_name='Role ID', default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "role"

class User(AbstractUser):

    STATUS_CHOICES = (
        ('active', 'active'),
        ('inactive', 'inactive')
    )


    id = models.UUIDField(primary_key=True, verbose_name='User ID', default=uuid.uuid4, editable=False)
    email = models.EmailField(blank=True, null=True)
    username = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(choices=STATUS_CHOICES, max_length=25, blank=True, null=True)
    role = models.ForeignKey(
        Role, related_name='user_role_id', on_delete=SET_NULL, null=True, blank=True)
    joined_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True, blank=True)
    otp = models.CharField(max_length=25, blank=True, null=True)
    otp_expiration = models.DateTimeField(blank=True, null=True)
    email_verified_at = models.DateTimeField(blank=True, null=True)
    twitter_account = models.ForeignKey(TwitterAccount, related_name='user_twitter_account_id', on_delete=SET_NULL,
                                         null=True, blank=True)
    jwt = models.CharField(max_length=255, blank=True, null=True)


    ordering = ('email',)

    class Meta:
        db_table = "user"

    def __str__(self):
        return self.username


class AccountLanguage(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Account Language ID', default=uuid.uuid4, editable=False)
    user_account = models.ForeignKey(User, related_name='acc_user_account_id', on_delete=SET_NULL,
                                         null=True)
    language = models.ForeignKey(LanguageMaster, related_name='acc_language_master_id', on_delete=SET_NULL,
                                         null=True)

    class Meta:
        db_table = "account_language"                       


class BankAccount(models.Model):
    
    id = models.UUIDField(
        primary_key=True, verbose_name='Bank Account ID', default=uuid.uuid4, editable=False)
    influencer = models.ForeignKey(User, related_name='bank_acc_influencer_id', on_delete=SET_NULL, null=True)
    account_holder_name = models.CharField(max_length=150, blank=True, null=True)
    account_number = models.CharField(max_length=50, blank=True, null=True)
    bank_name = models.CharField(max_length=100, blank=True, null=True)
    branch_name = models.CharField(max_length=100, blank=True, null=True)
    account_type = models.CharField(max_length=100, blank=True, null=True)
    country = models.ForeignKey(Country, related_name='bank_account_country_id', on_delete=SET_NULL, null=True)
    currency = models.ForeignKey(Currency, related_name='bank_account_currency_id', on_delete=SET_NULL, null=True)
    is_verified = models.BooleanField(default=True, blank=True, null=True)

    class Meta:
        db_table = "bank_account"          


class WalletProvider(models.Model):
    id = models.UUIDField(
        primary_key=True, verbose_name='Wallet Provider ID', default=uuid.uuid4, editable=False)
    wallet_provider = models.CharField(max_length=100, blank=True, null=True)


class WalletNetwork(models.Model):
    id = models.UUIDField(
        primary_key=True, verbose_name='Wallet Network ID', default=uuid.uuid4, editable=False)
    wallet_network = models.CharField(max_length=100, blank=True, null=True)


class Wallet(models.Model):
    id = models.UUIDField(
        primary_key=True, verbose_name='Wallet ID', default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(
        User, related_name='wallet_user_id', on_delete=SET_NULL, null=True, blank=True)
    wallet_network_id = models.ForeignKey(
        WalletNetwork, related_name='wallet_network_id', on_delete=SET_NULL, null=True)
    wallet_provider_id = models.ForeignKey(
        WalletProvider, related_name='wallet_provider_id', on_delete=SET_NULL, null=True)
    is_primary = models.BooleanField(default=True, blank=True, null=True)
    wallet_address_id = models.CharField(max_length=255, blank=True, null=True)
