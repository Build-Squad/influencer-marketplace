import logging
from orders.models import Order, OrderItem, OrderItemTracking, OrderMessage, OrderTracking
from notifications.models import Notification
from decouple import config

from django.utils import timezone

FRONT_END_URL = config('FRONT_END_URL')
ORDERS_DASHBOARD_URL = FRONT_END_URL + 'influencer/orders'
BUSINESS_DASHBOARD_URL = FRONT_END_URL + 'business/dashboard'
INFLUENCER_DASHBOARD_URL = FRONT_END_URL + 'influencer/dashboard'


logger = logging.getLogger(__name__)

def create_notification_for_order(order, old_status, new_status):
    """
    Create notification for order
    """
    # Create notification
    # For all types of order updates, generate a different message and send it to the relevant user

    """
    Case 1: Order goes from draft to pending
    # Should be sent to the influencer mentioning that a new order has been sent to them for acceptance
    
    Case 2: Order goes from pending to accepted
    # Should be sent to the brand mentioning that the order has been accepted by the influencer
    
    Case 3: Order goes from pending to rejected
    # Should be sent to the brand mentioning that the order has been rejected by the influencer
    
    Case 4: Order goes from accepted to completed
    # Should be sent to the brand mentioning that the order has been completed by the influencer
    
    """
    buyer = order.buyer
    # Get all order_items for this order
    order_items = OrderItem.objects.filter(order_id=order)
    influencer = order_items[0].package.influencer

    if old_status == 'draft' and new_status == 'pending':
        # Case 1
        message = 'You have a new order from ' + buyer.username
        title = 'New Order'
        Notification.objects.create(
            user=influencer, message=message, title=title, slug=ORDERS_DASHBOARD_URL)

    elif old_status == 'pending' and new_status == 'accepted':
        # Case 2
        message = 'Your order ' + order.order_code + \
            'has been accepted by ' + influencer.username
        title = 'Order Accepted'
        Notification.objects.create(
            user=buyer, message=message, title=title, slug=BUSINESS_DASHBOARD_URL)

    elif old_status == 'pending' and new_status == 'rejected':
        # Case 3
        message = 'Your order ' + order.order_code + \
            'has been rejected by ' + influencer.username
        title = 'Order Rejected'
        Notification.objects.create(
            user=buyer, message=message, title=title, slug=BUSINESS_DASHBOARD_URL)

    elif old_status == 'accepted' and new_status == 'completed':
        # Case 4
        message = 'Your order ' + order.order_code + \
            ' has been completed by ' + influencer.username
        title = 'Order Completed'
        Notification.objects.create(
            user=buyer, message=message, title=title, slug=BUSINESS_DASHBOARD_URL)

        # Send a notification to the influencer to claim the funds for the order
        message = 'Order ' + order.order_code + \
            ' has been completed. You can now claim the funds'
        title = 'Order Completed'
        Notification.objects.create(
            user=influencer, message=message, title=title, slug=INFLUENCER_DASHBOARD_URL)

    elif new_status == 'cancelled':
        # Case 5
        message = 'Your order ' + order.order_code + \
            ' has been successfully cancelled. You can now reclaim the funds.'
        title = 'Order Cancelled'
        Notification.objects.create(
            user=buyer, message=message, title=title, slug=BUSINESS_DASHBOARD_URL)


def create_notification_for_order_item(order_item, old_status, new_status):
    """
    Create notification for order item
    """
    # Create notification
    # For all types of order updates, generate a different message and send it to the relevant user

    """    
    Case 1: Order item goes from accepted to scheduled
    # Should be sent to the influencer mentioning that the order item has been scheduled by the brand
    
    Case 2: Order item goes from scheduled to published
    # Should be sent to the influencer mentioning that the order item has been published by the brand
    
    Case 3: Order item goes from scheduled to cancelled
    # Should be sent to the influencer mentioning that the order item has been cancelled by the brand
    
    """
    # Get the order
    order = order_item.order_id
    buyer = order.buyer
    influencer = order_item.package.influencer

    if old_status == 'accepted' and new_status == 'scheduled':
        # Case 1
        message = 'Your order item ' + order_item.package.name + \
            ' has been scheduled by ' + influencer.username
        title = 'Order Item Scheduled'
        Notification.objects.create(
            user=buyer, message=message, title=title, slug=BUSINESS_DASHBOARD_URL)

    elif old_status == 'scheduled' and new_status == 'published':

        # Case 2
        message = 'Your order item ' + order_item.package.name + \
            ' has been published by ' + influencer.username
        title = 'Order Item Published'
        Notification.objects.create(
            user=buyer, message=message, title=title, slug=BUSINESS_DASHBOARD_URL)
        
        # Send a notification to the influencer to let them know that the order item has been published
        message = 'Order item ' + order_item.package.name + \
            ' has been published'
        title = 'Order Item Published'
        Notification.objects.create(
            user=influencer, message=message, title=title, slug=INFLUENCER_DASHBOARD_URL)

    elif old_status == 'scheduled' and new_status == 'cancelled':
        # Case 3
        message = 'Your order item ' + order_item.package.name + \
            ' has been cancelled by ' + influencer.username
        title = 'Order Item Cancelled'
        Notification.objects.create(
            user=buyer, message=message, title=title, slug=BUSINESS_DASHBOARD_URL)


