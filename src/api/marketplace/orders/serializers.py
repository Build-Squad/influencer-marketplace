from email import message
from accounts.serializers import UserSerializer, WalletCompleteSerializer
from accounts.models import User, Wallet
from orders.services import create_order_item_meta_data_field_update_message, create_order_item_publish_date_update_message, create_order_item_status_update_message, create_order_item_tracking
from core.serializers import CurrencySerializer
from packages.serializers import PackageSerializer, ServiceMasterReadSerializer
from packages.models import Service, ServiceMasterMetaData
from rest_framework import serializers
from .models import (
    Order,
    OrderItem,
    OrderAttachment,
    OrderItemMetaData,
    OrderMessage,
    OrderMessageAttachment,
    Review,
    Transaction,
)
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone

class OrderItemMetaDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemMetaData
        fields = '__all__'


class OrderReadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = '__all__'

# Serializer for the GET details of an order
class OrderItemReadSerializer(serializers.ModelSerializer):
    package = PackageSerializer(read_only=True)
    service_master = ServiceMasterReadSerializer(read_only=True)
    currency = CurrencySerializer(read_only=True)
    order_item_meta_data = serializers.SerializerMethodField()
    order_id = OrderReadSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = "__all__"

    def get_order_item_meta_data(self, orderItem):
        order_item_meta_data = OrderItemMetaData.objects.filter(order_item=orderItem)
        return OrderItemMetaDataSerializer(order_item_meta_data, many=True).data

    def get_order_item_meta_data(self, obj):
        order_item_meta_data = OrderItemMetaData.objects.filter(order_item=obj)
        return OrderItemMetaDataSerializer(order_item_meta_data, many=True).data


# Not being used
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


# Serializer to define the schema for the POST search request for the list of orders
class OrderListFilterSerializer(serializers.Serializer):
    influencers = serializers.ListField(child=serializers.UUIDField(), required=False)
    buyers = serializers.ListField(child=serializers.UUIDField(), required=False)
    status = serializers.ListField(child=serializers.CharField(), required=False)
    service_masters = serializers.ListField(
        child=serializers.UUIDField(), required=False
    )
    lt_created_at = serializers.DateTimeField(required=False)
    gt_created_at = serializers.DateTimeField(required=False)
    lt_rating = serializers.FloatField(required=False)
    gt_rating = serializers.FloatField(required=False)
    lt_amount = serializers.FloatField(required=False)
    gt_amount = serializers.FloatField(required=False)
    order_by = serializers.CharField(required=False)
    search = serializers.CharField(required=False, allow_blank=True)


class OrderItemListFilterSerializer(serializers.Serializer):
    influencers = serializers.ListField(
        child=serializers.UUIDField(), required=False)
    buyers = serializers.ListField(
        child=serializers.UUIDField(), required=False)
    status = serializers.ListField(
        child=serializers.CharField(), required=False)
    service_masters = serializers.ListField(
        child=serializers.UUIDField(), required=False
    )
    order_ids = serializers.ListField(
        child=serializers.UUIDField(), required=False)
    lt_created_at = serializers.DateTimeField(required=False)
    gt_created_at = serializers.DateTimeField(required=False)
    lt_rating = serializers.FloatField(required=False)
    gt_rating = serializers.FloatField(required=False)
    lt_amount = serializers.FloatField(required=False)
    gt_amount = serializers.FloatField(required=False)
    order_by = serializers.CharField(required=False)
    search = serializers.CharField(required=False, allow_blank=True)
    lt_publish_date = serializers.DateTimeField(required=False)
    gt_publish_date = serializers.DateTimeField(required=False)


