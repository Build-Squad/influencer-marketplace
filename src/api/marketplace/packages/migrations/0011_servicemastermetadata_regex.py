# Generated by Django 4.2.7 on 2024-02-08 10:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('packages', '0010_servicemaster_twitter_service_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='servicemastermetadata',
            name='regex',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]