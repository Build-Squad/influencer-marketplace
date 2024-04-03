from django.contrib import admin

# Register your models here.
from .models import Configuration, Currency, Country, LanguageMaster, RegionMaster, HowItWorksRoute, HowItWorksStep


class CurrencyAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Currency._meta.fields]


admin.site.register(Currency, CurrencyAdmin)
admin.site.register(HowItWorksRoute)
admin.site.register(HowItWorksStep)
admin.site.register(Country)
admin.site.register(LanguageMaster)
admin.site.register(RegionMaster)
admin.site.register(Configuration)
