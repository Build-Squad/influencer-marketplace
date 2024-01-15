from accounts.models import Wallet
from marketplace.authentication import JWTAuthentication
from marketplace.services import (
    Pagination,
    handleServerException,
    handleBadRequest,
    handleNotFound,
    handleDeleteNotAllowed,
)
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from .models import (
    Order,
    OrderItem,
    OrderAttachment,
    OrderItemTracking,
    OrderMessage,
    OrderMessageAttachment,
    Transaction,
    Review,
)
from .serializers import (
    CreateOrderSerializer,
    OrderListFilterSerializer,
    OrderSerializer,
    OrderItemSerializer,
    OrderAttachmentSerializer,
    OrderItemTrackingSerializer,
    OrderMessageSerializer,
    OrderMessageAttachmentSerializer,
    TransactionSerializer,
    ReviewSerializer,
)
from rest_framework import status
from django.db.models import Q



# ORDER API-Endpoint
# List-Create-API
class OrderList(APIView):
    authentication_classes = [JWTAuthentication]

    @swagger_auto_schema(request_body=CreateOrderSerializer)
    def post(self, request):
        try:
            serializer = CreateOrderSerializer(
                data=request.data, context={'request': request})
            if serializer.is_valid():
                draft_order = Order.objects.filter(
                    buyer=self.request.user_account, status='draft', deleted_at=None)
                if draft_order.exists():
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "You already have an active draft order. Please complete that order first.",
                            "data": None,
                            "errors": "You already have an active draft order. Please complete that order first.",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": OrderSerializer(serializer.instance).data,
                        "message": "Order created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


