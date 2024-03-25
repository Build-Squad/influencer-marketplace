from django.contrib import admin

from .models import UserReferrals, ReferralRewardsMaster
# Register your models here.

admin.site.register(UserReferrals)
admin.site.register(ReferralRewardsMaster)