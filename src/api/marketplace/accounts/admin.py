from django.contrib import admin

from .models import User, TwitterAccount, CategoryMaster, AccountCategory, Role, Wallet, WalletNetwork, WalletProvider
# Register your models here.

admin.site.register(User)
admin.site.register(TwitterAccount)
admin.site.register(CategoryMaster)
admin.site.register(AccountCategory)
admin.site.register(Role)
admin.site.register(WalletProvider)
admin.site.register(WalletNetwork)
admin.site.register(Wallet)
