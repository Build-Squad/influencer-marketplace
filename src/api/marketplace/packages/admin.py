from django.contrib import admin

from .models import Package, ServiceMaster, Service, ServiceMasterMetaData


class PackageAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Package._meta.fields]


class ServiceMasterAdmin(admin.ModelAdmin):
    list_display = [field.name for field in ServiceMaster._meta.fields]


class ServiceAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Service._meta.fields]


class ServiceMasterMetaDataAdmin(admin.ModelAdmin):
    list_display = [field.name for field in ServiceMasterMetaData._meta.fields]


admin.site.register(Package, PackageAdmin)
admin.site.register(ServiceMaster, ServiceMasterAdmin)
admin.site.register(Service, ServiceAdmin)
admin.site.register(ServiceMasterMetaData, ServiceMasterMetaDataAdmin)
