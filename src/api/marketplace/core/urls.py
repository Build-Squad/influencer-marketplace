from django.urls import path
from .views import (
    CountryListView,
    CountryDetailView,
    CurrencyListView,
    CurrencyDetailView,
    LanguageListView,
    LanguageDetailView,
)

urlpatterns = [
    path("country/", CountryListView.as_view()),
    path("country/<str:pk>/", CountryDetailView.as_view()),
    path("currency/", CurrencyListView.as_view()),
    path("currency/<str:pk>/", CurrencyDetailView.as_view()),
    path("language-master/", LanguageListView.as_view()),
    path("language-master/<str:pk>/", LanguageDetailView.as_view()),
]
