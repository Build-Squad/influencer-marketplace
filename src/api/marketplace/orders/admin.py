from django.contrib import admin
from .models import Order, OrderItem, OrderAttachment, OrderItemTracking, OrderMessage, OrderMessageAttachment, Transaction, Review, OrderItemMetaData, OrderTracking


class OrderAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Order._meta.fields]


class OrderItemAdmin(admin.ModelAdmin):
    list_display = [field.name for field in OrderItem._meta.fields]


class OrderItemMetaDataAdmin(admin.ModelAdmin):
    list_display = [field.name for field in OrderItemMetaData._meta.fields]


class TransactionAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Transaction._meta.fields]


class OrderTrackingAdmin(admin.ModelAdmin):
    list_display = [field.name for field in OrderTracking._meta.fields]

admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(OrderAttachment)
admin.site.register(OrderItemTracking)
admin.site.register(OrderMessage)
admin.site.register(OrderMessageAttachment)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(Review)
admin.site.register(OrderItemMetaData, OrderItemMetaDataAdmin)
admin.site.register(OrderTracking, OrderTrackingAdmin)
