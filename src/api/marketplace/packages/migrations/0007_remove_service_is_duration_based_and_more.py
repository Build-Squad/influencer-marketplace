# Generated by Django 4.2.7 on 2023-12-21 05:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('packages', '0006_service_platform_fees_service_platform_price'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='service',
            name='is_duration_based',
        ),
        migrations.RemoveField(
            model_name='service',
            name='platform_price',
        ),
        migrations.AddField(
            model_name='servicemaster',
            name='is_duration_based',
            field=models.BooleanField(default=False),
        ),
    ]
