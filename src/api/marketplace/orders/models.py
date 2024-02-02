from email.policy import default
from enum import unique
from django.db import models
import uuid
from django.db.models import SET_NULL
from django.conf import settings
from core.models import Currency
from packages.models import Package, ServiceMaster
from django.utils import timezone
import random
import string


def generate_order_code():
    while True:
        code = ''.join(random.choices(
            string.ascii_uppercase + string.digits, k=12))
        code = '-'.join(code[i:i+4] for i in range(0, len(code), 4))
        if not Order.objects.filter(order_code=code).exists():
            return code


def generate_order_number():
    while True:
        number = random.randint(100000, 999999)
        if not Order.objects.filter(order_number=number).exists():
            return number

class Order(models.Model):

    STATUS_CHOICES = (
        ('draft', 'draft'),
        ('pending', 'pending'),
        ('accepted', 'accepted'),
        ('rejected', 'rejected'),
        ('completed', 'completed'),
    )

    id = models.UUIDField(primary_key=True, verbose_name='Order', default=uuid.uuid4, editable=False)
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='order_buyer_id', on_delete=SET_NULL, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    currency = models.ForeignKey(
        Currency, related_name='order_currency_id', on_delete=SET_NULL, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(choices=STATUS_CHOICES,
                              max_length=50, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    order_code = models.CharField(
        max_length=16, default=generate_order_code, unique=True)
    order_number = models.IntegerField(
        unique=True, default=generate_order_number)
    influencer_transaction_address = models.CharField(
        max_length=100, blank=True, null=True)
    buyer_transaction_address = models.CharField(
        max_length=100, blank=True, null=True)

    class Meta:
        db_table = "order" 

    def __str__(self):
        return self.order_code + " - " + (self.buyer.username if self.buyer else 'No buyer') + " - " + self.status + " - " + str(self.created_at)

    # Delete only if draft
    def delete(self, *args, **kwargs):
        """
        1. Soft delete the order
        2. Only if the order is in draft status
        """
        if self.status == 'draft':
            self.deleted_at = timezone.now()
            self.save()
        else:
            raise Exception('Cannot delete order after payment is made')

class OrderItem(models.Model):
    
    STATUS_CHOICES = (
        ('in_progress', 'in_progress'),
        ('cancelled', 'cancelled'),
        ('rejected', 'rejected'),
        ('accepted', 'accepted'),
        ('scheduled', 'scheduled'),
        ('published', 'published'),
    )

    id = models.UUIDField(primary_key=True, verbose_name='OrderItem', default=uuid.uuid4, editable=False)
    service_master = models.ForeignKey(ServiceMaster, related_name='order_item_service_master_id', on_delete=SET_NULL, null=True)
    quantity = models.IntegerField(blank=True, null=True)
    status = models.CharField(choices=STATUS_CHOICES,
                              max_length=50, default='in_progress')
    order_id = models.ForeignKey(Order, related_name='order_item_order_id', on_delete=SET_NULL, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    currency = models.ForeignKey(Currency, related_name='order_item_currency_id', on_delete=SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    package = models.ForeignKey(
        Package, related_name='order_item_package_id', on_delete=SET_NULL, null=True)
    platform_fee = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    published_tweet_id = models.CharField(
        max_length=100, blank=True, null=True)
    publish_date = models.DateTimeField(blank=True, null=True)
    celery_task_id = models.CharField(
        max_length=100, blank=True, null=True)

    class Meta:
        db_table = "order_item" 

    def __str__(self):
        return (self.service_master.name if self.service_master else 'No service master') + " - " + (self.status if self.status else 'No status') + " - " + str(self.created_at)

    def delete(self, *args, **kwargs):
        """
        1. Soft delete the order item
        2. Only if the order item is in draft status
        """
        # Check that the order is in draft status
        if self.order_id.status == 'draft':
            self.deleted_at = timezone.now()
            self.save()
        else:
            raise Exception('Cannot delete order item after payment is made')

class OrderAttachment(models.Model):
    
    id = models.UUIDField(
        primary_key=True, verbose_name='OrderAttachment', default=uuid.uuid4, editable=False)
    filename = models.TextField(blank=True, null=True)
    order_item = models.ForeignKey(
        OrderItem, related_name='order_attachment_order_item_id', on_delete=SET_NULL, null=True)
    file_type = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = "order_attachment"    

    def __str__(self):
        return self.filename + " - " + self.file_type


class OrderItemMetaData(models.Model):
    TYPE_CHOICES = (
        ('text', 'text'),
        ('long_text', 'long_text'),
        ('date_time', 'date_time'),
        ('media', 'media'),
    )

    id = models.UUIDField(
        primary_key=True, verbose_name='ServiceMasterMetaData', default=uuid.uuid4, editable=False)
    label = models.CharField(max_length=100, blank=True, null=True)
    span = models.IntegerField(blank=True, null=True)
    field_type = models.CharField(choices=TYPE_CHOICES,
                                  max_length=50, default='text')
    order_item = models.ForeignKey(
        OrderItem, related_name='order_item_meta_data_order_item_id', on_delete=SET_NULL, null=True)
    value = models.TextField(blank=True, null=True)
    min = models.CharField(max_length=100, blank=True, null=True)
    max = models.CharField(max_length=100, blank=True, null=True)
    placeholder = models.CharField(max_length=100, blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)
    field_name = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = "order_item_meta_data"

    def __str__(self):
        return (self.label if self.label else 'No label') + " - " + (self.field_type if self.field_type else 'No field type')

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
    status = models.CharField(choices=STATUS_CHOICES,
                              max_length=50, default='sent')
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
    rating = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = "review"            




