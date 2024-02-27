from django.contrib import admin

# Register your models here.
from .models import Notification


class NotificationAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Notification._meta.fields]


admin.site.register(Notification, NotificationAdmin)
