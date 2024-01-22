from orders.models import OrderItem
from notifications.models import Notification
from decouple import config

FRONT_END_URL = config('FRONT_END_URL')
ORDERS_DASHBOARD_URL = FRONT_END_URL + 'influencer/orders'
BUSINESS_DASHBOARD_URL = FRONT_END_URL + 'business/dashboard'


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

    print('buyer', buyer)
    print('influencer', influencer)
    print('old_status', old_status)
    print('new_status', new_status)

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