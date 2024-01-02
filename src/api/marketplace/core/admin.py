from django.contrib import admin

# Register your models here.
from .models import Currency, Country, LanguageMaster

admin.site.register(Currency)
admin.site.register(Country)
admin.site.register(LanguageMaster)
