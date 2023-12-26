"""
Django settings for marketplace project.

Generated by 'django-admin startproject' using Django 3.0.3.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os
from decouple import config
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration



# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MARKETPLACE_APP_DIR = os.path.join(BASE_DIR, 'marketplace')
LOGGING_DIR = os.path.join(MARKETPLACE_APP_DIR, 'logs')

if not os.path.exists(LOGGING_DIR):
    os.makedirs(LOGGING_DIR)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "o421)j72pveh$waa8u1(s7+%$)d3c_^yt4y6qshaww26ft0p-n"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'django': {
            '()': 'django.utils.log.ServerFormatter',
            'format': '[{server_time}] {levelname} {message}',
            'style': '{',
        },
        'simpleRe': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    "handlers": {
        "console": {
            'level': 'INFO',
            "class": "logging.StreamHandler",
            "formatter": "django",
        },
        "file": {
            "level": "ERROR",
            'class': 'logging.handlers.TimedRotatingFileHandler',
            "filename": os.path.join(LOGGING_DIR, "error.log"),
            "formatter": "simpleRe",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["file"],
            "level": "INFO",
            "propagate": True,
        },
        "django.request": {
            "handlers": ["file"],
            "level": "ERROR",
            "propagate": True,
        },
        "": {
            "handlers": ["file"],
            "level": "ERROR",
            "propagate": True,
        },
    }
}

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    "dev-api.xfluencer.io",
    "3.9.194.155",
    "localhost",
]

CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://dev.xfluencer.io",
    "https://xfluencer.io",
    "https://13.41.134.64",
    "http://127.0.0.1:3000",
]

CORS_ORIGIN_WHITELIST = [
    "http://localhost:3000",
    "https://dev.xfluencer.io",
    "https://xfluencer.io",
    "https://13.41.134.64",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Application definition

INSTALLED_APPS = [
    "sslserver",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "accounts",
    "packages",
    "core",
    "orders",
    "corsheaders",
    "drf_yasg",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "marketplace.middleware.SentryCaptureExceptionMiddleware",
]

ROOT_URLCONF = "marketplace.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "marketplace.wsgi.application"

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    "default": {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        "NAME": config("DB_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOST"),
        "PORT": config("DB_PORT"),
    }
}

# Email
EMAIL_BACKEND = 'django_ses.SESBackend'
AWS_ACCESS_KEY_ID = config("AWS_ACCESS_KEY")
AWS_SECRET_ACCESS_KEY = config("AWS_ACCESS_SECRET_KEY")
AWS_SES_REGION_NAME = config("AWS_SES_REGION_NAME")
AWS_SES_REGION_ENDPOINT = config("AWS_SES_REGION_ENDPOINT")
USE_SES_V2 = True


# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

sentry_sdk.init(
    dsn=config("SENTRY_DSN"),
    traces_sample_rate=1.0,
    profiles_sample_rate=1.0,
    integrations=[DjangoIntegration()],
    enable_tracing=True,
    send_default_pii=True
)


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

# STATIC_URL = "/static/"
# STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# web accessible folder
STATIC_ROOT = '/home/xidev/xfluencer/influencer-marketplace/src/api/marketplace/static/'
# URL prefix for static files.
STATIC_URL = 'static/'
# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
  'django.contrib.staticfiles.finders.FileSystemFinder',
  'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

AUTH_USER_MODEL = "accounts.User"
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_USERNAME_REQUIRED = False
