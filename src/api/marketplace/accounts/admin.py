from django.contrib import admin

from .models import AccountRegion, User, TwitterAccount, CategoryMaster, AccountCategory, Role, Wallet, WalletNetwork, WalletNonce, WalletProvider, BusinessAccountMetaData, Bookmark
# Register your models here.


class UserAdmin(admin.ModelAdmin):
    list_display = [field.name for field in User._meta.fields if field.name not in [
        'password', 'jwt', 'status', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions', 'last_login', 'date_joined']]


class TweetAccountAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TwitterAccount._meta.fields if field.name not in [
        'access_token', 'refresh_token']]


admin.site.register(User, UserAdmin)
admin.site.register(TwitterAccount, TweetAccountAdmin)
admin.site.register(BusinessAccountMetaData)
admin.site.register(CategoryMaster)
admin.site.register(AccountCategory)
admin.site.register(Role)
admin.site.register(WalletProvider)
admin.site.register(WalletNetwork)
admin.site.register(Wallet)
admin.site.register(AccountRegion)
admin.site.register(WalletNonce)
admin.site.register(Bookmark)
