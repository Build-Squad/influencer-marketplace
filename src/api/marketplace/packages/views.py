from django.shortcuts import render
from marketplace.helpers import Pagination
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Package, ServiceMaster, Service
from core.models import Currency
from accounts.models import User
from .serializers import ServiceMasterSerializer, CreateServiceMasterSerializer, ServicesSerializer, CreateServicesSerializer, PackageSerializer, CreatePackageSerializer

# Service Master
@api_view(['GET'])
def getAllServiceMaster(request):
    try:
      serviceMaster = ServiceMaster.objects.filter(deleted_at=None)
      pagination = Pagination(serviceMaster, request)
      serializer = ServiceMasterSerializer(pagination.getData(), many=True)
      return Response({
          'code': 200,
          'success': True,
          'data': serializer.data,
          'message': 'All ServiceMaster retrieved successfully',
          'pagination': pagination.getPageInfo()
      })
    except Exception as e:
        print(e)
        return Response({
            'code': 500,
            'success': False,
            'data': None,
            'message': 'Internal Server Error'
        })
    
@api_view(['POST'])
def createServiceMaster(request):
    try:
      serializer = CreateServiceMasterSerializer(data=request.data)
      if serializer.is_valid():
        serializer.save()
        return Response({
            'code': 200,
            'success': True,
            'data': ServiceMasterSerializer(serializer.instance).data,
            'message': 'ServiceMaster created successfully'
        })
      else:
        return Response({
            'code': 400,
            'success': False,
            'data': None,
            'message': 'Invalid inputs',
            'errors': serializer.errors
        })
    except Exception as e:
        print(e)
        return Response({
            'code': 500,
            'success': False,
            'data': None,
            'message': 'Internal Server Error'
        })
    
@api_view(['PUT'])
def updateServiceMaster(request, pk):
    try:
      serviceMaster = ServiceMaster.objects.get(id=pk)
      serializer = CreateServiceMasterSerializer(instance=serviceMaster, data=request.data)
      if serializer.is_valid():
        serializer.save()
        return Response({
            'code': 200,
            'success': True,
            'data': ServiceMasterSerializer(serializer.instance).data,
            'message': 'ServiceMaster updated successfully'
        })
      else:
        return Response({
            'code': 400,
            'success': False,
            'data': None,
            'message': 'Invalid inputs',
            'errors': serializer.errors
        })
    except Exception as e:
        print(e)
        return Response({
            'code': 500,
            'success': False,
            'data': None,
            'message': 'Internal Server Error'
        })
    
@api_view(['DELETE'])
def deleteServiceMaster(request, pk):
    try:
      serviceMaster = ServiceMaster.objects.get(id=pk)
      serviceMaster.delete()
      return Response({
          'code': 200,
          'success': True,
          'data': None,
          'message': 'ServiceMaster deleted successfully'
      })
    except Exception as e:
        print(e)
        return Response({
            'code': 500,
            'success': False,
            'data': None,
            'message': 'Internal Server Error'
        })
    
# Service
@api_view(['GET'])
def getAllService(request):
    try:
      service = Service.objects.filter(deleted_at=None)
      pagination = Pagination(service, request)
      serializer = ServicesSerializer(pagination.getData(), many=True)
      return Response({
          'code': 200,
          'success': True,
          'data': serializer.data,
          'message': 'All Service retrieved successfully',
          'pagination': pagination.getPageInfo()
      })
    except Exception as e:
        print(e)
        return Response({
            'code': 500,
            'success': False,
            'data': None,
            'message': 'Internal Server Error'
        })
    
@api_view(['POST'])
def createService(request):
    try:
      serializer = CreateServicesSerializer(data=request.data)
      if serializer.is_valid():
        service_master = ServiceMaster.objects.get(id=request.data['service_master'])
        currency = Currency.objects.get(id=request.data['currency'])
        package = Package.objects.get(id=request.data['package'])
        serializer.save(service_master=service_master, package=package, currency=currency)
        return Response({
            'code': 200,
            'success': True,
            'date': ServicesSerializer(serializer.instance).data,
            'message': 'Service created successfully'
        })
      else:
        return Response({
            'code': 400,
            'success': False,
            'data': None,
            'message': 'Invalid inputs',
            'errors': serializer.errors
        })
    except Exception as e:
        print(e)
        return Response({
            'code': 500,
            'success': False,
            'data': None,
            'message': 'Internal Server Error'
        })
    
