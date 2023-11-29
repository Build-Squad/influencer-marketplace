"""marketplace URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include
from django.urls import path
from . import views

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="XFluencer API Documentation",
        default_version="v1",
        description="",
    ),
    public=True,
    permission_classes=[],
)


urlpatterns = [
    path(
        "api/docs/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("admin/", admin.site.urls),
    path('packages/', include('packages.urls'), name='packages'),
    path("auth-twitter-user/", views.authTwitterUser, name="auth-twitter-user"),
    path(
        "twitter-login-callback/",
        views.twitterLoginCallback,
        name="twitter-login-callback",
    ),
    path("is-authenticated/", views.isAuthenticated, name="is-authenticated"),
    path("logout/", views.logoutUser, name="logout"),
]
