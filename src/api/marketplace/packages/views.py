from marketplace.services import (
    Pagination,
    handleServerException,
    handleBadRequest,
    handleNotFound,
    handleDeleteNotAllowed,
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Package, ServiceMaster, Service
from drf_yasg.utils import swagger_auto_schema
from core.models import Currency
from accounts.models import User
from django.core.exceptions import ValidationError
from django.db.models import Q
from .serializers import (
    ServiceMasterSerializer,
    CreateServiceMasterSerializer,
    ServicesSerializer,
    CreateServicesSerializer,
    PackageSerializer,
    CreatePackageSerializer,
)


# Service Master
class ServiceMasterList(APIView):
    def get(self, request):
        try:
            search = request.GET.get("search", "")
            order_by = request.GET.get("order_by", "-created_at")
            serviceMaster = ServiceMaster.objects.filter(
                Q(name__icontains=search) | Q(description__icontains=search),
                deleted_at=None,
            ).order_by(order_by)
            pagination = Pagination(serviceMaster, request)
            serializer = ServiceMasterSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Service Master retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=CreateServiceMasterSerializer)
    def post(self, request):
        try:
            serializer = CreateServiceMasterSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": ServiceMasterSerializer(serializer.instance).data,
                        "message": "Service Master created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
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
                return handleNotFound("Service Master")
            serializer = ServiceMasterSerializer(serviceMaster)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Service Master retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=CreateServiceMasterSerializer)
    def put(self, request, pk):
        try:
            serviceMaster = self.get_object(pk)
            if serviceMaster is None:
                return handleNotFound("Service Master")
            serializer = CreateServiceMasterSerializer(
                instance=serviceMaster, data=request.data
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": ServiceMasterSerializer(serializer.instance).data,
                        "message": "Service Master updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    def delete(self, request, pk):
        try:
            serviceMaster = self.get_object(pk)
            if serviceMaster is None:
                return handleNotFound("Service Master")
            try:
                serviceMaster.delete()
            except ValidationError as e:
                return handleDeleteNotAllowed("Service Master")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "Service Master deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


# Service
class ServiceList(APIView):
    def get(self, request):
        try:
            search = request.GET.get("search", "")
            order_by = request.GET.get("order_by", "-created_at")
            quantity_gt = request.GET.get("quantity_gt", None)
            quantity_lt = request.GET.get("quantity_lt", None)
            price_gt = request.GET.get("price_gt", None)
            price_lt = request.GET.get("price_lt", None)

            service = Service.objects.filter(
                Q(service_master__name__icontains=search)
                | Q(package__name__icontains=search),
                deleted_at=None,
            )

            if quantity_gt is not None:
                service = service.filter(quantity__gt=quantity_gt)
            if quantity_lt is not None:
                service = service.filter(quantity__lt=quantity_lt)
            if price_gt is not None:
                service = service.filter(price__gt=price_gt)
            if price_lt is not None:
                service = service.filter(price__lt=price_lt)

            service = service.order_by(order_by)

            pagination = Pagination(service, request)
            serializer = ServicesSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Services retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=CreateServicesSerializer)
    def post(self, request):
        try:
            serializer = CreateServicesSerializer(data=request.data)
            if serializer.is_valid():
                try:
                    service_master = ServiceMaster.objects.get(
                        id=request.data["service_master"], deleted_at=None
                    )
                except ServiceMaster.DoesNotExist:
                    return handleBadRequest("Service Master does not exist")
                currency = Currency.objects.get(id=request.data["currency"])
                try:
                    package = Package.objects.get(
                        id=request.data["package"], deleted_at=None
                    )
                except Package.DoesNotExist:
                    return handleBadRequest("Package does not exist")
                serializer.save(
                    service_master=service_master, package=package, currency=currency
                )
                return Response(
                    {
                        "isSuccess": True,
                        "data": ServicesSerializer(serializer.instance).data,
                        "message": "Service created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
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
                return handleNotFound("Service")
            serializer = ServicesSerializer(service)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Service retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=CreateServicesSerializer)
    def put(self, request, pk):
        try:
            service = self.get_object(pk)
            if service is None:
                return handleNotFound("Service")
            serializer = CreateServicesSerializer(instance=service, data=request.data)
            if serializer.is_valid():
                try:
                    service_master = ServiceMaster.objects.get(
                        id=request.data["service_master"], deleted_at=None
                    )
                except ServiceMaster.DoesNotExist:
                    return handleBadRequest("Service Master does not exist")
                currency = Currency.objects.get(id=request.data["currency"])
                try:
                    package = Package.objects.get(
                        id=request.data["package"], deleted_at=None
                    )
                except Package.DoesNotExist:
                    return handleBadRequest("Package does not exist")
                serializer.save(
                    service_master=service_master, package=package, currency=currency
                )
                return Response(
                    {
                        "isSuccess": True,
                        "data": ServicesSerializer(serializer.instance).data,
                        "message": "Service updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    def delete(self, request, pk):
        try:
            service = self.get_object(pk)
            if service is None:
                return handleNotFound("Service")
            service.delete()
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "Service deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


# Package
class PackageList(APIView):
    def get(self, request):
        try:
            search = request.GET.get("search", "")
            order_by = request.GET.get("order_by", "-created_at")
            price_gt = request.GET.get("price_gt", None)
            price_lt = request.GET.get("price_lt", None)

            package = Package.objects.filter(
                Q(name__icontains=search) | Q(description__icontains=search),
                deleted_at=None,
            )

            if price_gt is not None:
                package = package.filter(price__gt=price_gt)
            if price_lt is not None:
                package = package.filter(price__lt=price_lt)

            package = package.order_by(order_by)

            pagination = Pagination(package, request)
            serializer = PackageSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Package retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=CreatePackageSerializer)
    def post(self, request):
        try:
            serializer = CreatePackageSerializer(data=request.data)
            if serializer.is_valid():
                influencer = User.objects.get(id=request.data["influencer"])
                currency = Currency.objects.get(id=request.data["currency"])
                serializer.save(influencer=influencer, currency=currency)
                return Response(
                    {
                        "isSuccess": True,
                        "data": PackageSerializer(serializer.instance).data,
                        "message": "Package created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
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
                return handleNotFound("Package")
            serializer = PackageSerializer(package)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Package retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=CreatePackageSerializer)
    def put(self, request, pk):
        try:
            package = self.get_object(pk)
            if package is None:
                return handleNotFound("Package")
            serializer = CreatePackageSerializer(instance=package, data=request.data)
            if serializer.is_valid():
                influencer = User.objects.get(id=request.data["influencer"])
                currency = Currency.objects.get(id=request.data["currency"])
                serializer.save(influencer=influencer, currency=currency)
                return Response(
                    {
                        "isSuccess": True,
                        "data": PackageSerializer(serializer.instance).data,
                        "message": "Package updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    def delete(self, request, pk):
        try:
            package = self.get_object(pk)
            if package is None:
                return handleNotFound("Package")
            try:
                package.delete()
            except ValidationError as e:
                return handleDeleteNotAllowed("Package")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "Package deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)