# The response schema for the list of orders from the POST search request
class OrderSerializer(serializers.ModelSerializer):
    buyer = UserSerializer(read_only=True)
    order_item_order_id = serializers.SerializerMethodField()
    review = serializers.SerializerMethodField()
    amount = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()
    influencer_wallet = serializers.SerializerMethodField()
    buyer_wallet = serializers.SerializerMethodField()
    address = serializers.CharField(required=False)
    transactions = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = "__all__"

    def get_amount(self, obj):
        # Should return the sum of the price of each order item and also add the platform fee
        order_items = obj.order_item_order_id.all()
        amount = 0
        for order_item in order_items:
            amount += order_item.price
            amount += order_item.price * order_item.platform_fee / 100
        return amount

    def get_currency(self, obj):
        # Should return the currency of the first order item
        first_order_item = obj.order_item_order_id.first()
        if first_order_item:
            return CurrencySerializer(first_order_item.currency).data
        return None

    def get_influencer_wallet(self, obj):
        # Should return the wallet of the influencer
        influencer_id = obj.order_item_order_id.first().package.influencer.id
        influencer = User.objects.get(id=influencer_id)
        wallet = Wallet.objects.filter(
            user_id=influencer, is_primary=True).first()
        if wallet:
            return WalletCompleteSerializer(wallet).data

    def get_buyer_wallet(self, obj):
        # Should return the wallet of the buyer
        buyer = User.objects.get(id=obj.buyer.id)
        wallet = Wallet.objects.filter(
            user_id=buyer, is_primary=True).first()
        if wallet:
            return WalletCompleteSerializer(wallet).data

    def get_transactions(self, obj):
        if "request" in self.context:
            transactions = Transaction.objects.filter(
                order=obj, transaction_initiated_by=self.context["request"].user_account)
            return OrderTransactionSerializer(transactions, many=True).data
        else:
            return []

    def get_order_item_order_id(self, obj):
        order_items = OrderItem.objects.filter(
            order_id=obj, deleted_at=None).order_by('-created_at')
        return OrderItemReadSerializer(order_items, many=True).data

    def get_review(self, obj):
        try:
            review = Review.objects.get(order=obj)
            return ReviewSerializer(review).data
        except ObjectDoesNotExist:
            return None

# The request schema for the creation and update of an order item meta data value
class MetaDataSerializer(serializers.Serializer):
    value = serializers.CharField(
        allow_null=True, required=False, allow_blank=True)
    service_master_meta_data_id = serializers.UUIDField(required=False)
    order_item_meta_data_id = serializers.UUIDField(required=False)


class OrderItemSerializer(serializers.Serializer):
    service_id = serializers.UUIDField(required=False)
    meta_data = serializers.ListField(child=MetaDataSerializer())
    order_item_id = serializers.UUIDField(required=False)
    publish_date = serializers.DateTimeField(required=False)


