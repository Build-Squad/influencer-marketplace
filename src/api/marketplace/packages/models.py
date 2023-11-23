from datetime import *
from django.utils import timezone
from unicodedata import name
from django.db import models
import uuid
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.db.models import SET_NULL
from django.conf import settings
from core.models import Currency
from core.models import Country

class Package(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Package', default=uuid.uuid4, editable=False)
    influencer = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='created_by_user', on_delete=SET_NULL, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    currency = models.ForeignKey(Currency, related_name='package_currency_id', on_delete=SET_NULL, null=True)
    status = models.CharField(max_length=100, blank=True, null=True)
    publish_date = models.DateTimeField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "package" 

    def delete (self, *args, **kwargs):
        self.deleted_at = timezone.now()
        self.save()

class ServiceMaster(models.Model):

    TYPE_CHOICES = (
        ('standard', 'standard'),
        ('custom', 'custom')
    )

    id = models.UUIDField(primary_key=True, verbose_name='ServiceMaster', default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    limit = models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(choices=TYPE_CHOICES, max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "service_master" 

    def delete (self, *args, **kwargs):
        self.deleted_at = timezone.now()
        self.save()

class Service(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Service', default=uuid.uuid4, editable=False)
    service_master = models.ForeignKey(ServiceMaster, related_name='service_master_id', on_delete=SET_NULL, null=True)
    package = models.ForeignKey(Package, related_name='service_package_id', on_delete=SET_NULL, null=True)
    quantity = models.IntegerField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    currency = models.ForeignKey(Currency, related_name='service_currency_id', on_delete=SET_NULL, null=True)
    status = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    class Meta:
        db_table = "service"   

    def delete (self, *args, **kwargs):
        self.deleted_at = timezone.now()
        self.save()

      






