# Generated by Django 4.2.7 on 2023-12-19 07:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_merge_20231219_0607'),
    ]

    operations = [
        migrations.AlterField(
            model_name='twitteraccount',
            name='joined_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
