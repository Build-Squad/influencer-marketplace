
from pyexpat import model
from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# class Role(models.Model):
#     id = models.UUIDField(primary_key=True, verbose_name='Role ID', default=uuid.uuid4, editable=False)
#     name = models.CharField(max_length=50, unique=True)

#     class Meta:
#         db_table = "role"

class TwitterAccount(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Twitter Account ID', default=uuid.uuid4, editable=False)
    twitter_id = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "twitter_account"

class CategoryMaster(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Category Master ID', default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "category_master" 

class AccountCategory(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Account Category ID', default=uuid.uuid4, editable=False)
    twitter_account_id = models.ForeignKey(TwitterAccount, related_name='cat_twitter_account_id', on_delete=models.DO_NOTHING,
                                         null=True)
    category_id = models.ForeignKey(CategoryMaster, related_name='cat_category_master_id', on_delete=models.DO_NOTHING,
                                         null=True)

    class Meta:
        db_table = "account_category"                       

class User(AbstractUser):

    STATUS_CHOICES = (
        ('active', 'active'),
        ('inactive', 'inactive')
    )

    ROLE_CHOICES = (
        ('business_owner', 'business_owner'),
        ('influencer', 'influencer')
    )

    id = models.UUIDField(primary_key=True, verbose_name='User ID', default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(choices=STATUS_CHOICES, max_length=25, blank=True, null=True)
    role = models.CharField(choices=ROLE_CHOICES, max_length=50, blank=True)
    joined_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True, blank=True)
    otp = models.CharField(max_length=25, blank=True, null=True)
    otp_expiration = models.DateTimeField(blank=True, null=True)
    twitter_account_id = models.ForeignKey(TwitterAccount, related_name='user_twitter_account_id', on_delete=models.DO_NOTHING,
                                         null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['email']
    ordering = ('email',)

    class Meta:
        db_table = "user"
