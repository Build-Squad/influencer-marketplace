# create CRUD urls for packages
#
# Path: src/api/marketplace/packages/urls.py
#
from django.urls import path
from .views import ServiceMasterList, ServiceMasterDetail, ServiceList, ServiceDetail, PackageList, PackageDetail

urlpatterns = [
    path('servicemaster/', ServiceMasterList.as_view()),
    path('servicemaster/<str:pk>/', ServiceMasterDetail.as_view()),

    path('service/', ServiceList.as_view()),
    path('service/<str:pk>/', ServiceDetail.as_view()),

    path('', PackageList.as_view()),
    path('<str:pk>/', PackageDetail.as_view()),
]