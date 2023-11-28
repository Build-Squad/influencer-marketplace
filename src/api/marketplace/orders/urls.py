from django.urls import path
from .views import OrderList, OrderDetail

urlpatterns = [
    path("order/", OrderList.as_view(), name="order-list"),
    path('order/<uuid:pk>/', OrderDetail.as_view(), name="order-details"),
]