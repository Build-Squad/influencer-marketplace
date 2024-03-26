from django.urls import path
from .views import (
    ApproveOrderItemView,
    CancelOrderView,
    CancelTweetView,
    OrderItemMetricDetailView,
    OrderList,
    OrderDetail,
    OrderItemList,
    OrderItemDetail,
    OrderAttachmentList,
    OrderAttachmentDetail,
    OrderListView,
    OrderMessageList,
    SendTweetView,
    ReviewList,
    ReviewDetail,
    TransactionCreateView,
    UpdateOrderStatus,
    OrderMessageCreateView,
    UserOrderMessagesView,
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

    path("user-order-messages/", UserOrderMessagesView.as_view(),
         name="user-order-messages"),

    path("order-message/<uuid:pk>/",
         OrderMessageList.as_view(), name="order-message-list"),
    path("order-message/", OrderMessageCreateView.as_view(),
         name="order-message-create"),

    path("review/", ReviewList.as_view(), name="review-list"),
    path('review/<uuid:pk>/', ReviewDetail.as_view(), name="reviewt-details"),

    path('send-tweet', SendTweetView.as_view(), name="send-tweet"),
    path('cancel-tweet', CancelTweetView.as_view(), name="cancel-tweet"),

    path('create-transaction/',
         TransactionCreateView.as_view(), name="create-transaction"),

    path("cancel-order/<uuid:pk>/", CancelOrderView.as_view(), name="cancel-order"),

    path("order-item-metrics/", OrderItemMetricDetailView.as_view(),
         name="order-item-metrics"),
    path("approve-ordder-item/<uuid:pk>/",
         ApproveOrderItemView.as_view(),      name="approve-order-item"),
]