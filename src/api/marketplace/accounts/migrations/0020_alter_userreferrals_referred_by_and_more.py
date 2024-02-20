# Generated by Django 4.2.7 on 2024-02-20 09:03

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0019_userreferrals'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userreferrals',
            name='referred_by',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='referral_by_account', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='userreferrals',
            name='user_account',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_account', to=settings.AUTH_USER_MODEL),
        ),
    ]
