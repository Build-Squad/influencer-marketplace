from datetime import *
from django.utils import timezone
from django.db import models
import uuid
from django.contrib.auth.models import User
from django.db.models import SET_NULL
from django.conf import settings
from core.models import Currency
from core.models import Country
from django.core.exceptions import ValidationError


class Package(models.Model):
    TYPE_CHOICES = (
        ('package', 'package'),
        ('service', 'service')
    )

    STATUS_CHOICES = (
        ('draft', 'draft'),
        ('published', 'published'),
    )

    id = models.UUIDField(primary_key=True, verbose_name='Package', default=uuid.uuid4, editable=False)
    influencer = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='created_by_user', on_delete=SET_NULL,
                                   null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(choices=STATUS_CHOICES,
                              max_length=50, default='draft')
    publish_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    type = models.CharField(choices=TYPE_CHOICES,
                            max_length=50, default='service')

    class Meta:
        db_table = "package"

    def delete(self, *args, **kwargs):
        if self.service_package_id.exists():
            raise ValidationError("This package is being used in a service and cannot be deleted.")
        else:
            self.deleted_at = timezone.now()
            self.save()

    def __str__(self):
        return self.name


class ServiceMaster(models.Model):
    TYPE_CHOICES = (
        ('standard', 'standard'),
        ('custom', 'custom')
    )

    TWITTER_SERVICES_TYPES = (
        ('tweet', 'tweet'),
        ('like_tweet', 'like_tweet'),
        ('reply_to_tweet', 'reply_to_tweet'),
        ('quote_tweet', 'quote_tweet'),
        ('poll', 'poll'),
        ('retweet', 'retweet'),
        ('thread', 'thread'),
    )

    id = models.UUIDField(primary_key=True, verbose_name='ServiceMaster', default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    limit = models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(choices=TYPE_CHOICES, max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    is_duration_based = models.BooleanField(default=False)
    twitter_service_type = models.CharField(
        choices=TWITTER_SERVICES_TYPES, max_length=50, blank=True, null=True)

    class Meta:
        db_table = "service_master"

    def delete(self, *args, **kwargs):
        if self.service_master_id.exists():
            raise ValidationError("This service is being used in a service and cannot be deleted.")
        else:
            self.deleted_at = timezone.now()
            self.save()

    def __str__(self):
        return self.name


class Service(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Service', default=uuid.uuid4, editable=False)
    service_master = models.ForeignKey(ServiceMaster, related_name='service_master_id', on_delete=SET_NULL, null=True)
    package = models.ForeignKey(Package, related_name='service_package_id', on_delete=SET_NULL, null=True)
    quantity = models.IntegerField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    currency = models.ForeignKey(Currency, related_name='service_currency_id', on_delete=SET_NULL, null=True)
    platform_fees = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "service"

    def delete(self, *args, **kwargs):
        self.deleted_at = timezone.now()
        self.save()

    def __str__(self):
        return self.package.name


class ServiceMasterMetaData(models.Model):
    TYPE_CHOICES = (
        ('text', 'text'),
        ('long_text', 'long_text'),
        ('date_time', 'date_time'),
        ('media', 'media'),
    )

    FIELD_NAME_CHOICED = (
        ('instructions', 'instructions'),
        ('text', 'text'),
        ('tweet_id', 'tweet_id'),
        ('in_reply_to_tweet_id', 'in_reply_to_tweet_id'),
        ('poll_options', 'poll_options'),
        ('poll_duration_minutes', 'poll_duration_minutes')
    )

    id = models.UUIDField(
        primary_key=True, verbose_name='ServiceMasterMetaData', default=uuid.uuid4, editable=False)
    field_name = models.CharField(choices=FIELD_NAME_CHOICED, max_length=50, blank=True, null=True)
    label = models.CharField(max_length=100, blank=True, null=True)
    placeholder = models.CharField(max_length=100, blank=True, null=True)
    min = models.CharField(max_length=100, blank=True, null=True)
    max = models.CharField(max_length=100, blank=True, null=True)
    span = models.IntegerField(blank=True, null=True)
    field_type = models.CharField(choices=TYPE_CHOICES,
                                  max_length=50, default='text')
    order = models.IntegerField(blank=True, null=True)
    service_master_id = models.ForeignKey(
        ServiceMaster, related_name='service_master_meta_data_id', on_delete=models.SET_NULL, null=True)
    regex = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = "service_master_meta_data"

    def __str__(self):
        return self.field_name + ' - ' + self.service_master_id.name
