#  import serializers
from locale import currency
from accounts.serializers import InfluencerSerializer, UserSerializer
from rest_framework import serializers
from .models import ServiceMaster, Service, Package, ServiceMasterMetaData
from core.serializers import CurrencySerializer
from uuid import UUID


class ServiceMasterMetaDataSerilizer(serializers.ModelSerializer):
    class Meta:
        model = ServiceMasterMetaData
        fields = '__all__'


class ServiceMasterReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceMaster
        fields = '__all__'

class ServiceMasterSerializer(serializers.ModelSerializer):
    service_master_meta_data = ServiceMasterMetaDataSerilizer(
        source='service_master_meta_data_id', many=True, read_only=True)
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
    influencer = InfluencerSerializer(read_only=True)
    class Meta:
        model = Package
        fields = '__all__'
        # fields = ('id', 'influencer', 'name', 'description', 'price', 'currency', 'status', 'publish_date', 'created_at'


class CreatePackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = '__all__'

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
    package = CreatePackageSerializer()

    class Meta:
        model = Service
        fields = '__all__'

    def create(self, validated_data):
        package_data = validated_data.pop('package')
        package_data['influencer'] = self.context['request'].user_account
        package = Package.objects.create(**package_data)
        service = Service.objects.create(package=package, **validated_data)
        return service

    def update(self, instance, validated_data):
        package_data = validated_data.pop('package', {})
        package_data['influencer'] = self.context['request'].user_account
        Package.objects.filter(id=instance.package.id).update(**package_data)
        return super().update(instance, validated_data)
