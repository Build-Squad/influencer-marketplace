# Generated by Django 4.2.7 on 2024-01-29 05:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0014_alter_orderitem_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitemmetadata',
            name='field_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
