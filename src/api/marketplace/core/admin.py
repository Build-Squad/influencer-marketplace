from django.contrib import admin

# Register your models here.
from .models import Currency, Country, LanguageMaster, RegionMaster,HowItWorksRoute, HowItWorksStep

admin.site.register(Currency)
admin.site.register(HowItWorksRoute)
admin.site.register(HowItWorksStep)
admin.site.register(Country)
admin.site.register(LanguageMaster)
admin.site.register(RegionMaster)
