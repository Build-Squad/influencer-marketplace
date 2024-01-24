from django.contrib import admin

# Register your models here.
from .models import Currency, Country, LanguageMaster, RegionMaster

admin.site.register(Currency)
admin.site.register(Country)
admin.site.register(LanguageMaster)
admin.site.register(RegionMaster)
