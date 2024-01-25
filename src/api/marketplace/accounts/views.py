from distutils.util import strtobool
from http.client import HTTPResponse
import uuid
from urllib import request

from django.shortcuts import get_object_or_404
from core.models import RegionMaster
from marketplace.authentication import JWTAuthentication
from django.db.models import Q
from marketplace.services import (
    EmailService,
    Pagination,
    handleServerException,
    handleBadRequest,
    handleNotFound,
    handleDeleteNotAllowed,
    JWTOperations,
    truncateWalletAddress,
)
from drf_yasg.utils import swagger_auto_schema
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from packages.models import Package, Service
from .models import (
    AccountLanguage,
    AccountRegion,
    BusinessAccountMetaData,
    TwitterAccount,
    CategoryMaster,
    AccountCategory,
    User,
    BankAccount,
    Role,
    Wallet,
    WalletNetwork,
    WalletProvider,
)
from .serializers import (
    AccountRegionSerializer,
    BusinessAccountMetaDataSerializer,
    CreateAccountCategorySerializer,
    DeleteAccountCategorySerializer,
    OTPAuthenticationSerializer,
    OTPVerificationSerializer,
    TwitterAccountSerializer,
    CategoryMasterSerializer,
    AccountCategorySerializer,
    UserCreateSerializer,
    UserSerializer,
    BankAccountSerializer,
    TwitterAuthSerializer,
    RoleSerializer,
    EmailVerificationSerializer,
    WalletAuthSerializer,
    WalletConnectSerializer,
    WalletSerializer,
)
from .services import OTPAuthenticationService, TwitterAuthenticationService
from decouple import config
import datetime


# Twitter account API-Endpoint
# List-Create-API


class RoleList(APIView):
    def get(self, request):
        try:
            role = Role.objects.all()
            pagination = Pagination(role, request)
            serializer = RoleSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Roles retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


class RoleDetail(APIView):
    def get_object(self, pk):
        try:
            return Role.objects.get(pk=pk)
        except Role.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            role = self.get_object(pk)
            if role is None:
                return handleNotFound("Role")
            serializer = RoleSerializer(role)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Role retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


class TopInfluencers(APIView):
    def get(self, request):
        try:
            twitterAccount = TwitterAccount.objects.all().order_by("-followers_count")[
                :8
            ]
            # Paginate the results
            pagination = Pagination(twitterAccount, request)
            serializer = TwitterAccountSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Top 8 Twitter Account retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


