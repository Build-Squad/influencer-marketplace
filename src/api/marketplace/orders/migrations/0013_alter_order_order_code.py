# Generated by Django 4.2.7 on 2024-01-19 11:22

from django.db import migrations, models
import orders.models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0012_auto_20240119_1121'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='order_code',
            field=models.CharField(default=orders.models.generate_order_code, max_length=16, unique=True),
        ),
    ]
