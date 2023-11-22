from unicodedata import name
from django.db import models
import uuid
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.db.models import SET_NULL
from django.conf import settings
from core.models import Currency
from core.models import Country
from packages.models import Package, ServiceMaster

class Order(models.Model):

    id = models.UUIDField(primary_key=True, verbose_name='Order', default=uuid.uuid4, editable=False)
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='order_buyer_id', on_delete=SET_NULL, null=True)
    package = models.ForeignKey(Package, related_name='order_package_id', on_delete=SET_NULL, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    currency = models.ForeignKey(Currency, related_name='order_currency_id', on_delete=SET_NULL, null=True)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "order" 

class OrderItem(models.Model):
    
    id = models.UUIDField(primary_key=True, verbose_name='OrderItem', default=uuid.uuid4, editable=False)
    service_master = models.ForeignKey(ServiceMaster, related_name='order_item_service_master_id', on_delete=SET_NULL, null=True)
    quantity = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=100, blank=True, null=True)
    order_id = models.ForeignKey(Order, related_name='order_item_order_id', on_delete=SET_NULL, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    currency = models.ForeignKey(Currency, related_name='order_item_currency_id', on_delete=SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "order_item" 

class OrderAttachment(models.Model):
    
    id = models.UUIDField(primary_key=True, verbose_name='OrderAttachment', default=uuid.uuid4, editable=False)
    order_id = models.ForeignKey(Order, related_name='order_attachment_order_id', on_delete=SET_NULL, null=True)
    filename = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "order_attachment"    

class OrderItemTracking(models.Model):
    
    id = models.UUIDField(primary_key=True, verbose_name='OrderItemTracking', default=uuid.uuid4, editable=False)
    order_item = models.ForeignKey(OrderItem, related_name='order_item_id', on_delete=SET_NULL, null=True)
    status = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = "order_item_tracking" 

class OrderMessage(models.Model):
    
    STATUS_CHOICES = (
        ('sent', 'sent'),
        ('delivered', 'delivered'),
        ('read', 'read')
    )

    id = models.UUIDField(primary_key=True, verbose_name='OrderMessage', default=uuid.uuid4, editable=False)
    status = models.CharField(choices=STATUS_CHOICES, max_length=50, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    sender_id = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sender_id', on_delete=SET_NULL, null=True)
    receiver_id = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='receiver_id', on_delete=SET_NULL, null=True)
    order_id = models.ForeignKey(Order, related_name='order_message_order_id', on_delete=SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "order_message"  

class OrderMessageAttachment(models.Model):
    
    id = models.UUIDField(primary_key=True, verbose_name='OrderMessageAttachment', default=uuid.uuid4, editable=False)
    order_message = models.ForeignKey(OrderMessage, related_name='order_message_id', on_delete=SET_NULL, null=True)
    filename = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "order_message_attachment"    

class Transaction(models.Model):
    
    TYPE_CHOICES = (
        ('debit', 'debit'),
        ('credit', 'credit')
    )

    STATUS_CHOICES = (
        ('pending', 'pending'),
        ('completed', 'completed'),
        ('failed', 'failed'),
        ('cancelled', 'cancelled'),
        ('refunded', 'refunded'),
        ('processing', 'processing')
    )

    id = models.UUIDField(primary_key=True, verbose_name='Transactions', default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, related_name='tranaction_order_id', on_delete=SET_NULL, null=True)
    transaction_reference_id = models.CharField(max_length=100, blank=True, null=True)
    transaction_type = models.CharField(choices=TYPE_CHOICES, max_length=50, blank=True, null=True)
    transaction_status = models.CharField(choices=STATUS_CHOICES, max_length=50, blank=True, null=True)
    transaction_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    currency = models.ForeignKey(Currency, related_name='transaction_currency_id', on_delete=SET_NULL, null=True)
    note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)

    class Meta:
        db_table = "transaction"    

class Review(models.Model):

    id = models.UUIDField(primary_key=True, verbose_name='Review', default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, related_name='review_order_id', on_delete=SET_NULL, null=True)
    note = models.TextField(blank=True, null=True)
    is_visible = models.BooleanField(default=True, blank=True, null=True)

    class Meta:
        db_table = "review"            




