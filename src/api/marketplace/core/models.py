from django.db import models
import uuid

class Currency(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Currency', default=uuid.uuid4, editable=False)
    # country = 
    # country_code

class Country(models.Model):
    id = models.UUIDField(primary_key=True, verbose_name='Country', default=uuid.uuid4, editable=False)
    # country = 
    # country_code