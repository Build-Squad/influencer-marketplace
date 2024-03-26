from django.contrib import admin

from .models import UserReferrals, RewardConfig, RewardTypes
# Register your models here.

admin.site.register(UserReferrals)
admin.site.register(RewardTypes)
admin.site.register(RewardConfig)