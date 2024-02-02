# Generated by Django 4.2.7 on 2024-02-02 10:35

from django.db import migrations
import random


def generate_order_number(apps, schema_editor):
    Order = apps.get_model('orders', 'Order')
    for order in Order.objects.filter(order_number__isnull=True):
        while True:
            number = random.randint(100000, 999999)
            if not Order.objects.filter(order_number=number).exists():
                order.order_number = number
                order.save()
                break


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0019_order_order_number'),
    ]

    operations = [
        migrations.RunPython(generate_order_number),
    ]