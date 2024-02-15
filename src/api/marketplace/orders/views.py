from accounts.models import Wallet
from orders.tasks import cancel_tweet, schedule_tweet
from orders.services import create_notification_for_order, create_order_item_tracking, create_order_tracking
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
    OrderMessage,
    Review,
    Transaction,
)
from .serializers import (
    CreateOrderMessageSerializer,
    CreateOrderSerializer,
    OrderListFilterSerializer,
    OrderSerializer,
    OrderItemSerializer,
    OrderAttachmentSerializer,
    OrderMessageSerializer,
    OrderTransactionSerializer,
    SendTweetSerializer,
    ReviewSerializer,
    OrderMessageListFilterSerializer,
    UserOrderMessagesSerializer,
    OrderTransactionCreateSerializer,
    UserOrderMessagesSerializer
)
from rest_framework import status
from django.db.models import Q
from django.utils import timezone


# ORDER API-Endpoint
# List-Create-API
class OrderList(APIView):
    authentication_classes = [JWTAuthentication]

    @swagger_auto_schema(request_body=CreateOrderSerializer)
    def post(self, request):
        try:
            serializer = CreateOrderSerializer(
                data=request.data, context={"request": request}
            )
            if serializer.is_valid():
                draft_orders = Order.objects.filter(
                    buyer=self.request.user_account, status="draft", deleted_at=None
                )
                if draft_orders.exists():
                    # Mark the draft orders as deleted
                    draft_orders.update(deleted_at=timezone.now())
                serializer.save()
                order = serializer.instance
                # Create a Order Transaction for the order
                create_order_tracking(order, "draft")
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
                orders = Order.objects.filter(Q(buyer=user), deleted_at=None).distinct()
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
                        "rejected": rejected,
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
            filter_serializer = OrderListFilterSerializer(data=request.data)
            filter_serializer.is_valid(raise_exception=True)
            filters = filter_serializer.validated_data

            user = request.user_account
            role = request.user_account.role
            if role.name == "business_owner":
                orders = Order.objects.filter(Q(buyer=user), deleted_at=None).distinct()
            elif role.name == "influencer":
                # For all the order items, there will be a package in it and the package willl have influencer id
                order_items = OrderItem.objects.filter(
                    Q(package__influencer=user), deleted_at=None
                ).distinct()
                orders = Order.objects.filter(
                    Q(order_item_order_id__in=order_items), deleted_at=None
                ).distinct()

            if "influencers" in filters:
                orders = orders.filter(
                    order_item_order_id__package__influencer__in=filters["influencers"]
                )

            if "buyers" in filters:
                orders = orders.filter(buyer__in=filters["buyers"])

            if "status" in filters:
                orders = orders.filter(status__in=filters["status"])

            if "service_masters" in filters:
                orders = orders.filter(
                    order_item_order_id__service_master__in=filters["service_masters"]
                )

            if "gt_created_at" in filters:
                gt_created_at = filters["gt_created_at"].date()
                orders = orders.filter(created_at__date__gte=gt_created_at)

            if "lt_created_at" in filters:
                lt_created_at = filters["lt_created_at"].date()
                orders = orders.filter(created_at__date__lte=lt_created_at)

            if "lt_rating" in filters:
                orders = orders.filter(review_order_id__rating__lt=filters["lt_rating"])

            if "gt_rating" in filters:
                orders = orders.filter(review_order_id__rating__gt=filters["gt_rating"])

            if "search" in filters:
                orders = orders.filter(
                    Q(buyer__first_name__icontains=filters["search"])
                    | Q(buyer__last_name__icontains=filters["search"])
                    | Q(
                        order_item_order_id__package__influencer__first_name__icontains=filters[
                            "search"
                        ]
                    )
                    | Q(
                        order_item_order_id__package__influencer__last_name__icontains=filters[
                            "search"
                        ]
                    )
                    | Q(order_code__icontains=filters["search"])
                )

            if "order_by" in filters:
                orders = orders.order_by(filters["order_by"])

            pagination = Pagination(orders, request)
            serializer = OrderSerializer(pagination.getData(), context={
                                         "request": request}, many=True)
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


