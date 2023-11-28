from django.urls import path
from .views import OrderList, OrderDetail, OrderItemList, OrderItemDetail, OrderAttachmentList, OrderAttachmentDetail, OrderItemTrackingList, OrderItemTrackingDetail

urlpatterns = [
    path("order/", OrderList.as_view(), name="order-list"),
    path('order/<uuid:pk>/', OrderDetail.as_view(), name="order-details"),

    path("order-item/", OrderItemList.as_view(), name="order-item-list"),
    path('order-item/<uuid:pk>/', OrderItemDetail.as_view(), name="order-item-details"),

    path("order-attachment/", OrderAttachmentList.as_view(), name="order-attachment-list"),
    path('order-attachment/<uuid:pk>/', OrderAttachmentDetail.as_view(), name="order-attachment-details"),

    path("order-item-tracking/", OrderItemTrackingList.as_view(), name="order-item-tracking-list"),
    path('order-item-tracking/<uuid:pk>/', OrderItemTrackingDetail.as_view(), name="order-item-tracking-details"),
]