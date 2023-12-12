from marketplace.services import Pagination, handleServerException, handleNotFound
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Country, Currency, Language
from django.db.models import Q
from .serializers import CountrySerializer, CurrencySerializer, LanguageSerializer


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
            if search:
                currencies = Currency.objects.filter(
                    Q(name__icontains=search) | Q(symbol__icontains=search)
                )
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
            language = Language.objects.all()
            if search:
                language = Language.objects.filter(
                    Q(langCode__icontains=search) | Q(langEnglishName__icontains=search)
                )
            else:
                language = Language.objects.all()
            if order_by:
                language = language.order_by(order_by)
            pagination = Pagination(language, request)
            serializer = LanguageSerializer(language, many=True)
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
            language = Language.objects.get(pk=pk)
            serializer = LanguageSerializer(language)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Language retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Language.DoesNotExist:
            return handleNotFound()
        except Exception as e:
            return handleServerException(e)
