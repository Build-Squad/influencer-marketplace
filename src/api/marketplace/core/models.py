from django.db import models
import uuid
from django.db.models import SET_NULL
from django.apps import apps


class Country(models.Model):
    id = models.UUIDField(
        primary_key=True, verbose_name="Country", default=uuid.uuid4, editable=False
    )
    name = models.CharField(max_length=100, blank=True, null=True)
    country_code = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = "country"

    def __str__(self):
        return self.name


class Currency(models.Model):
    id = models.UUIDField(
        primary_key=True, verbose_name="Currency", default=uuid.uuid4, editable=False
    )
    name = models.CharField(max_length=100, blank=True, null=True)
    symbol = models.CharField(max_length=100, blank=True, null=True)
    country = models.ForeignKey(
        Country,
        related_name="currency_country_id",
        on_delete=SET_NULL,
        null=True,
        blank=True,
    )
    is_default = models.BooleanField(default=False)

    class Meta:
        db_table = "currency"

    def __str__(self):
        return self.name


class LanguageMaster(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="Language Master",
        default=uuid.uuid4,
        editable=False,
    )
    langCode = models.CharField(max_length=100, blank=True, null=True)
    langEnglishName = models.CharField(max_length=100, blank=True, null=True)
    langNativeName = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = "language_master"

    def __str__(self):
        return self.langEnglishName


class RegionMaster(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="Region Master",
        default=uuid.uuid4,
        editable=False,
    )
    regionName = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = "region_master"

    def __str__(self):
        return self.regionName

class HowItWorksRoute(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="How it works route",
        default=uuid.uuid4,
        editable=False,
    )
    route = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=255, null=True, blank=True, default="")
    
    class Meta:
        db_table = "how_it_works_section"

    def __str__(self):
        return self.route

class HowItWorksStep(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="How it works Step",
        default=uuid.uuid4,
        editable=False,
    )
    step_route = models.ForeignKey(HowItWorksRoute, related_name='step_route', on_delete=models.CASCADE)
    step = models.CharField(max_length=100)
    step_label = models.CharField(max_length=255)
    html_content = models.TextField()

    class Meta:
        db_table = "how_it_works_step"

    def __str__(self):
        return self.step


class Configuration(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="Configuration",
        default=uuid.uuid4,
        editable=False,
    )
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "configuration"

    def __str__(self):
        return self.key
