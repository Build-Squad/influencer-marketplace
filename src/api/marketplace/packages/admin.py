from django.contrib import admin

from .models import Package, ServiceMaster, Service, ServiceMasterMetaData

# Register your models here.
admin.site.register(Package)
admin.site.register(ServiceMaster)
admin.site.register(Service)
admin.site.register(ServiceMasterMetaData)
