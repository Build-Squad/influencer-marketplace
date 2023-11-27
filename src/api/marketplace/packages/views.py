from marketplace.services import Pagination, handleServerException, handleBadRequest
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from rest_framework.views import APIView
from .models import Package, ServiceMaster, Service
from core.models import Currency
from accounts.models import User
from .serializers import ServiceMasterSerializer, CreateServiceMasterSerializer, ServicesSerializer, CreateServicesSerializer, PackageSerializer, CreatePackageSerializer

# Service Master
class ServiceMasterList(APIView):
    def get(self, request):
        try:
          serviceMaster = ServiceMaster.objects.filter(deleted_at=None)
          pagination = Pagination(serviceMaster, request)
          serializer = ServiceMasterSerializer(pagination.getData(), many=True)
          return Response({
              'isSuccess': True,
              'data': serializer.data,
              'message': 'All ServiceMaster retrieved successfully',
              'pagination': pagination.getPageInfo()
          }, status=status.HTTP_200_OK)
        except Exception as e:
            return handleServerException(e)
        
    def post(self, request):
        try:
          serializer = CreateServiceMasterSerializer(data=request.data)
          if serializer.is_valid():
            serializer.save()
            return Response({
                'isSuccess': True,
                'data': ServiceMasterSerializer(serializer.instance).data,
                'message': 'ServiceMaster created successfully'
            }, status=status.HTTP_201_CREATED)
          else:
            return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)
    
class ServiceMasterDetail(APIView):
    def get_object(self, pk):
        try:
            return ServiceMaster.objects.get(pk=pk)
        except ServiceMaster.DoesNotExist:
            raise Http404
        
    def get(self, request, pk):
        try:
          serviceMaster = self.get_object(pk)
          serializer = ServiceMasterSerializer(serviceMaster)
          return Response({
              'isSuccess': True,
              'data': serializer.data,
              'message': 'ServiceMaster retrieved successfully'
          }, status=status.HTTP_200_OK)
        except Exception as e:
            return handleServerException(e)
        
    def put(self, request, pk):
        try:
          serviceMaster = self.get_object(pk)
          serializer = CreateServiceMasterSerializer(instance=serviceMaster, data=request.data)
          if serializer.is_valid():
            serializer.save()
            return Response({
                'isSuccess': True,
                'data': ServiceMasterSerializer(serializer.instance).data,
                'message': 'ServiceMaster updated successfully'
            }, status=status.HTTP_200_OK)
          else:
            return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)
        
    def delete(self, request, pk):
        try:
          serviceMaster = self.get_object(pk)
          serviceMaster.delete()
          return Response({
              'isSuccess': True,
              'data': None,
              'message': 'ServiceMaster deleted successfully'
          }, status=status.HTTP_200_OK)
        except Exception as e:
            return handleServerException(e)

# Service    
class ServiceList(APIView):
    def get(self, request):
        try:
          service = Service.objects.filter(deleted_at=None)
          pagination = Pagination(service, request)
          serializer = ServicesSerializer(pagination.getData(), many=True)
          return Response({
              'isSuccess': True,
              'data': serializer.data,
              'message': 'All Service retrieved successfully',
              'pagination': pagination.getPageInfo()
          }, status=status.HTTP_200_OK)
        except Exception as e:
            return handleServerException(e)
        
    def post(self, request):
        try:
          serializer = CreateServicesSerializer(data=request.data)
          if serializer.is_valid():
            service_master = ServiceMaster.objects.get(id=request.data['service_master'])
            currency = Currency.objects.get(id=request.data['currency'])
            package = Package.objects.get(id=request.data['package'])
            serializer.save(service_master=service_master, package=package, currency=currency)
            return Response({
                'isSuccess': True,
                'data': ServicesSerializer(serializer.instance).data,
                'message': 'Service created successfully'
            }, status=status.HTTP_201_CREATED)
          else:
            return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)
class ServiceDetail(APIView):
    def get_object(self, pk):
        try:
            return Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            raise Http404
        
    def get(self, request, pk):
        try:
          service = self.get_object(pk)
          serializer = ServicesSerializer(service)
          return Response({
              'isSuccess': True,
              'data': serializer.data,
              'message': 'Service retrieved successfully'
          }, status=status.HTTP_200_OK)
        except Exception as e:
            return handleServerException(e)
        
    def put(self, request, pk):
        try:
          service = self.get_object(pk)
          serializer = CreateServicesSerializer(instance=service, data=request.data)
          if serializer.is_valid():
            service_master = ServiceMaster.objects.get(id=request.data['service_master'])
            currency = Currency.objects.get(id=request.data['currency'])
            package = Package.objects.get(id=request.data['package'])
            serializer.save(service_master=service_master, package=package, currency=currency)
            return Response({
                'isSuccess': True,
                'data': ServicesSerializer(serializer.instance).data,
                'message': 'Service updated successfully'
            }, status=status.HTTP_200_OK)
          else:
            return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)
        
    def delete(self, request, pk):
        try:
          service = self.get_object(pk)
          service.delete()
          return Response({
              'isSuccess': True,
              'data': None,
              'message': 'Service deleted successfully'
          }, status=status.HTTP_200_OK)
        except Exception as e:
            return handleServerException(e)
            
# Package
class PackageList(APIView):
    def get(self, request):
        try:
          package = Package.objects.filter(deleted_at=None)
          pagination = Pagination(package, request)
          serializer = PackageSerializer(pagination.getData(), many=True)
          return Response({
              'isSuccess': True,
              'data': serializer.data,
              'message': 'All Package retrieved successfully',
              'pagination': pagination.getPageInfo()
          }, status=status.HTTP_200_OK)
        except Exception as e:
            return handleServerException(e)
        
    def post(self, request):
        try:
          serializer = CreatePackageSerializer(data=request.data)
          if serializer.is_valid():
            influencer = User.objects.get(id=request.data['influencer'])
            currency = Currency.objects.get(id=request.data['currency'])
            serializer.save(influencer=influencer, currency=currency)
            return Response({
                'isSuccess': True,
                'data': PackageSerializer(serializer.instance).data,
                'message': 'Package created successfully'
            }, status=status.HTTP_201_CREATED)
          else:
            return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

class PackageDetail(APIView):
    def get_object(self, pk):
        try:
            return Package.objects.get(pk=pk)
        except Package.DoesNotExist:
            raise Http404
        
    def get(self, request, pk):
        try:
          package = self.get_object(pk)
          serializer = PackageSerializer(package)
          return Response({
              'isSuccess': True,
              'data': serializer.data,
              'message': 'Package retrieved successfully'
          }, status=status.HTTP_200_OK)
        except Exception as e:
            return handleServerException(e)
        
    def put(self, request, pk):
        try:
          package = self.get_object(pk)
          serializer = CreatePackageSerializer(instance=package, data=request.data)
          if serializer.is_valid():
            influencer = User.objects.get(id=request.data['influencer'])
            currency = Currency.objects.get(id=request.data['currency'])
            serializer.save(influencer=influencer, currency=currency)
            return Response({
                'isSuccess': True,
                'data': PackageSerializer(serializer.instance).data,
                'message': 'Package updated successfully'
            }, status=status.HTTP_200_OK)
          else:
            return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)
        
    def delete(self, request, pk):
        try:
          package = self.get_object(pk)
          package.delete()
          return Response({
              'isSuccess': True,
              'data': None,
              'message': 'Package deleted successfully'
          }, status=status.HTTP_200_OK)
        except Exception as e:
            return handleServerException(e)
    