def create_order_tracking(order, status):
    """
    Create order tracking
    """
    try:
        OrderTracking.objects.create(order=order, status=status)
    except Exception as e:
        logger.error("Error creating order tracking: ", str(e))
        return False


def create_order_item_tracking(order_item, status):
    """
    Create order item tracking
    """
    try:
        OrderItemTracking.objects.create(order_item=order_item, status=status)
    except Exception as e:
        logger.error("Error creating order item tracking: ", str(e))
        return False


def check_notification_sent(order_item_id):
    notification = Notification.objects.filter(
        module_id=order_item_id, module='order_item_reminder'
    )
    if notification.exists():
        return True
    return False

def create_reminider_notification(order_item):
    try:
        if not check_notification_sent(order_item.id):
            influencer = order_item.package.influencer
            current_time = timezone.now()
            time_left = order_item.publish_date - current_time
            minutes_left = int(time_left.total_seconds() / 60)
            message = 'You have an order item ' + order_item.package.name + \
                ' due for publishing in ' + str(minutes_left) + ' minutes'
            title = 'Order Item Reminder'
            Notification.objects.create(
                user=influencer, message=message, title=title, slug=INFLUENCER_DASHBOARD_URL, module='order_item_reminder', module_id=order_item.id)
    except Exception as e:
        logger.error("Error creating reminder notification: ", str(e))
        return False


def create_order_item_status_update_message(order_item, updated_by):
    try:
        order = order_item.order_id
        buyer = order.buyer
        influencer = order_item.package.influencer
        sender_id = buyer if updated_by == buyer.id else influencer
        receiver_id = influencer if updated_by == buyer.id else buyer
        message = f'{order_item.package.name} has been {order_item.status}'
        OrderMessage.objects.create(
            sender_id=sender_id, receiver_id=receiver_id, message=message, order_id=order_item.order_id, is_system_message=True)
    except Exception as e:
        logger.error(
            "Error creating order item status update message: ", str(e))
        return False


def update_order_item_approval_status(order_item: OrderItem):

    # Create a notification for the buyer
    buyer = order_item.order_id.buyer
    influencer = order_item.package.influencer

    message = f'Your order item {order_item.package.name} has been updated by {influencer.username}, please review the changes for scheduling.'
    title = 'Order Item Updated'
    Notification.objects.create(
        user=buyer, message=message, title=title, slug=BUSINESS_DASHBOARD_URL)

    order_item.approved = False
    order_item.save()

def create_order_item_publish_date_update_message(order_item, updated_by):
    try:
        order = order_item.order_id
        buyer = order.buyer
        influencer = order_item.package.influencer

        if updated_by == influencer.id:
            update_order_item_approval_status(order_item)

        sender_id = buyer if updated_by == buyer.id else influencer
        receiver_id = influencer if updated_by == buyer.id else buyer
        message = f'Publish date for {order_item.package.name} has been updated.'
        OrderMessage.objects.create(
            sender_id=sender_id, receiver_id=receiver_id, message=message, order_id=order_item.order_id, is_system_message=True)
    except Exception as e:
        logger.error(
            "Error creating order item publish date update message: ", str(e))
        return False


def create_order_item_meta_data_field_update_message(order_item_meta_data, updated_by, old_value):
    try:
        order_item = OrderItem.objects.get(
            id=order_item_meta_data.order_item_id)
        order = order_item.order_id
        buyer = order.buyer
        influencer = order_item.package.influencer

        if updated_by == influencer.id:
            update_order_item_approval_status(order_item)

        sender_id = buyer if updated_by == buyer.id else influencer
        receiver_id = influencer if updated_by == buyer.id else buyer
        message = f'{order_item_meta_data.label} for {order_item.package.name} has been updated from {old_value} to {order_item_meta_data.value}.'
        OrderMessage.objects.create(
            sender_id=sender_id, receiver_id=receiver_id, message=message, order_id=order_item.order_id, is_system_message=True)
    except Exception as e:
        logger.error(
            "Error creating order item meta data field update message: ", str(e))
        return False
