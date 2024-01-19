
from accounts.models import User
from .models import Notification


def create_notification(title, message, user_id, **kwargs):
    """
    This function is used to create Notifications.

    :param:
        title: Title of the Notification
        message: Message of the Notification
        user_id: Specifies to which user the notification is created
    :return: None
    """
    user = User.objects.get(id=user_id)
    slug = kwargs.get('slug', None)

    new_notification = Notification(
        title=title,
        message=message,
        slug=slug,
    )
    new_notification.save()
