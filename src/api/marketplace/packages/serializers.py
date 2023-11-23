#  import serializers
from rest_framework import serializers
from .models import ServiceMaster, Service, Package

class ServiceMasterSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)
    name = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    limit = serializers.CharField(required=False)
    type = serializers.CharField(required=False)
    created_at = serializers.DateTimeField(required=False)

    class Meta:
        model = ServiceMaster
        fields = '__all__'
        # fields = ('id', 'name', 'description', 'limit', 'type', 'created_at')

class CreateServiceMasterSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)
    name = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    limit = serializers.CharField(required=True)
    type = serializers.CharField(required=True)
    created_at = serializers.DateTimeField(required=False)

    class Meta:
        model = ServiceMaster
        fields = '__all__'
        # fields = ('id', 'name', 'description', 'limit', 'type', 'created_at')



class PackageSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)
    influencer = serializers.CharField(required=False)
    name = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    price = serializers.DecimalField(required=False, max_digits=10, decimal_places=2)
    currency = serializers.CharField(required=False)
    status = serializers.CharField(required=False)
    publish_date = serializers.DateTimeField(required=False)
    created_at = serializers.DateTimeField(required=False)

    class Meta:
        model = Package
        fields = '__all__'
        # fields = ('id', 'influencer', 'name', 'description', 'price', 'currency', 'status', 'publish_date', 'created_at'

class CreatePackageSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)
    influencer = serializers.CharField(required=True)
    name = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    price = serializers.DecimalField(required=True, max_digits=10, decimal_places=2)
    currency = serializers.CharField(required=True)
    status = serializers.CharField(required=True)
    publish_date = serializers.DateTimeField(required=True)
    created_at = serializers.DateTimeField(required=False)

    class Meta:
        model = Package
        fields = '__all__'
        # fields = ('id', 'influencer', 'name', 'description', 'price', 'currency', 'status', 'publish_date', 'created_at'

class ServicesSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)
    service_master = ServiceMasterSerializer(required=False)
    package = PackageSerializer(required=False)
    quantity = serializers.IntegerField(required=False)
    price = serializers.DecimalField(required=False, max_digits=10, decimal_places=2)
    currency = serializers.CharField(required=False)
    status = serializers.CharField(required=False)


    class Meta:
        model = Service
        fields = '__all__'
        # fields = ('id', 'service_master', 'package', 'quantity', 'price', 'currency', 'status'

class CreateServicesSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)
    service_master = serializers.CharField(required=True)
    package = serializers.CharField(required=True)
    quantity = serializers.IntegerField(required=True)
    price = serializers.DecimalField(required=True, max_digits=10, decimal_places=2)
    currency = serializers.CharField(required=True)
    status = serializers.CharField(required=True)

    class Meta:
        model = Service
        fields = '__all__'
        # fields = ('id', 'service_master', 'package', 'quantity', 'price', 'currency', 'status'