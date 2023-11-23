# create CRUD urls for packages
#
# Path: src/api/marketplace/packages/urls.py
#
from django.urls import path
from .views import getAllServiceMaster, createServiceMaster, updateServiceMaster, deleteServiceMaster, getAllService, createService, updateService, deleteService, getAllPackage, createPackage, updatePackage, deletePackage

urlpatterns = [
    path('', getAllPackage),
    path('create/', createPackage),
    path('update/<str:pk>/', updatePackage),
    path('delete/<str:pk>/', deletePackage),
    path('servicemaster/', getAllServiceMaster),
    path('servicemaster/create/', createServiceMaster),
    path('servicemaster/update/<str:pk>/', updateServiceMaster),
    path('servicemaster/delete/<str:pk>/', deleteServiceMaster),
    path('service/', getAllService),
    path('service/create/', createService),
    path('service/update/<str:pk>/', updateService),
    path('service/delete/<str:pk>/', deleteService),
]

