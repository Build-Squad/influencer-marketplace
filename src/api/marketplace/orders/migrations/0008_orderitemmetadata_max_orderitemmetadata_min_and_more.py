# Generated by Django 4.2.7 on 2024-01-15 10:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0007_orderitem_deleted_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitemmetadata',
            name='max',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='orderitemmetadata',
            name='min',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='orderitemmetadata',
            name='placeholder',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
