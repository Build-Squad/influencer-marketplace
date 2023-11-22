from django.db import models
import uuid


class Country(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Country', default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, blank=True, null=True)
    country_code = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        db_table = "country"

 
class Currency(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Currency', default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, blank=True, null=True)
    symbol = models.CharField(max_length=100, blank=True, null=True)
    country = models.ForeignKey(Country, related_name='currency_country_id', on_delete=models.DO_NOTHING,
                                         null=True)

    class Meta:
        db_table = "currency"