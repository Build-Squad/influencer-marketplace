from django.urls import path
from .views import (
    CountryListView,
    CountryDetailView,
    CurrencyListView,
    CurrencyDetailView,
    HowItWorksStepsView,
    LanguageListView,
    LanguageDetailView,
    RegionListView,
    TwitterUsageView,
)

urlpatterns = [
    path("country/", CountryListView.as_view()),
    path("country/<str:pk>/", CountryDetailView.as_view()),
    path("currency/", CurrencyListView.as_view()),
    path("currency/<str:pk>/", CurrencyDetailView.as_view()),
    path("language-master/", LanguageListView.as_view()),
    path("language-master/<str:pk>/", LanguageDetailView.as_view()),
    path("regions-master/", RegionListView.as_view()),
    path("how-it-works-steps/", HowItWorksStepsView.as_view()),
    path("twitter-usage/", TwitterUsageView.as_view(), name="twitter-usage"),
]
