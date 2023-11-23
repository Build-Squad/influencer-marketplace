from rest_framework import serializers

from .models import Currency, Country



class CountrySerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)
    name = serializers.CharField(required=False)
    country_code = serializers.CharField(required=False)

    class Meta:
        model = Country
        fields = '__all__'
        # fields = ('id', 'name', 'country_code')

class CurrencySerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)
    name = serializers.CharField(required=False)
    symbol = serializers.CharField(required=False)
    country = CountrySerializer(required=False)

    class Meta:
        model = Currency
        fields = '__all__'
        # fields = ('id', 'name', 'symbol', 'country')