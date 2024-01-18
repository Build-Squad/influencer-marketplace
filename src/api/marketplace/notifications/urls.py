from django.urls import path
from .views import (
    NotificationView, NotificationAllReadView
)

urlpatterns = [
    path("notifications/", NotificationView.as_view(), name="notifications"),
    path("notifications/all-read/", NotificationAllReadView.as_view(),
         name="notifications-all-read"),
]
