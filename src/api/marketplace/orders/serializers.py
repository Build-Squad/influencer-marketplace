from rest_framework import serializers
from .models import Order, OrderItem, OrderAttachment, OrderItemTracking, OrderMessage, OrderMessageAttachment, Transaction, Review

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


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


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'