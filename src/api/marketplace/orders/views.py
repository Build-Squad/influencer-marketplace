from accounts.models import Wallet
from orders.tasks import cancel_escrow, cancel_tweet, check_order_status, schedule_tweet
from orders.services import create_manual_verification_notification, create_notification_for_order, create_order_item_approval_notification, create_order_item_tracking, create_order_tracking, validate_order_item_meta_data
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
    Escrow,
    OnChainTransaction,
    Order,
    OrderItem,
    OrderAttachment,
    OrderItemMetric,
    OrderMessage,
    Review,
    Transaction,
)
from .serializers import (
    ApproveOrderItemSerializer,
    CreateOrderMessageSerializer,
    CreateOrderSerializer,
    ManualVerifyOrderItemSerializer,
    OrderItemListFilterSerializer,
    OrderItemMetricSerializer,
    OrderItemReadSerializer,
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
    UserOrderMessagesSerializer,
    OrderItemMetricFilterSerializer
)
from rest_framework import status
from django.db.models import Q
from django.utils import timezone
from django.db.models import F, ExpressionWrapper, DateTimeField, Case, When, BooleanField
from django.db.models.functions import Now
from django.db.models import Min





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
            cancelled = orders.filter(status="cancelled").count()

            return Response(
                {
                    "isSuccess": True,
                    "data": {
                        "accepted": accepted,
                        "pending": pending,
                        "completed": completed,
                        "rejected": rejected,
                        "cancelled": cancelled,
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

            if "order_by" in filters and filters["order_by"] == "upcoming":
                # Order by the publish date of the order items
                # Should sort the publish_date closest to the current date first wrt the order
                orders = orders.annotate(
                    min_publish_date=Min('order_item_order_id__publish_date'),
                    time_difference=ExpressionWrapper(
                        F('min_publish_date') - Now(), output_field=DateTimeField()
                    ),
                    is_future=Case(
                        When(min_publish_date__gte=Now(), then=True),
                        default=False,
                        output_field=BooleanField(),
                    )
                ).order_by(
                    '-is_future',
                    Case(
                        When(is_future=True, then=F('time_difference')),
                        When(is_future=False, then=F('time_difference') * -1),
                        output_field=DateTimeField(),
                    )
                )
            elif "order_by" in filters:
                orders = orders.order_by(filters["order_by"])

            status_counts = {
                "accepted": orders.filter(status="accepted").count(),
                "pending": orders.filter(status="pending").count(),
                "completed": orders.filter(status="completed").count(),
                "rejected": orders.filter(status="rejected").count(),
                "cancelled": orders.filter(status="cancelled").count(),
            }

            if "status" in filters:
                orders = orders.filter(status__in=filters["status"])

            pagination = Pagination(orders, request)
            serializer = OrderSerializer(pagination.getData(), context={
                                         "request": request}, many=True)
            combined_data = {
                "orders": serializer.data,
                "status_counts": status_counts,
            }
            return Response(
                {
                    "isSuccess": True,
                    "data": combined_data,
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

    def create_escrow(self, order, inlfuencer_id, business_id):
        influencer_wallet = Wallet.objects.get(
            user_id=inlfuencer_id, is_primary=True)
        business_wallet = Wallet.objects.get(
            user_id=business_id, is_primary=True)
        Escrow.objects.create(
            order=order,
            business_wallet=business_wallet,
            influencer_wallet=influencer_wallet,
        )

    def create_transaction(self, order, address, status, user, transaction_type):
        Transaction.objects.create(
            order=order,
            transaction_address=address,
            status=status,
            transaction_initiated_by=self.request.user_account,
            wallet=Wallet.objects.get(
                user_id=user, is_primary=True),
            transaction_type=transaction_type
        )

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
                        # Create an Escrow Object
                        self.create_escrow(order, order.order_item_order_id.all()[
                                           0].package.influencer.id, order.buyer.id)
                        # Create a transaction for the order
                        self.create_transaction(
                            order, request.data.get("address"), "success", request.user_account, "initiate_escrow")
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


class ApproveOrderItemView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_object(self, pk):
        try:
            return OrderItem.objects.get(pk=pk, deleted_at=None)
        except OrderItem.DoesNotExist:
            return None

    @swagger_auto_schema(request_body=ApproveOrderItemSerializer)
    def put(self, request, pk):
        try:
            order_item = self.get_object(pk)
            if order_item is None:
                return handleNotFound("Order Item")

            # Check that the logged in user is the buyer of the order
            if request.user_account.role.name != "business_owner" or order_item.order_id.buyer.id != request.user_account.id:
                return Response(
                    {
                        "isSuccess": False,
                        "message": "You are not authorized to approve this order item",
                        "data": None,
                        "errors": "You are not authorized to approve this order item",
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Also check that the order_item is in accepted or cancelled state
            if order_item.status not in ["accepted", "cancelled"]:
                return Response(
                    {
                        "isSuccess": False,
                        "message": "Order item is already " + order_item.status,
                        "data": None,
                        "errors": "Order item is already " + order_item.status,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get the data from serializer
            serializer = ApproveOrderItemSerializer(
                instance=order_item, data=request.data, partial=True
            )
            if serializer.is_valid():
                approved = serializer.validated_data.get("approved")
                order_item.approved = approved
                order_item.save()
                
                create_order_item_approval_notification(order_item)

            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "Order Item updated successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)

class CancelOrderView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_escrow(self, order):
        escrow = Escrow.objects.get(order=order)
        if escrow is None:
            return handleNotFound("Escrow")
        return escrow

    def create_on_chain_transaction(self, order):
        # Get the escrow
        escrow = self.get_escrow(order=order)
        # Create an on chain transaction
        OnChainTransaction.objects.create(
            escrow=escrow,
            transaction_type="cancel_escrow",
        )

    def get_object(self, pk):
        try:
            return Order.objects.get(pk=pk, deleted_at=None)
        except Order.DoesNotExist:
            return None

    def put(self, request, pk):
        try:
            order = self.get_object(pk)
            if order is None:
                return handleNotFound("Order")
            # Get all order items
            order_items = OrderItem.objects.filter(order_id=order.id)

            # Check that the logged in user is authorized to cancel the order
            if request.user_account.role.name == "business_owner":
                if order.buyer.id != request.user_account.id:
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "You are not authorized to cancel this order",
                            "data": None,
                            "errors": "You are not authorized to cancel this order",
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
            elif request.user_account.role.name == "influencer":
                if order_items[0].package.influencer.id != request.user_account.id:
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "You are not authorized to cancel this order",
                            "data": None,
                            "errors": "You are not authorized to cancel this order",
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )

            # if influencer is cancelling the order, then check if the order is in pending state
            if request.user_account.role.name == "influencer":
                if order.status != "pending":
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "Order is already " + order.status,
                            "data": None,
                            "errors": "Order is already " + order.status,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            # if business owner is cancelling the order, then check if the order is in accepted or pending state
            if request.user_account.role.name == "business_owner":
                if order.status not in ["accepted", "pending"]:
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "Order is already " + order.status,
                            "data": None,
                            "errors": "Order is already " + order.status,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            # If any order item is published or scheduled, then the order cannot be cancelled
            for order_item in order_items:
                if order_item.status in ["published", "scheduled"]:
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "Order cannot be cancelled as it has already been published or scheduled",
                            "data": None,
                            "errors": "Order cannot be cancelled as it has already been published or scheduled",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            order_status = "cancelled" if request.user_account.id == order.buyer.id else "rejected"
            # See if an on chain transaction is already created
            escrow = self.get_escrow(order)
            on_chain_transaction = OnChainTransaction.objects.filter(
                escrow=escrow, transaction_type="cancel_escrow"
            ).first()
            if on_chain_transaction:
                if on_chain_transaction.is_confirmed:
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "Order has already been cancelled",
                            "data": None,
                            "errors": "Order has already been cancelled",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                else:
                    if not on_chain_transaction.err:
                        action = "cancellation" if request.user_account.id == order.buyer.id else "rejection"
                        return Response(
                            {
                                "isSuccess": False,
                                "message": "Order " + action + " is in progress, please wait",
                                "data": None,
                                "errors": "Order " + action + " is in progress, please wait",
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    else:
                        return Response(
                            {
                                "isSuccess": False,
                                "message": "Order cancellation failed",
                                "data": None,
                                "errors": "Order cancellation failed",
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )
            # Create an on chain transaction
            else:
                self.create_on_chain_transaction(order)
            res = cancel_escrow(pk, order_status)
            if res: 
                # Cancel all order items
                order_items.update(status=order_status)
                return Response(
                    {
                        "isSuccess": True,
                        "data": None,
                        "message": "Order cancelled successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "isSuccess": False,
                        "message": "Order cancellation failed",
                        "data": None,
                        "errors": "Order cancellation failed",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
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
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        try:
            orderItems = OrderItem.objects.all()
            pagination = Pagination(orderItems, request)
            serializer = OrderItemReadSerializer(
                pagination.getData(), many=True)
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

    @swagger_auto_schema(request_body=OrderItemListFilterSerializer)
    def post(self, request):
        try:
            filter_serializer = OrderItemListFilterSerializer(
                data=request.data)
            filter_serializer.is_valid(raise_exception=True)
            filters = filter_serializer.validated_data

            user = request.user_account
            role = request.user_account.role
            if role.name == "business_owner":
                orderItems = OrderItem.objects.filter(
                    Q(order_id__buyer=user), deleted_at=None
                ).distinct()
            elif role.name == "influencer":
                # For all the order items, there will be a package in it and the package willl have influencer id
                orderItems = OrderItem.objects.filter(
                    Q(package__influencer=user), deleted_at=None
                ).distinct()

            if "service_masters" in filters:
                orderItems = orderItems.filter(
                    service_master__in=filters["service_masters"]
                )

            if "gt_created_at" in filters:
                gt_created_at = filters["gt_created_at"].date()
                orderItems = orderItems.filter(
                    created_at__date__gte=gt_created_at)

            if "lt_created_at" in filters:
                lt_created_at = filters["lt_created_at"].date()
                orderItems = orderItems.filter(
                    created_at__date__lte=lt_created_at)

            if "lt_rating" in filters:
                orderItems = orderItems.filter(
                    review__rating__lt=filters["lt_rating"])

            if "gt_rating" in filters:
                orderItems = orderItems.filter(
                    review__rating__gt=filters["gt_rating"])

            if "search" in filters:
                orderItems = orderItems.filter(
                    Q(order_id__buyer__first_name__icontains=filters["search"])
                    | Q(order_id__buyer__last_name__icontains=filters["search"])
                    | Q(package__influencer__first_name__icontains=filters["search"])
                    | Q(package__influencer__last_name__icontains=filters["search"])
                    | Q(order_id__order_code__icontains=filters["search"])
                )

            if "buyers" in filters:
                orderItems = orderItems.filter(
                    order_id__buyer__in=filters["buyers"])

            if "order_by" in filters and filters["order_by"] == "upcoming":
                orderItems = orderItems.annotate(
                    time_difference=ExpressionWrapper(
                        F('publish_date') - Now(), output_field=DateTimeField()
                    ),
                    is_future=Case(
                        When(publish_date__gte=Now(), then=True),
                        default=False,
                        output_field=BooleanField(),
                    )
                ).order_by(
                    '-is_future',
                    Case(
                        When(is_future=True, then=F('time_difference')),
                        When(is_future=False, then=F('time_difference') * -1),
                        output_field=DateTimeField(),
                    )
                )
            elif "order_by" in filters:
                orderItems = orderItems.order_by(filters["order_by"])

            # Attach the total count of each status
            status_counts = {
                "accepted": orderItems.filter(status="accepted").count(),
                "published": orderItems.filter(status="published").count(),
                "cancelled": orderItems.filter(status="cancelled").count(),
                "scheduled": orderItems.filter(status="scheduled").count(),
                "rejected": orderItems.filter(status="rejected").count(),
            }

            if "status" in filters:
                orderItems = orderItems.filter(status__in=filters["status"])

            pagination = Pagination(orderItems, request)
            serializer = OrderItemReadSerializer(
                pagination.getData(), context={"request": request}, many=True)

            combined_data = {
                "order_items": serializer.data,
                "status_counts": status_counts,
            }

            return Response(
                {
                    "isSuccess": True,
                    "data": combined_data,
                    "message": "All Order Items retrieved successfully",
                    "pagination": pagination.getPageInfo(),
                },
                status=status.HTTP_200_OK,
            )
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
            serializer = OrderItemReadSerializer(orderItem)
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
    def get_authenticators(self):
        if self.request.method == 'POST':
            return [JWTAuthentication()]
        return super().get_authenticators()
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
                # Check that the current user is the buyer of the order
                order = Order.objects.get(pk=request.data["order"])
                if order.buyer != request.user_account:
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "You are not authorized to review this order",
                            "data": None,
                            "errors": "You are not authorized to review this order",
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
                # Check that the order does not have a review already
                review_exists = Review.objects.filter(order=order).exists()
                if review_exists:
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "Order already has a review",
                            "data": None,
                            "errors": "Order already has a review",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                # Check that the order is in completed state
                if order.status != "completed":
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "Order is not yet complete",
                            "data": None,
                            "errors": "Order is not yet complete",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": ReviewSerializer(serializer.instance).data,
                        "message": "Review added successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


# Retrieve-Update-Destroy API
class ReviewDetail(APIView):
    def get_authenticators(self):
        if self.request.method == 'PUT' or self.request.method == 'DELETE':
            return [JWTAuthentication()]
        return super().get_authenticators()
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
                order = Order.objects.get(pk=request.data["order"])
                if order.buyer != request.user_account:
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "You are not authorized to review this order",
                            "data": None,
                            "errors": "You are not authorized to review this order",
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
                # Check that the order is in completed state
                if order.status != "completed":
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "Order is not yet complete",
                            "data": None,
                            "errors": "Order is not yet complete",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": ReviewSerializer(serializer.instance).data,
                        "message": "Review updated successfully",
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
                order = Order.objects.get(pk=review.order.id)
                if order.buyer != request.user_account:
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "You are not authorized to delete this review",
                            "data": None,
                            "errors": "You are not authorized to delete this review",
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
                review.delete()
            except ValidationError as e:
                return handleDeleteNotAllowed("review")
            return Response(
                {
                    "isSuccess": True,
                    "data": None,
                    "message": "Review deleted successfully",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return handleServerException(e)


class SendTweetView(APIView):
    authentication_classes = [JWTAuthentication]
    @swagger_auto_schema(request_body=SendTweetSerializer)
    def post(self, request):
        try:
            serializer = SendTweetSerializer(data=request.data)
            if serializer.is_valid():
                # Get the order_item_id
                order_item_id = serializer.validated_data["order_item_id"]
                order_item = OrderItem.objects.get(pk=order_item_id)

                # Check that the logged in user is the influencer of the order
                if order_item.package.influencer.id != request.user_account.id:
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "You are not authorized to schedule this order item",
                            "data": None,
                            "errors": "You are not authorized to schedule this order item",
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )

                is_valid, validation_error = validate_order_item_meta_data(
                    order_item)

                if not is_valid:
                    return Response(
                        {
                            "isSuccess": False,
                            "message": validation_error,
                            "data": None,
                            "errors": validation_error,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # Schedule the tweet
                schedule_tweet(order_item_id)

                return Response(
                    {
                        "isSuccess": True,
                        "data": serializer.data,
                        "message": "Post is scheduled",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


class CancelTweetView(APIView):
    authentication_classes = [JWTAuthentication]
    @swagger_auto_schema(request_body=SendTweetSerializer)
    def post(self, request):
        try:
            serializer = SendTweetSerializer(data=request.data)
            if serializer.is_valid():
                # Get the order_item_id
                order_item_id = serializer.validated_data["order_item_id"]
                order_item = OrderItem.objects.get(pk=order_item_id)

                # Check that the logged in user is the influencer of the order
                if order_item.package.influencer.id != request.user_account.id:
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "You are not authorized to cancel this order item",
                            "data": None,
                            "errors": "You are not authorized to cancel this order item",
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )

                # Schedule the tweet
                cancel_tweet(order_item_id)

                return Response(
                    {
                        "isSuccess": True,
                        "data": serializer.data,
                        "message": "Post is cancelled",
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)


class OrderItemMetricDetailView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_object(self, pk):
        try:
            return OrderItem.objects.get(pk=pk)
        except OrderItem.DoesNotExist:
            return handleNotFound("Order Item")

    @swagger_auto_schema(request_body=OrderItemMetricFilterSerializer)
    def post(self, request):
        try:
            filter_serializer = OrderItemMetricFilterSerializer(
                data=request.data)
            filter_serializer.is_valid(raise_exception=True)
            filters = filter_serializer.validated_data

            user = request.user_account
            role = request.user_account.role

            order_item = self.get_object(filters["order_item_id"])
            if role.name == "business_owner":
                if order_item.order_id.buyer != user:
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "You are not authorized to view this order item",
                            "data": None,
                            "errors": "You are not authorized to view this order item",
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
            elif role.name == "influencer":
                if order_item.package.influencer != user:
                    return Response(
                        {
                            "isSuccess": False,
                            "message": "You are not authorized to view this order item",
                            "data": None,
                            "errors": "You are not authorized to view this order item",
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )

            order_item_metrics = OrderItemMetric.objects.filter(
                order_item=order_item
            )

            if "type" in filters and filters["type"] is not None and len(filters["type"]) > 0:
                order_item_metrics = order_item_metrics.filter(
                    type__in=filters["type"])

            all_metrics = order_item_metrics.values_list(
                "metric", flat=True).distinct()

            if "metric" in filters and filters["metric"] is not None and len(filters["metric"]) > 0:
                order_item_metrics = order_item_metrics.filter(
                    metric__in=filters["metric"]
                )

            if "gt_created_at" in filters and filters["gt_created_at"] is not None:
                gt_created_at = filters["gt_created_at"].date()
                order_item_metrics = order_item_metrics.filter(
                    created_at__date__gte=gt_created_at)

            if "lt_created_at" in filters and filters["lt_created_at"] is not None:
                lt_created_at = filters["lt_created_at"].date()
                order_item_metrics = order_item_metrics.filter(
                    created_at__date__lte=lt_created_at)

            serializer = OrderItemMetricSerializer(
                order_item_metrics, many=True)
            order_item_serializer = OrderItemReadSerializer(order_item)

            return Response(
                {
                    "isSuccess": True,
                    "data": {
                        "order_item": order_item_serializer.data,
                        "order_item_metrics": serializer.data,
                        "all_metrics": all_metrics,
                    },
                    "message": "All Order Item Metrics retrieved successfully",
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return handleServerException(e)


class ManualVerifyOrderItemView(APIView):
    authentication_classes = [JWTAuthentication]

    @swagger_auto_schema(request_body=ManualVerifyOrderItemSerializer)
    def put(self, request, pk):
        try:
            order_item = OrderItem.objects.get(pk=pk)
            if order_item is None:
                return handleNotFound("Order Item")

            # Check that the logged in user is the buyer of the order
            if request.user_account.role.name != "business_owner" or order_item.order_id.buyer.id != request.user_account.id:
                return Response(
                    {
                        "isSuccess": False,
                        "message": "You are not authorized to verify this order item",
                        "data": None,
                        "errors": "You are not authorized to verify this order item",
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Also check that the order_item is in accepted or cancelled state
            if order_item.status not in ["published"]:
                return Response(
                    {
                        "isSuccess": False,
                        "message": "Order item is already " + order_item.status,
                        "data": None,
                        "errors": "Order item is already " + order_item.status,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get the data from serializer
            serializer = ManualVerifyOrderItemSerializer(
                instance=order_item, data=request.data, partial=True
            )
            if serializer.is_valid():
                order_item.is_verified = True
                if serializer.validated_data.get("published_post_link"):
                    published_link = serializer.validated_data.get(
                        "published_post_link")
                    tweet_id = published_link.split('/')[-1].split('?')[0]
                    order_item.published_tweet_id = tweet_id
                order_item.save()

                create_manual_verification_notification(order_item)

                check_order_status(pk=order_item.order_id.id)
                return Response(
                    {
                        "isSuccess": True,
                        "data": None,
                        "message": "Order Item verified successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)
