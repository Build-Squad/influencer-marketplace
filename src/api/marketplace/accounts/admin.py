from django.contrib import admin

from .models import User, TwitterAccount, CategoryMaster, AccountCategory, Role
# Register your models here.

admin.site.register(User)
admin.site.register(TwitterAccount)
admin.site.register(CategoryMaster)
admin.site.register(AccountCategory)
admin.site.register(Role)
