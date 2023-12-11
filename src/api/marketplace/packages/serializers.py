#  import serializers
from locale import currency
from rest_framework import serializers
from .models import ServiceMaster, Service, Package
from core.serializers import CurrencySerializer

class ServiceMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceMaster
        fields = '__all__'
        # fields = ('id', 'name', 'description', 'limit', 'type', 'created_at')

class CreateServiceMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceMaster
        fields = '__all__'
        # fields = ('id', 'name', 'description', 'limit', 'type', 'created_at')

class PackageSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer()
    class Meta:
        model = Package
        fields = '__all__'
        # fields = ('id', 'influencer', 'name', 'description', 'price', 'currency', 'status', 'publish_date', 'created_at'

class CreatePackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = '__all__'
        # fields = ('id', 'influencer', 'name', 'description', 'price', 'currency', 'status', 'publish_date', 'created_at'

class ServicesSerializer(serializers.ModelSerializer):
    service_master = ServiceMasterSerializer()
    package = PackageSerializer()
    currency = CurrencySerializer()
    class Meta:
        model = Service
        # Add the package and service_master o
        fields = '__all__'
        # fields = ('id', 'service_master', 'package', 'quantity', 'price', 'currency', 'status'

class CreateServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'
        # fields = ('id', 'service_master', 'package', 'quantity', 'price', 'currency', 'status'

    def validate(self, data):
        service_master = data.get('service_master')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        # If service_master is just the ID, retrieve the ServiceMaster instance
        if isinstance(service_master, int):
            service_master = ServiceMaster.objects.get(id=service_master)

        if service_master.is_duration_based:
            if start_date is None or end_date is None:
                raise serializers.ValidationError(
                    "Start date and end date cannot be empty")
        else:
            if start_date is not None or end_date is not None:
                raise serializers.ValidationError(
                    "Service Master is not duration based. Start date and end date should be empty")

        return data
