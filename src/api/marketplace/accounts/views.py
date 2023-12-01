from marketplace.services import (
    Pagination,
    handleServerException,
    handleBadRequest,
    handleNotFound,
    handleDeleteNotAllowed,
)
from drf_yasg.utils import swagger_auto_schema
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TwitterAccount, CategoryMaster, AccountCategory, User, BankAccount
from .serializers import (
    TwitterAccountSerializer,
    CategoryMasterSerializer,
    AccountCategorySerializer,
    UserSerializer,
    BankAccountSerializer,
)


# Twitter account API-Endpoint
# List-Create-API
class TwitterAccountList(APIView):
    def get(self, request):
        try:
            twitterAccount = TwitterAccount.objects.all()
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


# Account Category API-Endpoint
# List-Create-API
class AccountCategoryList(APIView):
    def get(self, request):
        try:
            accountCategory = AccountCategory.objects.all()
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

    @swagger_auto_schema(request_body=AccountCategorySerializer)
    def post(self, request):
        try:
            serializer = AccountCategorySerializer(data=request.data)
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
            user = User.objects.all()
            pagination = Pagination(user, request)
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

    @swagger_auto_schema(request_body=UserSerializer)
    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
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
