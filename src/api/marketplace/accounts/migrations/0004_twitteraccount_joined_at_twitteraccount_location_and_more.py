# Generated by Django 4.2.7 on 2023-12-13 07:46

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_user_email_verified_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='twitteraccount',
            name='joined_at',
            field=models.DateTimeField(default=datetime.datetime(2023, 12, 13, 7, 46, 38, 803819, tzinfo=datetime.timezone.utc)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='twitteraccount',
            name='location',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='twitteraccount',
            name='url',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
