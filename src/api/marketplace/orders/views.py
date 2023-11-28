from marketplace.services import Pagination, handleServerException, handleBadRequest, handleNotFound, handleDeleteNotAllowed
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from rest_framework import status

# ORDER API-Endpoint
# List-Create-API
class OrderList(APIView):    
    def get(self, request):
        try:
          orders = Order.objects.all()
          pagination = Pagination(orders, request)
          serializer = OrderSerializer(pagination.getData(), many=True)
          return Response({
              'isSuccess': True,
              'data': serializer.data,
              'message': 'All Order retrieved successfully',
              'pagination': pagination.getPageInfo()
          }, status=status.HTTP_200_OK)
        except Exception as e:
            return handleServerException(e)

    def post(self, request):
        try:
          serializer = OrderSerializer(data=request.data)
          if serializer.is_valid():
            serializer.save()
            return Response({
                'isSuccess': True,
                'data': OrderSerializer(serializer.instance).data,
                'message': 'Order created successfully'
            }, status=status.HTTP_201_CREATED)
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
            return handleNotFound('order')
          serializer = OrderSerializer(order)
          return Response({
              'isSuccess': True,
              'data': serializer.data,
              'message': 'order retrieved successfully'
          }, status=status.HTTP_200_OK)
        except Exception as e:
            return handleServerException(e)

    def put(self, request, pk):
        try:
          order = self.get_object(pk)
          if order is None:
            return handleNotFound('Order')
          serializer = OrderSerializer(instance=order, data=request.data)
          if serializer.is_valid():
            serializer.save()
            return Response({
                'isSuccess': True,
                'data': OrderSerializer(serializer.instance).data,
                'message': 'Order updated successfully'
            }, status=status.HTTP_200_OK)
          else:
            return handleBadRequest(serializer.errors)
        except Exception as e:
            return handleServerException(e)

    def delete(self, request, pk):
        try:
          order = self.get_object(pk)
          if order is None:
            return handleNotFound('Order')
          try:
            order.delete()
          except ValidationError as e:
            return handleDeleteNotAllowed('Order')
          return Response({
              'isSuccess': True,
              'data': None,
              'message': 'Order deleted successfully'
          }, status=status.HTTP_200_OK)
        except Exception as e:
            return handleServerException(e)
    
