from django.shortcuts import render
from marketplace.helpers import Pagination
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Package, ServiceMaster, Service
from .serializers import ServiceMasterSerializer, CreateServiceMasterSerializer, ServicesSerializer, CreateServicesSerializer, PackageSerializer, CreatePackageSerializer
# Create your views here.

# Service Master
@api_view(['GET'])
def getAllServiceMaster(request):
    try:
      serviceMaster = ServiceMaster.objects.all()
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
            'data': serializer.data,
            'message': 'ServiceMaster created successfully'
        })
      else:
        return Response({
            'code': 400,
            'success': False,
            'data': None,
            'message': 'Bad Request'
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
            'data': serializer.data,
            'message': 'ServiceMaster updated successfully'
        })
      else:
        return Response({
            'code': 400,
            'success': False,
            'data': None,
            'message': 'Bad Request'
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
      service = Service.objects.all()
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
        serializer.save()
        return Response({
            'code': 200,
            'success': True,
            'data': serializer.data,
            'message': 'Service created successfully'
        })
      else:
        return Response({
            'code': 400,
            'success': False,
            'data': None,
            'message': 'Bad Request'
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
            'data': serializer.data,
            'message': 'Service updated successfully'
        })
      else:
        return Response({
            'code': 400,
            'success': False,
            'data': None,
            'message': 'Bad Request'
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
      package = Package.objects.all()
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
        serializer.save()
        return Response({
            'code': 200,
            'success': True,
            'data': serializer.data,
            'message': 'Package created successfully'
        })
      else:
        return Response({
            'code': 400,
            'success': False,
            'data': None,
            'message': 'Bad Request'
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
            'data': serializer.data,
            'message': 'Package updated successfully'
        })
      else:
        return Response({
            'code': 400,
            'success': False,
            'data': None,
            'message': 'Bad Request'
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
    
    