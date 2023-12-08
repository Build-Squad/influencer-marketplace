
from pyexpat import model
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import SET_NULL
from core.models import Currency
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
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(choices=STATUS_CHOICES, max_length=25, blank=True, null=True)
    role = models.ForeignKey(
        Role, related_name='user_role_id', on_delete=SET_NULL, null=True, blank=True)
    joined_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True, blank=True)
    otp = models.CharField(max_length=25, blank=True, null=True)
    otp_expiration = models.DateTimeField(blank=True, null=True)
    twitter_account = models.ForeignKey(TwitterAccount, related_name='user_twitter_account_id', on_delete=SET_NULL,
                                         null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    ordering = ('email',)

    class Meta:
        db_table = "user"

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