class CreateOrderSerializer(serializers.Serializer):
    order_items = serializers.ListField(child=OrderItemSerializer())

    def _create_or_update_meta_data(
        self, order_item, meta_data, service_master_meta_data_item, updated_by
    ):
        if "order_item_meta_data_id" in meta_data:
            try:
                order_item_meta_data = OrderItemMetaData.objects.get(
                    id=meta_data["order_item_meta_data_id"]
                )
            except ObjectDoesNotExist:
                raise serializers.ValidationError(
                    {
                        "order_item_meta_data_id": "Order item meta data with id {} does not exist.".format(
                            meta_data["order_item_meta_data_id"]
                        )
                    }
                )
        else:
            if service_master_meta_data_item is None:
                raise serializers.ValidationError(
                    {"service_master_meta_data_id": "Service master meta data id not provided.".format(meta_data['service_master_meta_data_id'])})
                # Create the meta data
            order_item_meta_data = OrderItemMetaData.objects.create(
                order_item=order_item,
                label=service_master_meta_data_item.label,
                value=meta_data['value'],
                field_type=service_master_meta_data_item.field_type,
                span=service_master_meta_data_item.span,
                placeholder=service_master_meta_data_item.placeholder,
                min=service_master_meta_data_item.min,
                max=service_master_meta_data_item.max,
                order=service_master_meta_data_item.order,
                field_name=service_master_meta_data_item.field_name,
                regex=service_master_meta_data_item.regex,
            )
        old_value = order_item_meta_data.value
        # Update the meta data
        order_item_meta_data.value = meta_data['value']
        order_item_meta_data.save()

        order_item = order_item_meta_data.order_item
        if (order_item.status != "draft" or order_item.status != "pending") and order_item_meta_data.value != old_value:
            create_order_item_meta_data_field_update_message(
                order_item_meta_data, updated_by, old_value)

    def create(self, validated_data):
        order_items = validated_data["order_items"]
        order = Order.objects.create(buyer=self.context["request"].user_account)

        for order_item_data in order_items:
            try:
                service = Service.objects.get(id=order_item_data["service_id"])
            except ObjectDoesNotExist:
                raise serializers.ValidationError(
                    {
                        "service_id": "Service with id {} does not exist.".format(
                            order_item_data["service_id"]
                        )
                    }
                )

            order_item = OrderItem.objects.create(
                order_id=order,
                service_master=service.service_master,
                package=service.package,
                price=service.price,
                currency=service.currency,
                platform_fee=service.platform_fees,
                publish_date=order_item_data["publish_date"],
            )

            # Create an order item tracking object
            create_order_item_tracking(order_item, order_item.status)

            service_master_meta_data = (
                service.service_master.service_master_meta_data_id.all()
            )
            for meta_data in order_item_data["meta_data"]:
                for service_master_meta_data_item in service_master_meta_data:
                    if (
                        service_master_meta_data_item.id
                        == meta_data["service_master_meta_data_id"]
                    ):
                        OrderItemMetaData.objects.create(
                            order_item=order_item, label=service_master_meta_data_item.label,
                            value=meta_data['value'], field_type=service_master_meta_data_item.field_type,
                            span=service_master_meta_data_item.span, placeholder=service_master_meta_data_item.placeholder,
                            min=service_master_meta_data_item.min, max=service_master_meta_data_item.max,
                            order=service_master_meta_data_item.order, field_name=service_master_meta_data_item.field_name,
                            regex=service_master_meta_data_item.regex)
        return order

    def update(self, instance, validated_data):
        order_items = validated_data["order_items"]
        order = instance
        # The serializer will be similar to the CreateOrderSerializer
        # Except that it will not create a new order but update an existing one and its order items
        # Also additional order items can be added to the order if no order_item_id is provided for the order item
        # If an order_item_id is provided, the order item will be updated
        # If an order item is not provided, the order item will be created

        for order_item_data in order_items:

            if 'order_item_id' in order_item_data:
                try:
                    order_item = OrderItem.objects.get(
                        id=order_item_data["order_item_id"]
                    )
                    # Update the publish date
                    if "publish_date" in order_item_data:
                        old_publish_date = order_item.publish_date
                        order_item.publish_date = order_item_data["publish_date"]
                        order_item.save()
                        # Call the create_order_item_status_update_message
                        if (order_item.status != "draft" or order_item.status != "pending") and order_item.publish_date != old_publish_date:
                            create_order_item_publish_date_update_message(
                                order_item, self.context["request"].user_account.id
                            )
                except ObjectDoesNotExist:
                    raise serializers.ValidationError(
                        {
                            "order_item_id": "Order item with id {} does not exist.".format(
                                order_item_data["order_item_id"]
                            )
                        }
                    )
            else:
                if order.status != "draft":
                    raise serializers.ValidationError(
                        {"order": "Order Items cannot be added to an order that has been paid for"})
                try:
                    service = Service.objects.get(
                        id=order_item_data['service_id'])

                except ObjectDoesNotExist:
                    raise serializers.ValidationError(
                        {"service_id": "Service with id {} does not exist.".format(order_item_data['service_id'])})
                order_item = OrderItem.objects.create(
                    order_id=order,
                    service_master=service.service_master,
                    package=service.package,
                    price=service.price,
                    currency=service.currency,
                    platform_fee=service.platform_fees,
                    publish_date=order_item_data["publish_date"],
                )
                
                # Create an order item tracking object
                create_order_item_tracking(order_item, order_item.status)

            # Similar to the create method, the meta data will be updated if the order item meta data already exists
            # If it does not exist, it will be created
            for meta_data in order_item_data['meta_data']:
                try:
                    if 'service_master_meta_data_id' in meta_data:
                        service_master_meta_data_item = ServiceMasterMetaData.objects.get(
                            id=meta_data['service_master_meta_data_id'])
                    else:
                        service_master_meta_data_item = None
                except ObjectDoesNotExist:
                    service_master_meta_data_item = None

                self._create_or_update_meta_data(
                    order_item, meta_data, service_master_meta_data_item, self.context["request"].user_account.id)

        return order

    def validate(self, data):
        order_items = data["order_items"]
        if len(order_items) == 0:
            raise serializers.ValidationError(
                {"order_items": "Order items cannot be empty."})
        for order_item in order_items:
            if "publish_date" not in order_item:
                raise serializers.ValidationError(
                    {"publish_date": "Publish date is required."})
            if "publish_date" in order_item:
                if order_item["publish_date"] < timezone.now():
                    raise serializers.ValidationError(
                        {"publish_date": "Publish date should be in the future."})
        return data


class OrderAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderAttachment
        fields = "__all__"

class OrderMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderMessage
        fields = "__all__"


class CreateOrderMessageSerializer(serializers.Serializer):
    message = serializers.CharField(required=True)
    order_id = serializers.UUIDField(required=True)

    def create(self, validated_data):
        message = validated_data['message']
        order_id = validated_data['order_id']
        order = Order.objects.get(id=order_id)

        # Check that the order is either accepted or pending
        if order.status not in ['accepted', 'pending']:
            raise serializers.ValidationError(
                {"order": "Only accepted or pending orders can have messages"})

        # Check that the sender is either the buyer or the influencer from package
        sender = self.context['request'].user_account
        if sender.id != order.buyer.id and sender.id != order.order_item_order_id.first().package.influencer.id:
            raise serializers.ValidationError(
                {"sender": "Only the buyer or the influencer can send a message"})

        # Find the receiver
        if sender.id == order.buyer.id:
            receiver_id = order.order_item_order_id.first().package.influencer.id
        else:
            receiver_id = order.buyer.id
        sender_user = User.objects.get(id=sender.id)
        receiver_user = User.objects.get(id=receiver_id)

        order_message = OrderMessage.objects.create(
            message=message, sender_id=sender_user, receiver_id=receiver_user, order_id=order)
        return order_message


class OrderMessageAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderMessageAttachment
        fields = "__all__"


class OrderMessageListFilterSerializer(serializers.Serializer):
    status = serializers.ListField(
        child=serializers.CharField(), required=False)
    service_masters = serializers.ListField(
        child=serializers.UUIDField(), required=False
    )
    search = serializers.CharField(required=False, allow_blank=True)


class LastMessageSerializer(serializers.Serializer):
    message = OrderMessageSerializer(read_only=True)
    order_unread_messages_count = serializers.IntegerField(read_only=True)


class OrderDetailSerializer(serializers.Serializer):
    order = OrderSerializer(read_only=True)
    order_message = LastMessageSerializer(read_only=True)


class UserOrderMessagesSerializer(serializers.Serializer):
    orders = OrderDetailSerializer(many=True, read_only=True)
    total_unread_messages_count = serializers.IntegerField(read_only=True)

class SendTweetSerializer(serializers.Serializer):
    order_item_id = serializers.UUIDField(required=True)

class OrderTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class OrderTransactionCreateSerializer(serializers.Serializer):
    order_id = serializers.UUIDField(required=True)
    transaction_type = serializers.CharField(required=True)
    transaction_address = serializers.CharField(required=True)
    status = serializers.CharField(required=False)

    def create(self, validated_data):
        order = Order.objects.get(id=validated_data['order_id'])
        user = self.context['request'].user_account
        wallet = Wallet.objects.filter(user_id=user, is_primary=True).first()
        if wallet is None:
            raise serializers.ValidationError(
                {"wallet": "User does not have a primary wallet"})
            
        transaction = Transaction.objects.create(
            order=order, 
            transaction_initiated_by=user, 
            transaction_type=validated_data['transaction_type'], 
            transaction_address=validated_data['transaction_address'],
            wallet = wallet,
            status = validated_data.get('status', 'pending')
        )
        
        return transaction