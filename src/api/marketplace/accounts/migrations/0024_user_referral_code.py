# Generated by Django 4.2.7 on 2024-03-27 06:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0023_user_promoted_tweet_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="referral_code",
            field=models.CharField(blank=True, max_length=16, null=True, unique=True),
        ),
    ]
