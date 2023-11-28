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
from .models import Order, OrderItem, OrderAttachment
from .serializers import OrderSerializer, OrderItemSerializer, OrderAttachmentSerializer
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
            serializer = OrderItemSerializer(instance=orderAttachment, data=request.data)
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