class OrderListView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        # Get the role of the user and get the orders of the users.
        # Return the count based on the status of the orders
        # Response will be like
        try:
            user = request.user_account
            role = request.user_account.role
            if role.name == "business_owner":
                orders = Order.objects.filter(
                    Q(buyer=user), deleted_at=None
                ).distinct()
            elif role.name == "influencer":
                # For all the order items, there will be a package in it and the package willl have influencer id
                order_items = OrderItem.objects.filter(
                    Q(package__influencer=user), deleted_at=None
                ).distinct()
                orders = Order.objects.filter(
                    Q(order_item_order_id__in=order_items), deleted_at=None
                ).distinct()

            accepted = orders.filter(status="accepted").count()
            pending = orders.filter(status="pending").count()
            completed = orders.filter(status="completed").count()
            rejected = orders.filter(status="rejected").count()

            return Response(
                {
                    "isSuccess": True,
                    "data": {
                        "accepted": accepted,
                        "pending": pending,
                        "completed": completed,
                        "rejected": rejected
                    },
                    "message": "All Order Count retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=OrderListFilterSerializer)
    def post(self, request):
        try:
            # Get the filters from the request
            filter_serializer = OrderListFilterSerializer(
                data=request.data)
            filter_serializer.is_valid(raise_exception=True)
            filters = filter_serializer.validated_data

            user = request.user_account
            role = request.user_account.role
            if role.name == "business_owner":
                orders = Order.objects.filter(
                    Q(buyer=user), deleted_at=None
                ).distinct()
            elif role.name == "influencer":
                # For all the order items, there will be a package in it and the package willl have influencer id
                order_items = OrderItem.objects.filter(
                    Q(package__influencer=user), deleted_at=None
                ).distinct()
                orders = Order.objects.filter(
                    Q(order_item_order_id__in=order_items), deleted_at=None
                ).distinct()

            if 'influencers' in filters:
                orders = orders.filter(
                    order_item_order_id__package__influencer__in=filters['influencers'])

            if 'buyers' in filters:
                orders = orders.filter(buyer__in=filters['buyers'])

            if 'status' in filters:
                orders = orders.filter(status__in=filters['status'])

            if 'service_masters' in filters:
                orders = orders.filter(
                    order_item_order_id__service_master__in=filters['service_masters'])

            if 'lt_created_at' in filters:
                orders = orders.filter(created_at__lt=filters['lt_created_at'])

            if 'gt_created_at' in filters:
                orders = orders.filter(created_at__gt=filters['gt_created_at'])

            if 'lt_rating' in filters:
                orders = orders.filter(
                    review_order_id__rating__lt=filters['lt_rating'])

            if 'gt_rating' in filters:
                orders = orders.filter(
                    review_order_id__rating__gt=filters['gt_rating'])

            if 'order_by' in filters:
                orders = orders.order_by(filters['order_by'])

            pagination = Pagination(orders, request)
            serializer = OrderSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Order retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

# Retrieve-Update-Destroy API
class OrderDetail(APIView):
    authentication_classes = [JWTAuthentication]
    def get_object(self, pk):
        try:
            return Order.objects.get(pk=pk, deleted_at=None)
        except Order.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            order = self.get_object(pk)
            if order is None:
                return handleNotFound("order")
            serializer = OrderSerializer(order)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "order retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=CreateOrderSerializer)
    def put(self, request, pk):
        try:
            order = self.get_object(pk)
            if order is None:
                return handleNotFound("Order")

            if order.status != 'draft' and order.status != 'pending':
                return Response(
                    {
                        "isSuccess": False,
                        "message": "Order defails cannot be updated as payment has been made",
                        "data": None,
                        "errors": "Order defails cannot be updated as payment has been made",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            serializer = CreateOrderSerializer(
                instance=order, data=request.data, context={'request': request})

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": OrderSerializer(serializer.instance).data,
                        "message": "Order updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    def delete(self, request, pk):
        try:
            order = self.get_object(pk)
            if order is None:
                return handleNotFound("Order")
            try:
                order.delete()
            except ValidationError as e:
                return handleDeleteNotAllowed("Order")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "Order deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


# ORDER-Item API-Endpoint
# List-Create-API
class OrderItemList(APIView):
    def get(self, request):
        try:
            orderItems = OrderItem.objects.all()
            pagination = Pagination(orderItems, request)
            serializer = OrderItemSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Order Items retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=OrderItemSerializer)
    def post(self, request):
        try:
            serializer = OrderItemSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": OrderItemSerializer(serializer.instance).data,
                        "message": "Order Item created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


# Retrieve-Update-Destroy API
class OrderItemDetail(APIView):
    def get_object(self, pk):
        try:
            return OrderItem.objects.get(pk=pk)
        except OrderItem.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            orderItem = self.get_object(pk)
            if orderItem is None:
                return handleNotFound("Order Item")
            serializer = OrderItemSerializer(orderItem)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Order Item retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=OrderItemSerializer)
    def put(self, request, pk):
        try:
            orderItem = self.get_object(pk)
            if orderItem is None:
                return handleNotFound("Order")
            serializer = OrderItemSerializer(instance=orderItem, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": OrderItemSerializer(serializer.instance).data,
                        "message": "Order Item updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    authentication_classes = [JWTAuthentication]
    def delete(self, request, pk):
        try:
            orderItem = self.get_object(pk)
            if orderItem is None:
                return handleNotFound("Order Item")
            try:
                orderItem.delete()
            except ValidationError as e:
                return handleDeleteNotAllowed("Order Item")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "Order Item deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


# ORDER-Attachment API-Endpoint
# List-Create-API
class OrderAttachmentList(APIView):
    def get(self, request):
        try:
            orderAttachment = OrderAttachment.objects.all()
            pagination = Pagination(orderAttachment, request)
            serializer = OrderAttachmentSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Order Attachments retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=OrderAttachmentSerializer)
    def post(self, request):
        try:
            serializer = OrderAttachmentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": OrderAttachmentSerializer(serializer.instance).data,
                        "message": "Order Attachment created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


# Retrieve-Update-Destroy API
class OrderAttachmentDetail(APIView):
    def get_object(self, pk):
        try:
            return OrderAttachment.objects.get(pk=pk)
        except OrderAttachment.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            orderAttachment = self.get_object(pk)
            if orderAttachment is None:
                return handleNotFound("Order Attachment")
            serializer = OrderAttachmentSerializer(orderAttachment)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Order Attachment retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=OrderAttachmentSerializer)
    def put(self, request, pk):
        try:
            orderAttachment = self.get_object(pk)
            if orderAttachment is None:
                return handleNotFound("Order Attachment")
            serializer = OrderAttachmentSerializer(
                instance=orderAttachment, data=request.data
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": OrderAttachmentSerializer(serializer.instance).data,
                        "message": "Order Attachment updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    def delete(self, request, pk):
        try:
            orderAttachment = self.get_object(pk)
            if orderAttachment is None:
                return handleNotFound("Order Attachment")
            try:
                orderAttachment.delete()
            except ValidationError as e:
                return handleDeleteNotAllowed("Order Attachment")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "Order Attachment deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


# ORDER-Item-Tracking API-Endpoint
# List-Create-API
class OrderItemTrackingList(APIView):
    def get(self, request):
        try:
            orderItemTracking = OrderItemTracking.objects.all()
            pagination = Pagination(orderItemTracking, request)
            serializer = OrderItemTrackingSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Order Item Tracking data retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=OrderItemTrackingSerializer)
    def post(self, request):
        try:
            serializer = OrderItemTrackingSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": OrderItemTrackingSerializer(serializer.instance).data,
                        "message": "Order Item Tracking data created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


# Retrieve-Update-Destroy API
class OrderItemTrackingDetail(APIView):
    def get_object(self, pk):
        try:
            return OrderItemTracking.objects.get(pk=pk)
        except OrderItemTracking.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            orderItemTracking = self.get_object(pk)
            if orderItemTracking is None:
                return handleNotFound("Order Item Tracking")
            serializer = OrderItemTrackingSerializer(orderItemTracking)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Order Item Tracking data retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=OrderItemTrackingSerializer)
    def put(self, request, pk):
        try:
            orderItemTracking = self.get_object(pk)
            if orderItemTracking is None:
                return handleNotFound("Order Item Tracking")
            serializer = OrderItemTrackingSerializer(
                instance=orderItemTracking, data=request.data
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": OrderItemTrackingSerializer(serializer.instance).data,
                        "message": "Order Item Tracking data updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    def delete(self, request, pk):
        try:
            orderItemTracking = self.get_object(pk)
            if orderItemTracking is None:
                return handleNotFound("Order Item Tracking")
            try:
                orderItemTracking.delete()
            except ValidationError as e:
                return handleDeleteNotAllowed("Order Item Tracking")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "Order Item Tracking deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


# ORDER-Message API-Endpoint
# List-Create-API
class OrderMessageList(APIView):
    def get(self, request):
        try:
            orderMessage = OrderMessage.objects.all()
            pagination = Pagination(orderMessage, request)
            serializer = OrderMessageSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Order Message data retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=OrderMessageSerializer)
    def post(self, request):
        try:
            serializer = OrderMessageSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": OrderMessageSerializer(serializer.instance).data,
                        "message": "Order Message data created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


