from django.db import models
import uuid
from django.db.models import SET_NULL
from django.apps import apps

class Country(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Country', default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, blank=True, null=True)
    country_code = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        db_table = "country"

    def __str__(self):
        return self.name

 
class Currency(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Currency', default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, blank=True, null=True)
    symbol = models.CharField(max_length=100, blank=True, null=True)
    country = models.ForeignKey(Country, related_name='currency_country_id', on_delete=SET_NULL,
                                null=True, blank=True)

    class Meta:
        db_table = "currency"

    def __str__(self):
        return self.name


class LanguageMaster(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Language Master', default=uuid.uuid4, editable=False)
    langCode = models.CharField(max_length=100, blank=True, null=True)
    langEnglishName = models.CharField(max_length=100, blank=True, null=True)
    langNativeName = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = "language_master"

    def __str__(self):
        return self.langEnglishName
