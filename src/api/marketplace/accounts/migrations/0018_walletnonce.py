# Generated by Django 4.2.7 on 2024-02-07 08:08

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0017_merge_20240131_1104'),
    ]

    operations = [
        migrations.CreateModel(
            name='WalletNonce',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='Wallet Nonce ID')),
                ('wallet_address', models.CharField(blank=True, max_length=255, null=True)),
                ('nonce', models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                'db_table': 'wallet_nonce',
            },
        ),
    ]