# Retrieve-Update-Destroy API
class OrderMessageDetail(APIView):
    def get_object(self, pk):
        try:
            return OrderMessage.objects.get(pk=pk)
        except OrderMessage.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            orderMessage = self.get_object(pk)
            if orderMessage is None:
                return handleNotFound("Order Message")
            serializer = OrderMessageSerializer(orderMessage)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Order Message data retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=OrderMessageSerializer)
    def put(self, request, pk):
        try:
            orderMessage = self.get_object(pk)
            if orderMessage is None:
                return handleNotFound("Order Message")
            serializer = OrderMessageSerializer(
                instance=orderMessage, data=request.data
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": OrderMessageSerializer(serializer.instance).data,
                        "message": "Order Message data updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    def delete(self, request, pk):
        try:
            orderMessage = self.get_object(pk)
            if orderMessage is None:
                return handleNotFound("Order Message")
            try:
                orderMessage.delete()
            except ValidationError as e:
                return handleDeleteNotAllowed("Order Message")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "Order Message deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


# ORDER-Message Attachment API-Endpoint
# List-Create-API
class OrderMessageAttachmentList(APIView):
    def get(self, request):
        try:
            orderMessageAttachment = OrderMessageAttachment.objects.all()
            pagination = Pagination(orderMessageAttachment, request)
            serializer = OrderMessageAttachmentSerializer(
                pagination.getData(), many=True
            )
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Order Message Attachment data retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=OrderMessageAttachmentSerializer)
    def post(self, request):
        try:
            serializer = OrderMessageAttachmentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": OrderMessageAttachmentSerializer(
                            serializer.instance
                        ).data,
                        "message": "Order Message Attachment data created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