class TwitterAccountList(APIView):
    def get(self, request):
        try:
            languages = request.GET.getlist("languages[]", [])

            serviceTypes = request.GET.getlist("serviceTypes[]", [])

            categories = request.GET.getlist("categories[]", [])

            collaborationIds = request.GET.getlist("collaborationIds[]", [])

            upperPriceLimit = request.GET.get("upperPriceLimit", "")
            lowerPriceLimit = request.GET.get("lowerPriceLimit", "")
            upperFollowerLimit = request.GET.get("upperFollowerLimit", "")
            lowerFollowerLimit = request.GET.get("lowerFollowerLimit", "")

            searchString = request.GET.get("searchString", "")
            isVerified_str = request.GET.get("isVerified", "false")
            isVerified = bool(strtobool(isVerified_str))

            # Filter based on parameters
            twitterAccount = TwitterAccount.objects.all()

            # From the account model itself.
            if upperFollowerLimit:
                twitterAccount = twitterAccount.filter(
                    followers_count__lte=upperFollowerLimit
                )

            if lowerFollowerLimit:
                twitterAccount = twitterAccount.filter(
                    followers_count__gte=lowerFollowerLimit
                )

            if searchString:
                twitterAccount = twitterAccount.filter(
                    Q(user_name__icontains=searchString)
                    | Q(name__icontains=searchString)
                )

            if isVerified:
                twitterAccount = twitterAccount.filter(verified=isVerified)

            if collaborationIds:
                twitterAccount = TwitterAccount.objects.filter(
                    user_twitter_account_id__in=collaborationIds
                )

            if categories:
                for category in categories:
                    twitterAccount = twitterAccount.filter(
                        cat_twitter_account_id__category__name=category
                    )

            if languages:
                twitter_accounts_to_exclude = [
                    twitter_account.id
                    for twitter_account in twitterAccount
                    if not User.objects.filter(twitter_account=twitter_account).exists()
                    or not AccountLanguage.objects.filter(
                        user_account__twitter_account=twitter_account,
                        language__langEnglishName__in=languages,
                    ).exists()
                ]

                # Exclude undesired twitter accounts from the queryset
                twitterAccount = twitterAccount.exclude(
                    id__in=twitter_accounts_to_exclude
                )

            if serviceTypes:
                twitter_accounts_to_exclude = [
                    twitter_account.id
                    for twitter_account in twitterAccount
                    if not User.objects.filter(twitter_account=twitter_account).exists()
                    or not Package.objects.filter(
                        influencer__twitter_account=twitter_account
                    ).exists()
                    or not Service.objects.filter(
                        package__influencer__twitter_account=twitter_account,
                        service_master__name__in=serviceTypes,
                    ).exists()
                ]

                # Exclude undesired twitter accounts from the queryset
                twitterAccount = twitterAccount.exclude(
                    id__in=twitter_accounts_to_exclude
                )

            if upperPriceLimit:
                twitter_accounts_to_exclude = [
                    twitter_account.id
                    for twitter_account in twitterAccount
                    if not User.objects.filter(twitter_account=twitter_account).exists()
                    or not Package.objects.filter(
                        influencer__twitter_account=twitter_account
                    ).exists()
                    or not Service.objects.filter(
                        package__influencer__twitter_account=twitter_account,
                        price__lte=upperPriceLimit,
                    ).exists()
                ]

                # Exclude undesired twitter accounts from the queryset
                twitterAccount = twitterAccount.exclude(
                    id__in=twitter_accounts_to_exclude
                )

            if lowerPriceLimit:
                twitter_accounts_to_exclude = [
                    twitter_account.id
                    for twitter_account in twitterAccount
                    if not User.objects.filter(twitter_account=twitter_account).exists()
                    or not Package.objects.filter(
                        influencer__twitter_account=twitter_account
                    ).exists()
                    or not Service.objects.filter(
                        package__influencer__twitter_account=twitter_account,
                        price__gte=lowerPriceLimit,
                    ).exists()
                ]

                # Exclude undesired twitter accounts from the queryset
                twitterAccount = twitterAccount.exclude(
                    id__in=twitter_accounts_to_exclude
                )

            # Paginate the results
            pagination = Pagination(twitterAccount, request)
            serializer = TwitterAccountSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Twitter Account retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=TwitterAccountSerializer)
    def post(self, request):
        try:
            serializer = TwitterAccountSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": TwitterAccountSerializer(serializer.instance).data,
                        "message": "Twitter Account created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


# Retrieve-Update-Destroy API
class TwitterAccountDetail(APIView):
    def get_object(self, pk):
        try:
            return TwitterAccount.objects.get(pk=pk)
        except TwitterAccount.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            twitterAccount = self.get_object(pk)
            if twitterAccount is None:
                return handleNotFound("Twitter Account")
            serializer = TwitterAccountSerializer(twitterAccount)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Twitter Account retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=TwitterAccountSerializer)
    def put(self, request, pk):
        try:
            twitterAccount = self.get_object(pk)
            if twitterAccount is None:
                return handleNotFound("Order")
            serializer = TwitterAccountSerializer(
                instance=twitterAccount, data=request.data
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": TwitterAccountSerializer(serializer.instance).data,
                        "message": "Twitter Account updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    def delete(self, request, pk):
        try:
            twitterAccount = self.get_object(pk)
            if twitterAccount is None:
                return handleNotFound("Twitter Account")
            try:
                twitterAccount.delete()
            except ValidationError as e:
                return handleDeleteNotAllowed("Twitter Account")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "Twitter Account deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


# Category Master API-Endpoint
# List-Create-API
class CategoryMasterList(APIView):
    def get(self, request):
        try:
            categoryMaster = CategoryMaster.objects.all()
            pagination = Pagination(categoryMaster, request)
            serializer = CategoryMasterSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Category Master retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=CategoryMasterSerializer)
    def post(self, request):
        try:
            serializer = CategoryMasterSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": CategoryMasterSerializer(serializer.instance).data,
                        "message": "Category Master created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


