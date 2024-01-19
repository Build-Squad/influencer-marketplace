from django.urls import path
from .views import (
    OrderList,
    OrderDetail,
    OrderItemList,
    OrderItemDetail,
    OrderAttachmentList,
    OrderAttachmentDetail,
    OrderItemTrackingList,
    OrderItemTrackingDetail,
    OrderListView,
    OrderMessageList,
    TransactionList,
    TransactionDetail,
    ReviewList,
    ReviewDetail,
    UpdateOrderStatus,
    OrderMessageCreateView
)

urlpatterns = [
    path("order-list/", OrderListView.as_view(), name="order-list"),

    path("order/", OrderList.as_view(), name="create-order"),
    path('order/<uuid:pk>/', OrderDetail.as_view(), name="order-details"),
    path("update-status/<uuid:pk>/", UpdateOrderStatus.as_view(), name="update-order-status"),

    path("order-item/", OrderItemList.as_view(), name="order-item-list"),
    path('order-item/<uuid:pk>/', OrderItemDetail.as_view(), name="order-item-details"),

    path("order-attachment/", OrderAttachmentList.as_view(), name="order-attachment-list"),
    path('order-attachment/<uuid:pk>/', OrderAttachmentDetail.as_view(), name="order-attachment-details"),

    path("order-item-tracking/", OrderItemTrackingList.as_view(), name="order-item-tracking-list"),
    path('order-item-tracking/<uuid:pk>/', OrderItemTrackingDetail.as_view(), name="order-item-tracking-details"),

    path("order-message/<uuid:pk>/",
         OrderMessageList.as_view(), name="order-message-list"),
    path("order-message/", OrderMessageCreateView.as_view(),
         name="order-message-create"),

    path("transaction/", TransactionList.as_view(), name="transaction-list"),
    path('transaction/<uuid:pk>/', TransactionDetail.as_view(), name="transactiont-details"),

    path("review/", ReviewList.as_view(), name="review-list"),
    path('review/<uuid:pk>/', ReviewDetail.as_view(), name="reviewt-details"),
]