# Retrieve-Update-Destroy API
class OrderMessageAttachmentDetail(APIView):
    def get_object(self, pk):
        try:
            return OrderMessageAttachment.objects.get(pk=pk)
        except OrderMessageAttachment.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            orderMessageAttachment = self.get_object(pk)
            if orderMessageAttachment is None:
                return handleNotFound("Order Message Attachment")
            serializer = OrderMessageSerializer(orderMessageAttachment)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Order Message Attachment data retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)
    
    @swagger_auto_schema(request_body=OrderMessageAttachmentSerializer)
    def put(self, request, pk):
        try:
            orderMessageAttachment = self.get_object(pk)
            if orderMessageAttachment is None:
                return handleNotFound("Order Message Attachment")
            serializer = OrderMessageAttachmentSerializer(
                instance=orderMessageAttachment, data=request.data
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": OrderMessageAttachmentSerializer(
                            serializer.instance
                        ).data,
                        "message": "Order Message Attachment data updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    def delete(self, request, pk):
        try:
            orderMessageAttachment = self.get_object(pk)
            if orderMessageAttachment is None:
                return handleNotFound("Order Message Attachment")
            try:
                orderMessageAttachment.delete()
            except ValidationError as e:
                return handleDeleteNotAllowed("Order Message Attachment")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "Order Message Attachment deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


# Transaction API-Endpoint
# List-Create-API
class TransactionList(APIView):
    def get(self, request):
        try:
            transaction = Transaction.objects.all()
            pagination = Pagination(transaction, request)
            serializer = TransactionSerializer(
                pagination.getData(), many=True
            )
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Transaction data retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=TransactionSerializer)
    def post(self, request):
        try:
            serializer = TransactionSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": TransactionSerializer(
                            serializer.instance
                        ).data,
                        "message": "Transaction data created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


# Retrieve-Update-Destroy API
class TransactionDetail(APIView):
    def get_object(self, pk):
        try:
            return Transaction.objects.get(pk=pk)
        except Transaction.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            transaction = self.get_object(pk)
            if transaction is None:
                return handleNotFound("transaction")
            serializer = TransactionSerializer(transaction)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Transaction data retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=TransactionSerializer)
    def put(self, request, pk):
        try:
            transaction = self.get_object(pk)
            if transaction is None:
                return handleNotFound("transaction")
            serializer = TransactionSerializer(instance=transaction, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": TransactionSerializer(serializer.instance).data,
                        "message": "Transaction data updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    def delete(self, request, pk):
        try:
            transaction = self.get_object(pk)
            if transaction is None:
                return handleNotFound("transaction")
            try:
                transaction.delete()
            except ValidationError as e:
                return handleDeleteNotAllowed("transaction")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "transaction deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


# Review API-Endpoint
# List-Create-API
class ReviewList(APIView):
    def get(self, request):
        try:
            review = Review.objects.all()
            pagination = Pagination(review, request)
            serializer = ReviewSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Review retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=ReviewSerializer)
    def post(self, request):
        try:
            serializer = ReviewSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": ReviewSerializer(serializer.instance).data,
                        "message": "Review data created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


# Retrieve-Update-Destroy API
class ReviewDetail(APIView):
    def get_object(self, pk):
        try:
            return Review.objects.get(pk=pk)
        except Review.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            review = self.get_object(pk)
            if review is None:
                return handleNotFound("review")
            serializer = ReviewSerializer(review)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "Review data retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    @swagger_auto_schema(request_body=ReviewSerializer)
    def put(self, request, pk):
        try:
            review = self.get_object(pk)
            if review is None:
                return handleNotFound("review")
            serializer = ReviewSerializer(instance=review, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": ReviewSerializer(serializer.instance).data,
                        "message": "Review data updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    def delete(self, request, pk):
        try:
            review = self.get_object(pk)
            if review is None:
                return handleNotFound("review")
            try:
                review.delete()
            except ValidationError as e:
                return handleDeleteNotAllowed("review")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "review deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)
