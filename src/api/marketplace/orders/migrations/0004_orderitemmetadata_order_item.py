# Generated by Django 4.2.7 on 2024-01-08 10:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0003_remove_orderitemmetadata_field_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitemmetadata',
            name='order_item',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='order_item_meta_data_order_item_id', to='orders.orderitem'),
        ),
    ]
