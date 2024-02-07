# Generated by Django 4.2.7 on 2024-02-06 10:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0024_auto_20240206_0935'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='transaction_type',
            field=models.CharField(choices=[('initiate_escrow', 'initiate_escrow'), ('cancel_escrow', 'cancel_escrow'), ('claim_escrow', 'claim_escrow'), ('validate_escrow', 'validate_escrow')], default='initiate_escrow', max_length=50),
        ),
    ]