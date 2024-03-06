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
)

urlpatterns = [
    path("country/", CountryListView.as_view()),
    path("country/<str:pk>/", CountryDetailView.as_view()),
    path("currency/", CurrencyListView.as_view()),
    path("currency/<str:pk>/", CurrencyDetailView.as_view()),
    path("language-master/", LanguageListView.as_view()),
    path("language-master/<str:pk>/", LanguageDetailView.as_view()),
    path("regions-master/", RegionListView.as_view()),
    path("how-it-works-steps/<str:route>", HowItWorksStepsView.as_view()),
]
