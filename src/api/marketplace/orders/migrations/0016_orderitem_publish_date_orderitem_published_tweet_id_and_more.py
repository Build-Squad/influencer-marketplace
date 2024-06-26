# Generated by Django 4.2.7 on 2024-01-29 05:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0015_orderitemmetadata_field_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='publish_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='orderitem',
            name='published_tweet_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='status',
            field=models.CharField(choices=[('pending', 'pending'), ('in_progress', 'in_progress'), ('completed', 'completed'), ('cancelled', 'cancelled'), ('rejected', 'rejected'), ('finalized', 'finalized'), ('published', 'published')], default='pending', max_length=50),
        ),
    ]
