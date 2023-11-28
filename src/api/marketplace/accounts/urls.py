from django.urls import path
from .views import TwitterAccountList, TwitterAccountDetail, CategoryMasterList, CategoryMasterDetail, AccountCategoryList, AccountCategoryDetail

urlpatterns = [
    path("twitter-account/", TwitterAccountList.as_view(), name="twitter-account-list"),
    path("twitter-account/<uuid:pk>/", TwitterAccountDetail.as_view(), name="twitter-account-detail"),


    path("category-master/", CategoryMasterList.as_view(), name="category-master-list"),
    path("category-master/<uuid:pk>/", CategoryMasterDetail.as_view(), name="category-master-detail"),


    path("account-category/", AccountCategoryList.as_view(), name="account-category-list"),
    path("account-category/<uuid:pk>/", AccountCategoryDetail.as_view(), name="account-category-detail"),


]
