# Generated by Django 4.2.7 on 2024-03-14 07:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("orders", "0037_orderitemmetric"),
    ]

    operations = [
        migrations.AlterField(
            model_name="orderitemmetric",
            name="type",
            field=models.CharField(
                blank=True,
                choices=[
                    ("organic_metrics", "organic_metrics"),
                    ("non_public_metrics", "non_public_metrics"),
                    ("public_metrics", "public_metrics"),
                ],
                max_length=100,
                null=True,
            ),
        ),
    ]