@api_view(['PUT'])
def updateService(request, pk):
    try:
      service = Service.objects.get(id=pk)
      serializer = CreateServicesSerializer(instance=service, data=request.data)
      if serializer.is_valid():
        serializer.save()
        return Response({
            'code': 200,
            'success': True,
            'data': ServicesSerializer(serializer.instance).data,
            'message': 'Service updated successfully'
        })
      else:
        return Response({
            'code': 400,
            'success': False,
            'data': None,
            'message': 'Invalid inputs',
            'errors': serializer.errors
        })
    except Exception as e:
        print(e)
        return Response({
            'code': 500,
            'success': False,
            'data': None,
            'message': 'Internal Server Error'
        })

@api_view(['DELETE'])
def deleteService(request, pk):
    try:
      service = Service.objects.get(id=pk)
      service.delete()
      return Response({
          'code': 200,
          'success': True,
          'data': None,
          'message': 'Service deleted successfully'
      })
    except Exception as e:
        print(e)
        return Response({
            'code': 500,
            'success': False,
            'data': None,
            'message': 'Internal Server Error'
        })
    
# Package
@api_view(['GET'])
def getAllPackage(request):
    try:
      package = Package.objects.filter(deleted_at=None)
      pagination = Pagination(package, request)
      serializer = PackageSerializer(pagination.getData(), many=True)
      return Response({
          'code': 200,
          'success': True,
          'data': serializer.data,
          'message': 'All Package retrieved successfully',
          'pagination': pagination.getPageInfo()
      })
    except Exception as e:
        print(e)
        return Response({
            'code': 500,
            'success': False,
            'data': None,
            'message': 'Internal Server Error'
        })

@api_view(['POST'])
def createPackage(request):
    try:
      serializer = CreatePackageSerializer(data=request.data)
      if serializer.is_valid():
        influencer = User.objects.get(id=request.data['influencer'])
        currency = Currency.objects.get(id=request.data['currency'])
        serializer.save(influencer=influencer, currency=currency)

        return Response({
            'code': 200,
            'success': True,
            'data': PackageSerializer(serializer.instance).data,
            'message': 'Package created successfully'
        })
      else:
        return Response({
            'code': 400,
            'success': False,
            'data': None,
            'message': 'Invalid inputs',
            'errors': serializer.errors
        })
    except Exception as e:
        print(e)
        return Response({
            'code': 500,
            'success': False,
            'data': None,
            'message': 'Internal Server Error'
        })
    
@api_view(['PUT'])
def updatePackage(request, pk):
    try:
      package = Package.objects.get(id=pk)
      serializer = CreatePackageSerializer(instance=package, data=request.data)
      if serializer.is_valid():
        serializer.save()
        return Response({
            'code': 200,
            'success': True,
            'data': PackageSerializer(serializer.instance).data,
            'message': 'Package updated successfully'
        })
      else:
        return Response({
            'code': 400,
            'success': False,
            'data': None,
            'message': 'Invalid inputs',
            'errors': serializer.errors
        })
    except Exception as e:
        print(e)
        return Response({
            'code': 500,
            'success': False,
            'data': None,
            'message': 'Internal Server Error'
        })
    
@api_view(['DELETE'])
def deletePackage(request, pk):
    try:
      package = Package.objects.get(id=pk)
      package.delete()
      return Response({
          'code': 200,
          'success': True,
          'data': None,
          'message': 'Package deleted successfully'
      })
    except Exception as e:
        print(e)
        return Response({
            'code': 500,
            'success': False,
            'data': None,
            'message': 'Internal Server Error'
        })
    
    