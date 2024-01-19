# Generated by Django 4.2.7 on 2024-01-18 08:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_accountlanguage'),
    ]

    operations = [
        migrations.CreateModel(
            name='BusinessAccountMetaData',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='Business Meta Data Id')),
                ('business_name', models.CharField(blank=True, max_length=100, null=True)),
                ('industry', models.CharField(blank=True, max_length=100, null=True)),
                ('founded', models.CharField(blank=True, max_length=100, null=True)),
                ('headquarters', models.CharField(blank=True, max_length=100, null=True)),
                ('bio', models.CharField(blank=True, max_length=255, null=True)),
                ('phone', models.CharField(blank=True, max_length=100, null=True)),
                ('website', models.CharField(blank=True, max_length=100, null=True)),
                ('twitter_account', models.CharField(blank=True, max_length=100, null=True)),
                ('linked_in', models.CharField(blank=True, max_length=100, null=True)),
                ('user_email', models.EmailField(blank=True, max_length=254, null=True)),
                ('user_account', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_business_meta_data', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'business_account_meta_data',
            },
        ),
    ]
