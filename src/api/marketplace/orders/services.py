import logging
from orders.models import Order, OrderItem, OrderItemMetaData, OrderItemTracking, OrderMessage, OrderTracking
from notifications.models import Notification
from decouple import config

from django.utils import timezone

FRONT_END_URL = config('FRONT_END_URL')
ORDERS_DASHBOARD_URL = FRONT_END_URL + 'influencer/orders'
BUSINESS_DASHBOARD_URL = FRONT_END_URL + '/business/dashboard/?tab=orders'
BUSINESS_ORDER_ITEM_DASHBOARD_URL = FRONT_END_URL + \
    '/business/dashboard/?tab=order-items'
INFLUENCER_DASHBOARD_URL = FRONT_END_URL + '/influencer/dashboard/?tab=orders'


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
        message = 'Your order item ' + order_item.package.name + ' from order ' + order.order_code + \
            ' has been scheduled by ' + influencer.username
        title = 'Order Item Scheduled'
        Notification.objects.create(
            user=buyer, message=message, title=title, slug=BUSINESS_DASHBOARD_URL)

    elif old_status == 'scheduled' and new_status == 'published':

        # Case 2
        message = 'Your order item ' + order_item.package.name + ' from order ' + order.order_code + \
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
        message = 'Your order item ' + order_item.package.name + ' from order ' + order.order_code + \
            ' has been cancelled by ' + influencer.username
        title = 'Order Item Cancelled'
        Notification.objects.create(
            user=buyer, message=message, title=title, slug=BUSINESS_DASHBOARD_URL)

    elif old_status == 'scheduled' and new_status == 'failed':
        # Case 3
        message = 'Your order item ' + order_item.package.name + 'from order ' + order.order_code + \
            ' has failed to publish by Xfluencer. Please review the order item and try again.'
        title = 'Order Item Failed'
        notifications = []
        notifications.append({
            'user_id': buyer.id,
            'message': message,
            'title': title,
            'slug': BUSINESS_DASHBOARD_URL
        })
        notifications.append({
            'user_id': influencer.id,
            'message': message,
            'title': title,
            'slug': INFLUENCER_DASHBOARD_URL
        })
        Notification.objects.bulk_create(
            [Notification(**notification) for notification in notifications])


def create_post_verification_failed_notification(order_item):
    # Get the order
    order = order_item.order_id
    buyer = order.buyer
    influencer = order_item.package.influencer

    message = 'Your order item ' + order_item.package.name + 'from order ' + order.order_code + \
        ' has failed verification by Xfluencer. Please review the order item.'
    title = 'Order Item Verification Failed'
    notifications = []
    notifications.append({
        'user_id': buyer.id,
        'message': message,
        'title': title,
        'slug': BUSINESS_ORDER_ITEM_DASHBOARD_URL
    })
    notifications.append({
        'user_id': influencer.id,
        'message': message,
        'title': title,
        'slug': INFLUENCER_DASHBOARD_URL
    })
    Notification.objects.bulk_create(
        [Notification(**notification) for notification in notifications])

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
            message = 'You have an order item ' + order_item.package.name + ' from order ' + order_item.order_id.order_code + \
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

def create_order_item_approval_notification(order_item):
    try:
        buyer = order_item.order_id.buyer
        influencer = order_item.package.influencer

        message = f'Order Item: {order_item.package.name} has been approved by {buyer.username}, please review the changes for scheduling.'
        title = 'Order Item Approved'
        Notification.objects.create(
            user=influencer, message=message, title=title, slug=INFLUENCER_DASHBOARD_URL)
    except Exception as e:
        logger.error(
            "Error creating order item approval notification: ", str(e))
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

def create_manual_verification_notification(order_item):
    try:
        buyer = order_item.order_id.buyer
        influencer = order_item.package.influencer

        message = f'Order Item: {order_item.package.name} has been manually verified by {buyer.username}.'
        title = 'Order Item Manually Verified'
        Notification.objects.create(
            user=influencer, message=message, title=title, slug=INFLUENCER_DASHBOARD_URL)
    except Exception as e:
        logger.error(
            "Error creating manual verification notification: ", str(e))
        return False


def validate_order_item_meta_data(order_item: OrderItem):
    is_valid = True
    validation_error = ""

    order_item_meta_datas = OrderItemMetaData.objects.filter(
        order_item=order_item)
    service_type = order_item.service_master.twitter_service_type

    text = ''
    tweet_id = ''
    in_reply_to_tweet_id = ''
    poll_options = []
    poll_duration_minutes = 0
    for order_item_meta_data in order_item_meta_datas:
        if order_item_meta_data.field_name == 'text':
            if order_item_meta_data.value and len(order_item_meta_data.value) > 0:
                text = order_item_meta_data.value
        elif order_item_meta_data.field_name == 'tweet_id':
            # Split the tweet_id and get the last part
            if order_item_meta_data.value and len(order_item_meta_data.value) > 0:
                tweet_id = order_item_meta_data.value.split(
                    '/')[-1].split('?')[0]
        elif order_item_meta_data.field_name == 'in_reply_to_tweet_id':
            # Split the tweet_id and get the last part
            if order_item_meta_data.value and len(order_item_meta_data.value) > 0:
                in_reply_to_tweet_id = order_item_meta_data.value.split(
                    '/')[-1]
        elif order_item_meta_data.field_name == 'poll_options':
            # This will be a comma separated string, convert to list
            if order_item_meta_data.value and len(order_item_meta_data.value) > 0:
                options = order_item_meta_data.value.split(',')
                poll_options = [option.strip() for option in options]
        elif order_item_meta_data.field_name == 'poll_duration_minutes':
            # Convert to integer
            if order_item_meta_data.value and len(order_item_meta_data.value) > 0:
                poll_duration_minutes = int(order_item_meta_data.value)

    if service_type == 'tweet' and (not text or len(text) == 0):
        is_valid = False
        validation_error = "Content cannot be empty for the post"
    elif service_type == 'like_tweet' and (not tweet_id or len(tweet_id) == 0):
        is_valid = False
        validation_error = "Post Link cannot be empty for the post"
    elif service_type == 'reply_to_tweet':
        if not text or len(text) == 0:
            is_valid = False
            validation_error = "Content cannot be empty for the post"
        elif not in_reply_to_tweet_id or len(in_reply_to_tweet_id) == 0:
            is_valid = False
            validation_error = "Reply to post link cannot be empty for the post"
    elif service_type == 'quote_tweet':
        if not text or len(text) == 0:
            is_valid = False
            validation_error = "Content cannot be empty for the post"
        elif not tweet_id or len(tweet_id) == 0:
            is_valid = False
            validation_error = "Quote post link cannot be empty for the post"
    elif service_type == 'poll':
        if not text or len(text) == 0:
            is_valid = False
            validation_error = "Content cannot be empty for the post"
        elif len(poll_options) < 2:
            is_valid = False
            validation_error = "Minimum of 2 poll options are required for the post"
        elif poll_duration_minutes < 5:
            is_valid = False
            validation_error = "Poll duration should be at least 5 minutes"
    elif service_type == 'retweet' and (not tweet_id or len(tweet_id) == 0):
        is_valid = False
        validation_error = "Post Link cannot be empty for the post"
    elif service_type == 'thread' and (not text or len(text) == 0):
        is_valid = False
        validation_error = "Content cannot be empty for the post"

    return is_valid, validation_error
