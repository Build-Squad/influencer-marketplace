from locale import currency
from accounts.serializers import UserSerializer
from core.serializers import CurrencySerializer
from packages.serializers import PackageSerializer, ServiceMasterReadSerializer
from packages.models import Service
from rest_framework import serializers
from .models import Order, OrderItem, OrderAttachment, OrderItemMetaData, OrderItemTracking, OrderMessage, OrderMessageAttachment, Transaction, Review
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist


class OrderItemSerializer(serializers.ModelSerializer):
    package = PackageSerializer(read_only=True)
    service_master = ServiceMasterReadSerializer(read_only=True)
    currency = CurrencySerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):

    buyer = UserSerializer(read_only=True)
    order_item_order_id = OrderItemSerializer(many=True, read_only=True)
    review = ReviewSerializer(read_only=True)
    amount = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'

    def get_amount(self, obj):
        # Should return the sum of the price of each order item and also add the platform fee
        order_items = obj.order_item_order_id.all()
        amount = 0
        for order_item in order_items:
            amount += order_item.price
            amount += (order_item.price * order_item.platform_fee / 100)
        return amount

    def get_currency(self, obj):
        # Should return the currency of the first order item
        first_order_item = obj.order_item_order_id.first()
        if first_order_item:
            return CurrencySerializer(first_order_item.currency).data
        return None


class OrderItemMetaDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemMetaData
        fields = '__all__'


class MetaDataSerializer(serializers.Serializer):
    value = serializers.CharField(allow_null=True)
    service_master_meta_data_id = serializers.UUIDField(required=True)


class OrderItemSerializer(serializers.Serializer):
    service_id = serializers.UUIDField(required=True)
    meta_data = serializers.ListField(child=MetaDataSerializer())


class CreateOrderSerializer(serializers.Serializer):
    order_items = serializers.ListField(child=OrderItemSerializer())

    # @transaction.atomic
    def create(self, validated_data):
        order_items = validated_data['order_items']
        order = Order.objects.create(
            buyer=self.context['request'].user_account)

        for order_item_data in order_items:
            try:
                service = Service.objects.get(id=order_item_data['service_id'])
            except ObjectDoesNotExist:
                raise serializers.ValidationError(
                    {"service_id": "Service with id {} does not exist.".format(order_item_data['service_id'])})

            order_item = OrderItem.objects.create(
                order_id=order, service_master=service.service_master, package=service.package, price=service.price, currency=service.currency, platform_fee=service.platform_fees)

            service_master_meta_data = service.service_master.service_master_meta_data_id.all()
            for meta_data in order_item_data['meta_data']:
                for service_master_meta_data_item in service_master_meta_data:
                    if service_master_meta_data_item.id == meta_data['service_master_meta_data_id']:
                        OrderItemMetaData.objects.create(
                            order_item=order_item, label=service_master_meta_data_item.label, value=meta_data['value'], field_type=service_master_meta_data_item.field_type, span=service_master_meta_data_item.span)
        return order

class OrderAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderAttachment
        fields = '__all__'


class OrderItemTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemTracking
        fields = '__all__'
        

class OrderMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderMessage
        fields = '__all__'
        

class OrderMessageAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderMessageAttachment
        fields = '__all__'
        

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


