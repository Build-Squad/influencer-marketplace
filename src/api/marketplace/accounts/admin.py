from django.contrib import admin

from .models import AccountRegion, User, TwitterAccount, CategoryMaster, AccountCategory, Role, Wallet, WalletNetwork, WalletNonce, WalletProvider, BusinessAccountMetaData, Bookmark
# Register your models here.

admin.site.register(User)
admin.site.register(TwitterAccount)
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
