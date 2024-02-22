# Generated by Django 4.2.7 on 2024-02-19 12:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0018_walletnonce'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserReferrals',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='User Referral ID')),
                ('referral_code', models.CharField(max_length=16, unique=True)),
                ('referred_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='referrals', to='accounts.userreferrals')),
                ('user_account', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_referral_account', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'user_referrals',
            },
        ),
    ]