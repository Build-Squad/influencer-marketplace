from django.contrib import admin
from .models import Order, OrderItem, OrderAttachment, OrderItemTracking, OrderMessage, OrderMessageAttachment, Transaction, Review

admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(OrderAttachment)
admin.site.register(OrderItemTracking)
admin.site.register(OrderMessage)
admin.site.register(OrderMessageAttachment)
admin.site.register(Transaction)
admin.site.register(Review)
