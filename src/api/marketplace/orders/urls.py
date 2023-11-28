from django.urls import path
from .views import OrderList, OrderDetail, OrderItemList, OrderItemDetail, OrderAttachmentList, OrderAttachmentDetail

urlpatterns = [
    path("order/", OrderList.as_view(), name="order-list"),
    path('order/<uuid:pk>/', OrderDetail.as_view(), name="order-details"),

    path("order-item/", OrderItemList.as_view(), name="order-item-list"),
    path('order-item/<uuid:pk>/', OrderItemDetail.as_view(), name="order-item-details"),

    path("order-attachment/", OrderAttachmentList.as_view(), name="order-attachment-list"),
    path('order-attachment/<uuid:pk>/', OrderAttachmentDetail.as_view(), name="order-attachment-details"),
]