# Retrieve-Update-Destroy API
class CategoryMasterDetail(APIView):
    def get_object(self, pk):
        try:
            return CategoryMaster.objects.get(pk=pk)
        except CategoryMaster.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            categoryMaster = self.get_object(pk)
            if categoryMaster is None:
                return handleNotFound("category Master")
            serializer = CategoryMasterSerializer(categoryMaster)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Category Master retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=CategoryMasterSerializer)
    def put(self, request, pk):
        try:
            categoryMaster = self.get_object(pk)
            if categoryMaster is None:
                return handleNotFound("Category Master")
            serializer = CategoryMasterSerializer(
                instance=categoryMaster, data=request.data
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": CategoryMasterSerializer(serializer.instance).data,
                        "message": "Category Master updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    def delete(self, request, pk):
        try:
            categoryMaster = self.get_object(pk)
            if categoryMaster is None:
                return handleNotFound("Category Master")
            try:
                categoryMaster.delete()
            except ValidationError as e:
                return handleDeleteNotAllowed("Category Master")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "Category Master deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


class AccountRegionList(APIView):
    authentication_classes = [JWTAuthentication]

    @swagger_auto_schema(request_body=AccountRegionSerializer)
    def post(self, request):
        try:
            user_id = request.data.get("user_id")
            region_id = request.data.get("region_id")

            # Check if the user already has an AccountRegion
            account_region = AccountRegion.objects.filter(user_account=user_id).first()
            if account_region:
                # If an AccountRegion exists, update the region
                account_region.region_id = region_id
                account_region.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": AccountRegionSerializer(account_region).data,
                        "message": "Account Region updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )

            # Create a new AccountRegion instance
            account_region_data = {"user_account": user_id, "region": region_id}
            serializer = AccountRegionSerializer(data=account_region_data)

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": AccountRegionSerializer(serializer.instance).data,
                        "message": "Account Region created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                print(f"Serializer errors: {serializer.errors}")
                return handleBadRequest(serializer.errors)

        except Exception as e:
            return handleServerException(e)


# Account Category API-Endpoint
# List-Create-API
class AccountCategoryList(APIView):
    def get_object(self, pk):
        try:
            return AccountCategory.objects.get(pk=pk)
        except AccountCategory.DoesNotExist:
            return None

    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            # If no twitter_account_id is provided, try for the logged in user
            twitter_account_id = request.GET.get("twitter_account_id")
            if request.user_account.twitter_account is None:
                return handleBadRequest("Twitter Account is required")
            if twitter_account_id is None:
                twitter_account_id = request.user_account.twitter_account.id
            if twitter_account_id is None:
                return handleBadRequest("Twitter Account ID is required")
            accountCategory = AccountCategory.objects.filter(
                twitter_account_id=twitter_account_id
            )
            pagination = Pagination(accountCategory, request)
            serializer = AccountCategorySerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Account Category retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    authentication_classes = [JWTAuthentication]

    @swagger_auto_schema(request_body=AccountCategorySerializer)
    def post(self, request):
        try:
            serializer = CreateAccountCategorySerializer(
                data=request.data, context={"request": request}
            )

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": AccountCategorySerializer(serializer.instance).data,
                        "message": "Account Category created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    authentication_classes = [JWTAuthentication]

    @swagger_auto_schema(request_body=DeleteAccountCategorySerializer)
    def delete(self, request):
        try:
            serializer = DeleteAccountCategorySerializer(data=request.data)
            if serializer.is_valid():
                account_category_ids = serializer.validated_data["account_category_ids"]
                for account_category_id in account_category_ids:
                    account_category = self.get_object(account_category_id)
                    if account_category is None:
                        return handleBadRequest("Account Category ID is invalid")
                    try:
                        account_category.delete()
                    except ValidationError as e:
                        return handleDeleteNotAllowed("Account Category")
                return Response(
                    {
                        "isSuccess": True,
                        "data": None,
                        "message": "Account Categories deleted successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


# Retrieve-Update-Destroy API
class AccountCategoryDetail(APIView):
    def get_object(self, pk):
        try:
            return AccountCategory.objects.get(pk=pk)
        except AccountCategory.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            accountCategory = self.get_object(pk)
            if accountCategory is None:
                return handleNotFound("Account Category")
            serializer = AccountCategorySerializer(accountCategory)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Account Category retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=AccountCategorySerializer)
    def put(self, request, pk):
        try:
            accountCategory = self.get_object(pk)
            if accountCategory is None:
                return handleNotFound("Account Category")
            serializer = AccountCategorySerializer(
                instance=accountCategory, data=request.data
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": AccountCategorySerializer(serializer.instance).data,
                        "message": "Account Category updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    def delete(self, request, pk):
        try:
            accountCategory = self.get_object(pk)
            if accountCategory is None:
                return handleNotFound("Account Category")
            try:
                accountCategory.delete()
            except ValidationError as e:
                return handleDeleteNotAllowed("Account Category")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "Account Category deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


# User API-Endpoint
# List-Create-API
class UserList(APIView):
    def get(self, request):
        try:
            role = request.query_params.get("role")
            if role is not None:
                users = User.objects.filter(role__name=role)
            else:
                users = User.objects.all()
            pagination = Pagination(users, request)
            serializer = UserSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All User retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=UserCreateSerializer)
    def post(self, request):
        try:
            serializer = UserCreateSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": UserSerializer(serializer.instance).data,
                        "message": "User created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


# Retrieve-Update-Destroy API
class UserDetail(APIView):
    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            user = self.get_object(pk)
            if user is None:
                return handleNotFound("User")
            serializer = UserSerializer(user)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "User retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=UserSerializer)
    def put(self, request, pk):
        try:
            user = self.get_object(pk)
            if user is None:
                return handleNotFound("User")
            serializer = UserSerializer(instance=user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": UserSerializer(serializer.instance).data,
                        "message": "User updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    def delete(self, request, pk):
        try:
            user = self.get_object(pk)
            if user is None:
                return handleNotFound("User")
            try:
                user.delete()
            except ValidationError as e:
                return handleDeleteNotAllowed("User")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "User deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


# BankAccount API-Endpoint
# List-Create-API
class BankAccountList(APIView):
    def get(self, request):
        try:
            bankAccount = BankAccount.objects.all()
            pagination = Pagination(bankAccount, request)
            serializer = BankAccountSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Bank Account retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=BankAccountSerializer)
    def post(self, request):
        try:
            serializer = BankAccountSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": BankAccountSerializer(serializer.instance).data,
                        "message": "Bank Account created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


# Retrieve-Update-Destroy API
class BankAccountDetail(APIView):
    def get_object(self, pk):
        try:
            return BankAccount.objects.get(pk=pk)
        except BankAccount.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            bankAccount = self.get_object(pk)
            if bankAccount is None:
                return handleNotFound("Bank Account")
            serializer = BankAccountSerializer(bankAccount)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Bank Account retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=BankAccountSerializer)
    def put(self, request, pk):
        try:
            bankAccount = self.get_object(pk)
            if bankAccount is None:
                return handleNotFound("Bank Account")
            serializer = BankAccountSerializer(instance=bankAccount, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": BankAccountSerializer(serializer.instance).data,
                        "message": "Bank Account updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    def delete(self, request, pk):
        try:
            bankAccount = self.get_object(pk)
            if bankAccount is None:
                return handleNotFound("Bank Account")
            try:
                bankAccount.delete()
            except ValidationError as e:
                return handleDeleteNotAllowed("Bank Account")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "Bank Account deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


class TwitterAuth(APIView):
    def get_object(self, twitter_id):
        try:
            return TwitterAccount.objects.get(twitter_id=twitter_id)
        except TwitterAccount.DoesNotExist:
            return None

    def get(self, request):
        try:
            twitter_auth_service = TwitterAuthenticationService()
            user_data = twitter_auth_service.get_twitter_client_data(request)
            twitter_account = self.get_object(user_data.id)
            if twitter_account:
                twitter_account.access_token = (
                    twitter_auth_service.get_twitter_access_token(
                        request.build_absolute_uri()
                    )
                )
                twitter_account.save()

            else:
                twitter_account = TwitterAccount.objects.create(
                    twitter_id=user_data.id,
                    name=user_data.name,
                    user_name=user_data.username,
                    access_token=twitter_auth_service.get_twitter_access_token(
                        request.build_absolute_uri()
                    ),
                    description=user_data.description,
                    profile_image_url=user_data.profile_image_url,
                    followers_count=user_data.public_metrics["followers_count"],
                    following_count=user_data.public_metrics["following_count"],
                    tweet_count=user_data.public_metrics["tweet_count"],
                    listed_count=user_data.public_metrics["listed_count"],
                    verified=user_data.verified,
                )
                twitter_account.save()
                role = Role.objects.get(name=request.GET.get("role"))
                new_user_account = User.objects.create(
                    username=user_data.username,
                    first_name=user_data.name,
                    last_name=user_data.name,
                    status="active",
                    role=role,
                    twitter_account=twitter_account,
                )
                new_user_account.save()

            # What would be the best way to set the token and get the user back to the frontend
            # response = HttpResponseRedirect(config('FRONT_END_URL'))
            # jwt_operations = JWTOperations()
            # jwt_operations.setJwtToken(response=response, cookie_name="jwt",
            #                            payload=twitter_auth_service.get_jwt_payload(twitter_account))

            response = HTTPResponse()
            response["Location"] = config("FRONT_END_URL")
            response.status_code = 302
            # response.set_cookie('jwt', JWTOperations().generateJwtToken(
            #     twitter_auth_service.get_jwt_payload(twitter_account)))
            return response
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=TwitterAuthSerializer)
    def post(self, request):
        try:
            serializer = TwitterAuthSerializer(data=request.data)
            if serializer.is_valid():
                twitter_auth_service = TwitterAuthenticationService()
                auth_url = twitter_auth_service.get_twitter_oauth_url()
                return Response(
                    {
                        "isSuccess": True,
                        "data": auth_url,
                        "message": "Twitter Auth URL generated successfully",
                    },
                    status=status.HTTP_200_OK,
                )

            else:
                return handleBadRequest("Invalid Request")
        except Exception as e:
            return handleServerException(e)


class UserAuth(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            user = request.user_account
            serializer = UserSerializer(user)
            if user:
                return Response(
                    {
                        "isSuccess": True,
                        "data": serializer.data,
                        "message": "User retrieved successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "isSuccess": False,
                        "data": None,
                        "message": "User not found",
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            return handleServerException(e)


class OTPAuth(APIView):
    def get_or_create_user(self, email):
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            user = User.objects.create(
                email=email,
                role=Role.objects.get(name="business_owner"),
                username=email,
            )
            user.save()
            return user

    @swagger_auto_schema(request_body=OTPAuthenticationSerializer)
    def post(self, request):
        try:
            serializer = OTPAuthenticationSerializer(data=request.data)

            if serializer.is_valid():
                # If user exists, send OTP
                user = self.get_or_create_user(request.data["email"])
                otp_service = OTPAuthenticationService()
                otp, otp_expiration = otp_service.generateOTP()
                if user:
                    # Only allow a business owner to login
                    if user.role.name != "business_owner":
                        return Response(
                            {
                                "isSuccess": False,
                                "data": None,
                                "message": "Only business owners can login via email",
                                "errors": "Only business owners can login via email",
                            },
                            status=status.HTTP_401_UNAUTHORIZED,
                        )
                    user.otp = otp
                    user.otp_expiration = otp_expiration
                    user.save()

                    email_service = EmailService()
                    email_service.sendEmail(
                        "OTP for login to Xfluencer",
                        f"Your OTP is {otp}",
                        config("EMAIL_HOST_USER"),
                        [request.data["email"]],
                    )

                    return Response(
                        {
                            "isSuccess": True,
                            "data": None,
                            "message": "OTP sent successfully",
                            "otp": otp,
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {
                            "isSuccess": False,
                            "data": None,
                            "message": "User not found",
                        },
                    )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


class OTPVerification(APIView):
    def get_object(self, email):
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            return None

    @swagger_auto_schema(request_body=OTPVerificationSerializer)
    # Login user if OTP is valid
    def post(self, request):
        try:
            serializer = OTPVerificationSerializer(data=request.data)
            if serializer.is_valid():
                user = self.get_object(request.data["email"])
                if user is None:
                    return Response(
                        {
                            "isSuccess": False,
                            "data": None,
                            "message": "User not found",
                        },
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
                otp_service = OTPAuthenticationService()
                is_valid = otp_service.validateOTP(request.data["otp"], user)
                if is_valid:
                    # If user is logging in for the first time, set email_verified_at to current time
                    if user.email_verified_at is None:
                        user.email_verified_at = datetime.datetime.now()
                        user.save()
                    jwt_operations = JWTOperations()
                    user_id = str(user.id)
                    payload = {
                        "id": user_id,
                        "exp": datetime.datetime.utcnow()
                        + datetime.timedelta(seconds=86400),
                        "iat": datetime.datetime.utcnow(),
                    }
                    response = Response()  # Create a new Response instance
                    token = jwt_operations.generateToken(payload)
                    response.set_cookie(
                        "jwt",
                        token,
                        max_age=86400,
                        path="/",
                        secure=True,
                        httponly=True,
                        samesite="None",
                    )
                    response.data = {
                        "isSuccess": True,
                        "data": UserSerializer(user).data,
                        "message": "Logged in successfully",
                    }
                    response.status_code = status.HTTP_200_OK
                    return response
                else:
                    return Response(
                        {
                            "isSuccess": False,
                            "data": None,
                            "message": "OTP is invalid",
                        },
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


class EmailVerification(APIView):
    # A GET request to this endpoint will extract the user id from the JWT and check if the user exists and then send an email to the user
    authentication_classes = [JWTAuthentication]

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None

    def get(self, request):
        try:
            user_account = request.user_account
            user = self.get_object(user_account.id)
            if user:
                if user.email_verified_at:
                    return Response(
                        {
                            "isSuccess": False,
                            "data": None,
                            "message": "Email already verified",
                        },
                        status=status.HTTP_200_OK,
                    )
                otp_service = OTPAuthenticationService()
                otp, otp_expiration = otp_service.generateOTP()
                user.otp = otp
                user.otp_expiration = otp_expiration
                user.save()

                email_service = EmailService()
                email_service.sendEmail(
                    "OTP for email verification",
                    f"Your OTP is {otp}",
                    config("EMAIL_HOST_USER"),
                    [user.email],
                )

                return Response(
                    {
                        "isSuccess": True,
                        "data": None,
                        "message": "Email sent successfully",
                        "otp": otp,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "isSuccess": False,
                        "data": None,
                        "message": "User not found",
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=EmailVerificationSerializer)
    def post(self, request):
        try:
            serializer = EmailVerificationSerializer(data=request.data)
            if serializer.is_valid():
                user_account = request.user_account
                user = self.get_object(user_account.id)
                if user is None:
                    return Response(
                        {
                            "isSuccess": False,
                            "data": None,
                            "message": "User not found",
                        },
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
                otp_service = OTPAuthenticationService()
                is_valid = otp_service.validateOTP(request.data["otp"], user)
                if is_valid:
                    if user.email_verified_at:
                        return Response(
                            {
                                "isSuccess": False,
                                "data": None,
                                "message": "Email already verified",
                            },
                            status=status.HTTP_200_OK,
                        )
                    user.email_verified_at = datetime.datetime.now()
                    user.save()
                    return Response(
                        {
                            "isSuccess": True,
                            "data": None,
                            "message": "Email verified successfully",
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {
                            "isSuccess": False,
                            "data": None,
                            "message": "OTP is invalid",
                        },
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


class WalletAuth(APIView):
    def get_wallet(self, wallet_address_id):
        try:
            return Wallet.objects.get(wallet_address_id=wallet_address_id)
        except Wallet.DoesNotExist:
            return None

    def create_wallet(self, wallet_address_id, wallet_provider, wallet_network):
        try:
            wallet = Wallet.objects.create(
                wallet_address_id=wallet_address_id,
                wallet_provider_id=wallet_provider,
                wallet_network_id=wallet_network,
            )
            wallet.save()
            return wallet
        except Exception as e:
            return None

    def create_user(self, wallet_address_id, role):
        try:
            user = User.objects.create(
                username=truncateWalletAddress(wallet_address_id),
                role=Role.objects.get(name=role),
            )
            user.save()
            return user
        except Exception as e:
            return None

    def get_or_create_wallet_provider(self, name):
        try:
            wallet_provider = WalletProvider.objects.get(wallet_provider=name)
            return wallet_provider
        except WalletProvider.DoesNotExist:
            wallet_provider = WalletProvider.objects.create(wallet_provider=name)
            wallet_provider.save()
            return wallet_provider

    def get_or_create_wallet_network(self, name):
        try:
            return WalletNetwork.objects.get(wallet_network=name)
        except WalletNetwork.DoesNotExist:
            wallet_network = WalletNetwork.objects.create(wallet_network=name)
            wallet_network.save()
            return wallet_network

    @swagger_auto_schema(request_body=WalletAuthSerializer)
    def post(self, request):
        try:
            serializer = WalletAuthSerializer(data=request.data)
            if serializer.is_valid():
                # Should create a wallet if no wallet is found for the requested user else return the wallet
                wallet = self.get_wallet(request.data["wallet_address_id"])
                if wallet is None:
                    wallet_provider = self.get_or_create_wallet_provider(
                        serializer.validated_data["wallet_provider_id"]
                    )
                    wallet_network = self.get_or_create_wallet_network(
                        serializer.validated_data["wallet_network_id"]
                    )
                    wallet = self.create_wallet(
                        serializer.validated_data["wallet_address_id"],
                        wallet_provider,
                        wallet_network,
                    )
                wallet = self.get_wallet(request.data["wallet_address_id"])

                if wallet.user_id is None:
                    user = self.create_user(
                        serializer.validated_data["wallet_address_id"], "business_owner"
                    )
                    wallet.user_id = user
                    wallet.save()
                else:
                    user = User.objects.get(username=wallet.user_id)
                wallet = self.get_wallet(request.data["wallet_address_id"])

                # Mark this wallet as primary
                wallet.is_primary = True
                wallet.save()

                # Mark all other wallets as non-primary
                added_wallets = Wallet.objects.filter(user_id=user)
                for added_wallet in added_wallets:
                    if added_wallet.id != wallet.id:
                        added_wallet.is_primary = False
                        added_wallet.save()

                user = User.objects.get(username=wallet.user_id)
                # Only allow business owners to login
                if user.role.name != "business_owner":
                    return Response(
                        {
                            "isSuccess": False,
                            "data": None,
                            "message": "Only business owners can login via wallet",
                            "errors": "Only business owners can login via wallet",
                        },
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
                jwt_operations = JWTOperations()
                user_id = str(user.id)
                payload = {
                    "id": user_id,
                    "exp": datetime.datetime.utcnow()
                    + datetime.timedelta(seconds=86400),
                    "iat": datetime.datetime.utcnow(),
                }
                response = Response()
                token = jwt_operations.generateToken(payload)
                user.jwt = token
                user.save()
                response.set_cookie(
                    "jwt",
                    token,
                    max_age=86400,
                    path="/",
                    secure=True,
                    httponly=True,
                    samesite="None",
                )
                response.data = {
                    "isSuccess": True,
                    "data": UserSerializer(user).data,
                    "message": "Logged in successfully",
                }
                response.status_code = status.HTTP_200_OK
                return response
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


class WalletConnect(APIView):
    authentication_classes = [JWTAuthentication]

    def get_object(self, wallet_address_id):
        try:
            return Wallet.objects.get(wallet_address_id=wallet_address_id)
        except Wallet.DoesNotExist:
            return None

    @swagger_auto_schema(request_body=WalletConnectSerializer)
    def post(self, request):
        # Only connect the wallet to the user
        try:
            serializer = WalletConnectSerializer(
                data=request.data, context={"request": request}
            )
            if serializer.is_valid():
                wallet = self.get_object(request.data["wallet_address_id"])
                if wallet:
                    return Response(
                        {
                            "isSuccess": False,
                            "data": None,
                            "message": "This wallet is already connected with another account on Xfluencer\n Please use another wallet or login with the account that is connected with this wallet",
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    wallet = serializer.save()
                # Mark the wallet as primary
                wallet.is_primary = True
                wallet.save()

                # Mark all other wallets as non-primary
                added_wallets = Wallet.objects.filter(user_id=request.user_account)
                for added_wallet in added_wallets:
                    if added_wallet.id != wallet.id:
                        added_wallet.is_primary = False
                        added_wallet.save()

                return Response(
                    {
                        "isSuccess": True,
                        "data": None,
                        "message": "Wallet connected successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


class WalletList(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            wallet = Wallet.objects.all()
            wallet = wallet.filter(user_id=request.user_account.id)
            pagination = Pagination(wallet, request)
            serializer = WalletSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Wallet retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


class BusinessAccountMetaDataDetail(APIView):
    def get_object(self, userId):
        try:
            return BusinessAccountMetaData.objects.get(user_account=userId)
        except BusinessAccountMetaData.DoesNotExist:
            return None

    def get(self, request, userId):
        try:
            businessAccountMetaData = self.get_object(userId)
            if businessAccountMetaData is None:
                return handleNotFound("Business Account Meta Data")
            serializer = BusinessAccountMetaDataSerializer(businessAccountMetaData)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Business Meta Data retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=BusinessAccountMetaDataSerializer)
    def put(self, request, userId):
        try:
            businessAccountMetaData = self.get_object(userId)
            if businessAccountMetaData is None:
                return handleNotFound("Business Account Meta Data")
            serializer = BusinessAccountMetaDataSerializer(
                instance=businessAccountMetaData, data=request.data
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": BusinessAccountMetaDataSerializer(
                            serializer.instance
                        ).data,
                        "message": "Business Meta Data updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)
