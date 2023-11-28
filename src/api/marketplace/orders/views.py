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
from .models import (
    Order,
    OrderItem,
    OrderAttachment,
    OrderItemTracking,
    OrderMessage,
    OrderMessageAttachment,
    Transaction
)
from .serializers import (
    OrderSerializer,
    OrderItemSerializer,
    OrderAttachmentSerializer,
    OrderItemTrackingSerializer,
    OrderMessageSerializer,
    OrderMessageAttachmentSerializer,
    TransactionSerializer
)
from rest_framework import status


# ORDER API-Endpoint
# List-Create-API
class OrderList(APIView):
    def get(self, request):
        try:
            orders = Order.objects.all()
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

    def post(self, request):
        try:
            serializer = OrderSerializer(data=request.data)
            if serializer.is_valid():
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


# Retrieve-Update-Destroy API
class OrderDetail(APIView):
    def get_object(self, pk):
        try:
            return Order.objects.get(pk=pk)
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

    def put(self, request, pk):
        try:
            order = self.get_object(pk)
            if order is None:
                return handleNotFound("Order")
            serializer = OrderSerializer(instance=order, data=request.data)
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
            serializer = OrderSerializer(pagination.getData(), many=True)
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

    def put(self, request, pk):
        try:
            orderAttachment = self.get_object(pk)
            if orderAttachment is None:
                return handleNotFound("Order Attachment")
            serializer = OrderItemSerializer(
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

    def post(self, request):
        try:
            serializer = OrderMessageSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": OrderMessageSerializer(serializer.instance).data,
                        "message": "Order Item Tracking data created successfully",
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


# ORDER-Message Attachment API-Endpoint
# List-Create-API
class TransactionList(APIView):
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

    def put(self, request, pk):
        try:
            transaction = self.get_object(pk)
            if transaction is None:
                return handleNotFound("transaction")
            serializer = TransactionSerializer(
                instance=transaction, data=request.data
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "isSuccess": True,
                        "data": TransactionSerializer(
                            serializer.instance
                        ).data,
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
