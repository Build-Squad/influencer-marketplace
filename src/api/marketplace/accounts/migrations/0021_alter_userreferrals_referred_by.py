# Generated by Django 4.2.7 on 2024-02-20 09:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0020_alter_userreferrals_referred_by_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userreferrals',
            name='referred_by',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='referred_by_account', to=settings.AUTH_USER_MODEL),
        ),
    ]
