from marketplace.authentication import JWTAuthentication
from marketplace.services import Pagination, handleNotFound
from notifications.serializers import NotificationSerializer
from notifications.models import Notification
from marketplace.services import handleServerException
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.


class NotificationListView(APIView):
  authentication_classes = [JWTAuthentication]

  # Get Call to fetch all the notifications of the logged in user
  def get(self, request):
    try:
      user = request.user_account
      # Apply a filter to get all the notifications of the logged in user
      notifications = Notification.objects.filter(
          user=user).order_by('-created_at')
      # Also add a filter to get only the unread notifications if provided in the query params
      is_read = request.query_params.get('is_read', None)
      if is_read is not None:
        notifications = notifications.filter(is_read=is_read)

      # Paginate the notifications
      pagination = Pagination(notifications, request)
      serializer = NotificationSerializer(pagination.getData(), many=True)

      return Response(
          {
              "isSuccess": True,
              "data": serializer.data,
              "message": "All Notifications retrieved successfully",
              "pagination": pagination.getPageInfo(),
          },
          status=status.HTTP_200_OK,
      )
    except Exception as e:
      return handleServerException(e)


class NotificationDetailView(APIView):
  authentication_classes = [JWTAuthentication]

  def get_object(self, pk, user):
    try:
      return Notification.objects.get(pk=pk, user=user)
    except Notification.DoesNotExist:
      return None
  # Patch call to mark a notification as read
  def patch(self, request, pk):
    try:
      # Get the notification
      notification = self.get_object(pk, request.user_account)
      if notification is None:
        handleNotFound("Notification")
      # If the notification is already read, dont do anything else mark it as read
      if notification.is_read == True:
        return Response(
            {
                "isSuccess": True,
                "data": None,
                "message": "Notification already read",
            },
            status=status.HTTP_200_OK,
        )
      # Mark the notification as read
      notification.is_read = True
      notification.save()
      serializer = NotificationSerializer(notification)
      return Response(
          {
              "isSuccess": True,
              "data": serializer.data,
              "message": "Notification marked as read",
          },
          status=status.HTTP_200_OK,
      )
    except Exception as e:
      return handleServerException(e)


class NotificationAllReadView(APIView):
  authentication_classes = [JWTAuthentication]

  def patch(self, request):
    try:
      # Get all the notifications of the logged in user
      notifications = Notification.objects.filter(
          user=request.user_account, is_read=False)

      if notifications:
        # Mark all the notifications as read
        for notification in notifications:
          notification.is_read = True
          notification.save()
        return Response(
            {
                "isSuccess": True,
                "data": None,
                "message": "All notifications marked as read",
            },
            status=status.HTTP_200_OK,
        )
      else:
        return Response(
            {
                "isSuccess": True,
                "data": None,
                "message": "No unread notifications found",
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
      return handleServerException(e)
