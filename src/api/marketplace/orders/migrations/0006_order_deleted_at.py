# Generated by Django 4.2.7 on 2024-01-12 12:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0005_review_rating'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='deleted_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
