from django.urls import path
from .views import (
    NotificationDetailView, NotificationListView, NotificationAllReadView
)

urlpatterns = [
    path("", NotificationListView.as_view(), name="notifications"),
    path("<uuid:pk>/", NotificationDetailView.as_view(),
         name="notification-mark-as-read"),
    path("all-read/", NotificationAllReadView.as_view(),
         name="notifications-mark-all-read"),
]
