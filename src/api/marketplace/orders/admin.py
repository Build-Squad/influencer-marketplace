from django.contrib import admin
from .models import Order, OrderItem, OrderAttachment, OrderItemTracking, OrderMessage, OrderMessageAttachment, Transaction, Review, OrderItemMetaData, OrderTracking, Escrow, OnChainTransaction, OrderItemMetric


class OrderAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Order._meta.fields]


class OrderItemAdmin(admin.ModelAdmin):
    list_display = [field.name for field in OrderItem._meta.fields]
    list_filter = ('package__influencer__username', 'order_id')


class OrderItemMetaDataAdmin(admin.ModelAdmin):
    list_display = [field.name for field in OrderItemMetaData._meta.fields]


class TransactionAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Transaction._meta.fields]


class OrderTrackingAdmin(admin.ModelAdmin):
    list_display = [field.name for field in OrderTracking._meta.fields]


class OrderItemTrackingAdmin(admin.ModelAdmin):
    list_display = [field.name for field in OrderItemTracking._meta.fields]


class OrderMessageAdmin(admin.ModelAdmin):
    list_display = [field.name for field in OrderMessage._meta.fields]


class ReviewAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Review._meta.fields]


class EscrowAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Escrow._meta.fields]


class OnChainTransactionAdmin(admin.ModelAdmin):
    list_display = [field.name for field in OnChainTransaction._meta.fields]


class OrderItemMetricAdmin(admin.ModelAdmin):
    list_display = [field.name for field in OrderItemMetric._meta.fields]

admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(OrderAttachment)
admin.site.register(OrderItemTracking, OrderItemTrackingAdmin)
admin.site.register(OrderMessage, OrderMessageAdmin)
admin.site.register(OrderMessageAttachment)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(OrderItemMetaData, OrderItemMetaDataAdmin)
admin.site.register(OrderTracking, OrderTrackingAdmin)
admin.site.register(Escrow, EscrowAdmin)
admin.site.register(OnChainTransaction, OnChainTransactionAdmin)
admin.site.register(OrderItemMetric, OrderItemMetricAdmin)
