# Generated by Django 4.2.7 on 2024-01-19 11:10

from django.db import migrations
import random
import string


def generate_order_codes(apps, schema_editor):
    Order = apps.get_model('orders', 'Order')
    for order in Order.objects.filter(order_code__isnull=True):
        while True:
            code = ''.join(random.choices(
                string.ascii_uppercase + string.digits, k=12))
            code = '-'.join(code[i:i+4] for i in range(0, len(code), 4))
            if not Order.objects.filter(order_code=code).exists():
                order.order_code = code
                order.save()
                break


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0011_order_order_code'),
    ]

    operations = [
        migrations.RunPython(generate_order_codes),
    ]