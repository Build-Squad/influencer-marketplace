# Generated by Django 4.2.7 on 2023-12-20 06:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('packages', '0004_alter_package_publish_date_alter_package_status_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='package',
            name='currency',
        ),
        migrations.RemoveField(
            model_name='package',
            name='price',
        ),
    ]