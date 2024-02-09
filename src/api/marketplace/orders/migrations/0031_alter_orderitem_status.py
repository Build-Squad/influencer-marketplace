# Generated by Django 4.2.7 on 2024-02-09 11:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0030_orderitemtracking_created_at_ordertracking'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderitem',
            name='status',
            field=models.CharField(choices=[('draft', 'draft'), ('cancelled', 'cancelled'), ('rejected', 'rejected'), ('accepted', 'accepted'), ('scheduled', 'scheduled'), ('published', 'published')], default='draft', max_length=50),
        ),
    ]