class UserOrderMessagesView(APIView):
    authentication_classes = [JWTAuthentication]

    @swagger_auto_schema(request_body=OrderMessageListFilterSerializer)
    def post(self, request):
        try:
            # Get the filters from the request
            filter_serializer = OrderMessageListFilterSerializer(data=request.data)
            filter_serializer.is_valid(raise_exception=True)
            filters = filter_serializer.validated_data

            user = request.user_account
            role = request.user_account.role
            if role.name == "business_owner":
                orders = Order.objects.filter(Q(buyer=user), deleted_at=None).distinct()
            elif role.name == "influencer":
                # For all the order items, there will be a package in it and the package willl have influencer id
                order_items = OrderItem.objects.filter(
                    Q(package__influencer=user), deleted_at=None
                ).distinct()
                orders = Order.objects.filter(
                    Q(order_item_order_id__in=order_items), deleted_at=None
                ).distinct()

            if "status" in filters:
                orders = orders.filter(status__in=filters["status"])

            if "service_masters" in filters:
                orders = orders.filter(
                    order_item_order_id__service_master__in=filters["service_masters"]
                )
            if "search" in filters:
                orders = orders.filter(
                    Q(buyer__first_name__icontains=filters["search"])
                    | Q(buyer__last_name__icontains=filters["search"])
                    | Q(
                        order_item_order_id__package__influencer__first_name__icontains=filters[
                            "search"
                        ]
                    )
                    | Q(
                        order_item_order_id__package__influencer__last_name__icontains=filters[
                            "search"
                        ]
                    )
                    | Q(order_code__icontains=filters["search"])
                )
            total_unread_count = 0
            data = []
            for order in orders:
                order_messages = OrderMessage.objects.filter(order_id=order)
                if order_messages.exists():
                    last_message = order_messages.last()
                    unread_count = order_messages.filter(
                        status="sent", receiver_id=request.user_account
                    ).count()
                    total_unread_count += unread_count
                    message_data = {
                        "message": last_message,
                        "order_unread_messages_count": unread_count,
                        "created_at": last_message.created_at,  # Store the timestamp
                    }
                else:
                    message_data = {
                        "message": {},
                        "order_unread_messages_count": 0,
                        "created_at": None,  # No timestamp for orders without messages
                    }
                data.append({"order": order, "order_message": message_data})
            # The data should be sorted by the created_at field of the last message
            data.sort(
                key=lambda x: x["order_message"]["created_at"] or x["order"].created_at,
                reverse=True,
            )
            serializer = UserOrderMessagesSerializer(
                {"orders": data, "total_unread_messages_count": total_unread_count}
            )
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Order Messages retrieved successfully",
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
            # Check that the order belongs to the user
            # Two cases:
            # 1. User is a business owner and the order belongs to the user i.e. buyer
            # 2. User is an influencer and the order belongs to the user i.e. influencer in the package
            if (
                request.user_account.role.name == "business_owner"
                and order.buyer.id != request.user_account.id
            ) or (
                request.user_account.role.name == "influencer"
                and order.order_item_order_id.all()[0].package.influencer.id
                != request.user_account.id
            ):
                return Response(
                    {
                        "isSuccess": False,
                        "message": "You are not authorized to view this order",
                        "data": None,
                        "errors": "You are not authorized to view this order",
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
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

            if (
                request.user_account.role.name == "business_owner"
                and order.status != "draft"
                and order.status != "pending"
            ):
                return Response(
                    {
                        "isSuccess": False,
                        "message": "Business cannot update order as payment has been made",
                        "data": None,
                        "errors": "Business cannot update order as payment has been made",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            if (
                request.user_account.role.name == "influencer"
                and order.status != "accepted"
            ):
                return Response(
                    {
                        "isSuccess": False,
                        "message": "Influencer cannot update order if it's not in accepted state",
                        "data": None,
                        "errors": "Influencer cannot update order if it's not in accepted state",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            serializer = CreateOrderSerializer(
                instance=order, data=request.data, context={"request": request}
            )

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
                # Create a order transaction for the order
                create_order_tracking(order, "deleted")
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


class UpdateOrderStatus(APIView):
    authentication_classes = [JWTAuthentication]

    def get_object(self, pk):
        try:
            return Order.objects.get(pk=pk, deleted_at=None)
        except Order.DoesNotExist:
            return None

    @swagger_auto_schema(request_body=OrderSerializer)
    def put(self, request, pk):
        try:
            order = self.get_object(pk)
            if order is None:
                return handleNotFound("Order")

            # Extract only the 'status' field from the request data
            status_data = {"status": request.data.get("status")}

            serializer = OrderSerializer(instance=order, data=status_data, partial=True)

            if serializer.is_valid():
                old_status = order.status
                if status_data["status"] == "pending":
                    if request.data.get("address"):
                        # Create a transaction for the order
                        Transaction.objects.create(
                            order=order,
                            transaction_address=request.data.get("address"),
                            status="success",
                            transaction_initiated_by=request.user_account,
                            wallet=Wallet.objects.get(
                                user_id=request.user_account, is_primary=True),
                            transaction_type="initiate_escrow"
                        )
                    else:
                        return Response(
                            {
                                "isSuccess": False,
                                "message": "Please complete the payment details",
                                "data": None,
                                "errors": "Please complete the payment details",
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                serializer.save()

                # Update status for all related OrderItems
                order_items = OrderItem.objects.filter(order_id=order.id)
                for order_item in order_items:
                    # Here we are considering that while calling the update-order-status, we change the order status to
                    # accepted and rejected only, and corresponding to that we changing the same for each order item.
                    order_item.status = status_data["status"]
                    order_item.save()

                    create_order_item_tracking(order_item, order_item.status)

                create_notification_for_order(order, old_status, status_data["status"])
                create_order_tracking(order, status_data["status"])
                return Response(
                    {
                        "isSuccess": True,
                        "data": OrderSerializer(serializer.instance).data,
                        "message": "Order status updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


class TransactionCreateView(APIView):
    authentication_classes = [JWTAuthentication]

    @swagger_auto_schema(request_body=OrderTransactionCreateSerializer)
    def post(self, request):
        try:
            serializer = OrderTransactionCreateSerializer(
                data=request.data, context={"request": request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": OrderTransactionSerializer(serializer.instance).data,
                        "message": "Transaction added successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
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


# Get Order Messages
class OrderMessageList(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
            if order is None:
                return handleNotFound("Order")
            # Check that the order belongs to the user
            # Two cases:
            # 1. User is a business owner and the order belongs to the user i.e. buyer
            # 2. User is an influencer and the order belongs to the user i.e. influencer in the package
            if (
                request.user_account.role.name == "business_owner"
                and order.buyer.id != request.user_account.id
            ) or (
                request.user_account.role.name == "influencer"
                and order.order_item_order_id.all()[0].package.influencer.id
                != request.user_account.id
            ):
                return Response(
                    {
                        "isSuccess": False,
                        "message": "You are not authorized to view this order chat",
                        "data": None,
                        "errors": "You are not authorized to view this order chat",
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
            orderMessages = order.order_message_order_id.all().order_by("-created_at")
            pagination = Pagination(orderMessages, request)
            serializer = OrderMessageSerializer(pagination.getData(), many=True)
            return Response(
                {
                    "isSuccess": True,
                    "data": serializer.data,
                    "message": "All Order Messages retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
            # Update the status of the order message to read for the messages that bolong to the user in the order
            if order is None:
                return handleNotFound("Order")
            # Check that the order belongs to the user
            # Two cases:
            # 1. User is a business owner and the order belongs to the user i.e. buyer
            # 2. User is an influencer and the order belongs to the user i.e. influencer in the package
            if (
                request.user_account.role.name == "business_owner"
                and order.buyer.id != request.user_account.id
            ) or (
                request.user_account.role.name == "influencer"
                and order.order_item_order_id.all()[0].package.influencer.id
                != request.user_account.id
            ):
                return Response(
                    {
                        "isSuccess": False,
                        "message": "You are not authorized to view this order chat",
                        "data": None,
                        "errors": "You are not authorized to view this order chat",
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
            orderMessages = order.order_message_order_id.filter(
                receiver_id=request.user_account, status="sent"
            )
            orderMessages.update(status="read")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "Order Messages marked as read successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


# List-Create-API


class OrderMessageCreateView(APIView):
    authentication_classes = [JWTAuthentication]

    @swagger_auto_schema(request_body=CreateOrderMessageSerializer)
    def post(self, request):
        try:
            serializer = CreateOrderMessageSerializer(
                data=request.data, context={"request": request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": OrderMessageSerializer(serializer.instance).data,
                        "message": "Message sent successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
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


class SendTweetView(APIView):
    @swagger_auto_schema(request_body=SendTweetSerializer)
    def post(self, request):
        try:
            serializer = SendTweetSerializer(data=request.data)
            if serializer.is_valid():
                # Get the order_item_id
                order_item_id = serializer.validated_data["order_item_id"]

                # Schedule the tweet
                schedule_tweet(order_item_id)

                return Response(
                    {
                        "isSuccess": True,
                        "data": serializer.data,
                        "message": "Tweet is scheduled",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


class CancelTweetView(APIView):
    @swagger_auto_schema(request_body=SendTweetSerializer)
    def post(self, request):
        try:
            serializer = SendTweetSerializer(data=request.data)
            if serializer.is_valid():
                # Get the order_item_id
                order_item_id = serializer.validated_data["order_item_id"]

                # Schedule the tweet
                cancel_tweet(order_item_id)

                return Response(
                    {
                        "isSuccess": True,
                        "data": serializer.data,
                        "message": "Tweet is cancelled",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)
