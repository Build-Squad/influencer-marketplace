# Generated by Django 4.2.7 on 2024-01-19 11:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0013_alter_order_order_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderitem',
            name='status',
            field=models.CharField(choices=[('pending', 'pending'), ('in_progress', 'in_progress'), ('completed', 'completed'), ('cancelled', 'cancelled'), ('rejected', 'rejected')], default='pending', max_length=50),
        ),
    ]
