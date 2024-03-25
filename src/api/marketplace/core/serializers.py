from rest_framework import serializers

from .models import Configuration, Currency, Country, HowItWorksRoute, HowItWorksStep, LanguageMaster, RegionMaster


class CountrySerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)
    name = serializers.CharField(required=False)
    country_code = serializers.CharField(required=False)

    class Meta:
        model = Country
        fields = "__all__"
        # fields = ('id', 'name', 'country_code')

class CurrencySerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)
    name = serializers.CharField(required=False)
    symbol = serializers.CharField(required=False)
    country = CountrySerializer(required=False)

    class Meta:
        model = Currency
        fields = "__all__"
        # fields = ('id', 'name', 'symbol', 'country')


class LanguageMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = LanguageMaster
        fields = "__all__"


class RegionMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegionMaster
        fields = "__all__"




class HowItWorksRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = HowItWorksRoute
        fields = "__all__"


class HowItWorksStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = HowItWorksStep
        fields = "__all__"


class ConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuration
        fields = "__all__"
