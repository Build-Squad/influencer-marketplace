# Generated by Django 4.2.7 on 2024-01-19 11:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0010_alter_ordermessage_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='order_code',
            field=models.CharField(blank=True, default=None, max_length=16, null=True),
        ),
    ]