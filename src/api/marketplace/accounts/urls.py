from django.urls import path
from .views import TwitterAccountList, TwitterAccountDetail

urlpatterns = [
    path("twitter-account/", TwitterAccountList.as_view(), name="twitter-account-list"),
    path("twitter-account/<uuid:pk>/", TwitterAccountDetail.as_view(), name="twitter-account-detail"),

    
]
