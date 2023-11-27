from marketplace.services import Pagination, handleServerException, handleBadRequest, handleNotFound
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
              'message': 'All Service Master retrieved successfully',
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
                'message': 'Service Master created successfully'
            }, status=status.HTTP_201_CREATED)
          else:
            return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)
    
class ServiceMasterDetail(APIView):
    def get_object(self, pk):
        try:
            return ServiceMaster.objects.get(pk=pk, deleted_at=None)
        except ServiceMaster.DoesNotExist:
            return None
        
    def get(self, request, pk):
        try:
          serviceMaster = self.get_object(pk)
          if serviceMaster is None:
            return handleNotFound('ServiceMaster')
          serializer = ServiceMasterSerializer(serviceMaster)
          return Response({
              'isSuccess': True,
              'data': serializer.data,
              'message': 'Service Master retrieved successfully'
          }, status=status.HTTP_200_OK)
        except Exception as e:
            return handleServerException(e)
        
    def put(self, request, pk):
        try:
          serviceMaster = self.get_object(pk)
          if serviceMaster is None:
            return handleNotFound('ServiceMaster')
          serializer = CreateServiceMasterSerializer(instance=serviceMaster, data=request.data)
          if serializer.is_valid():
            serializer.save()
            return Response({
                'isSuccess': True,
                'data': ServiceMasterSerializer(serializer.instance).data,
                'message': 'Service Master updated successfully'
            }, status=status.HTTP_200_OK)
          else:
            return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)
        
    def delete(self, request, pk):
        try:
          serviceMaster = self.get_object(pk)
          if serviceMaster is None:
            return handleNotFound('ServiceMaster')
          serviceMaster.delete()
          return Response({
              'isSuccess': True,
              'data': None,
              'message': 'Service Master deleted successfully'
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
            try:
              service_master = ServiceMaster.objects.get(id=request.data['service_master'], deleted_at=None)
            except ServiceMaster.DoesNotExist:
              return handleBadRequest('Service Master does not exist')
            currency = Currency.objects.get(id=request.data['currency'])
            try:
              package = Package.objects.get(id=request.data['package'], deleted_at=None)
            except Package.DoesNotExist:
              return handleBadRequest('Package does not exist')
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
            return Service.objects.get(pk=pk, deleted_at=None)
        except Service.DoesNotExist:
            return None
        
    def get(self, request, pk):
        try:
          service = self.get_object(pk)
          if service is None:
            return handleNotFound('Service')
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
          if service is None:
            return handleNotFound('Service')
          serializer = CreateServicesSerializer(instance=service, data=request.data)
          if serializer.is_valid():
            try:
              service_master = ServiceMaster.objects.get(id=request.data['service_master'], deleted_at=None)
            except ServiceMaster.DoesNotExist:
              return handleBadRequest('Service Master does not exist')
            currency = Currency.objects.get(id=request.data['currency'])
            try:
              package = Package.objects.get(id=request.data['package'], deleted_at=None)
            except Package.DoesNotExist:
              return handleBadRequest('Package does not exist')
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
          if service is None:
            return handleNotFound('Service')
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
            return Package.objects.get(pk=pk, deleted_at=None)
        except Package.DoesNotExist:
            return None
        
    def get(self, request, pk):
        try:
          package = self.get_object(pk)
          if package is None:
            return handleNotFound('Package')
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
          if package is None:
            return handleNotFound('Package')
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
          if package is None:
            return handleNotFound('Package')
          package.delete()
          return Response({
              'isSuccess': True,
              'data': None,
              'message': 'Package deleted successfully'
          }, status=status.HTTP_200_OK)
        except Exception as e:
            return handleServerException(e)
    