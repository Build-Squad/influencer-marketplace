from .services import get_twitter_usage
from marketplace.services import Pagination, handleServerException, handleNotFound
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Configuration, Country, Currency, HowItWorksStep, LanguageMaster, RegionMaster
from django.db.models import Q
from .serializers import (
    ConfigurationSerializer,
    CountrySerializer,
    CurrencySerializer,
    HowItWorksStepSerializer,
    LanguageMasterSerializer,
    RegionMasterSerializer,
)


class CountryListView(APIView):
    def get(self, request, format=None):
        try:
            search = request.GET.get("search", None)
            order_by = request.GET.get("order_by", None)
            if search:
                countries = Country.objects.filter(
                    Q(name__icontains=search) | Q(country_code__icontains=search)
                )
            else:
                countries = Country.objects.all()
            if order_by:
                countries = countries.order_by(order_by)
            pagination = Pagination(countries, request)
            serializer = CountrySerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Countries retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


class CountryDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            country = Country.objects.get(pk=pk)
            serializer = CountrySerializer(country)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Country retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Country.DoesNotExist:
            return handleNotFound()
        except Exception as e:
            return handleServerException(e)


class CurrencyListView(APIView):
    def get(self, request, format=None):
        try:
            search = request.GET.get("search", None)
            order_by = request.GET.get("order_by", None)
            is_default = request.GET.get("is_default", None)
            if search:
                currencies = Currency.objects.filter(
                    Q(name__icontains=search) | Q(symbol__icontains=search)
                )
            if is_default:
                currencies = Currency.objects.filter(
                    is_default=is_default == "true")
            else:
                currencies = Currency.objects.all()
            if order_by:
                currencies = currencies.order_by(order_by)
            pagination = Pagination(currencies, request)
            serializer = CurrencySerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Currencies retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


class CurrencyDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            currency = Currency.objects.get(pk=pk)
            serializer = CurrencySerializer(currency)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Currency retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Currency.DoesNotExist:
            return handleNotFound()
        except Exception as e:
            return handleServerException(e)


class LanguageListView(APIView):
    def get(self, request, format=None):
        try:
            search = request.GET.get("search", None)
            order_by = request.GET.get("order_by", None)
            language = LanguageMaster.objects.all()
            if search:
                language = LanguageMaster.objects.filter(
                    Q(langCode__icontains=search) | Q(langEnglishName__icontains=search)
                )
            else:
                language = LanguageMaster.objects.all()
            if order_by:
                language = language.order_by(order_by)
            pagination = Pagination(language, request)
            serializer = LanguageMasterSerializer(language, many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Languages retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


class LanguageDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            language = LanguageMaster.objects.get(pk=pk)
            serializer = LanguageMasterSerializer(language)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "LanguageMaster retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except LanguageMaster.DoesNotExist:
            return handleNotFound()
        except Exception as e:
            return handleServerException(e)


class RegionListView(APIView):
    def get(self, request):
        try:
            regions = RegionMaster.objects.all()
            pagination = Pagination(regions, request)
            serializer = RegionMasterSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Regions retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)



class HowItWorksStepsView(APIView):
    def post(self, request):
        try:
            route = request.data["route"]
            steps = HowItWorksStep.objects.filter(step_route__route = route)
            serializer = HowItWorksStepSerializer(steps, many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": f"Data fetched for {route} route successful",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


class TwitterUsageView(APIView):
    def get(self, request):
        try:
            usage = get_twitter_usage()
            if usage:
                return Response(
                    {
                        "isSuccess": True,
                        "data": usage,
                        "message": "Twitter usage data fetched successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "isSuccess": False,
                        "message": "Twitter usage data not found",
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            return handleServerException(e)


class ConfigurationView(APIView):
    # A get request with a key filter from request params
    def get(self, request):
        try:
            configurations = Configuration.objects.all()
            if request.GET.get("key"):
                configurations = configurations.filter(
                    key=request.GET.get("key"))
            serializer = ConfigurationSerializer(configurations, many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Configuration fetched successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)
