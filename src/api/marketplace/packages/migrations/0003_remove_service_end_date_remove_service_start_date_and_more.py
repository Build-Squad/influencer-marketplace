# Generated by Django 4.2.7 on 2023-12-19 07:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('packages', '0002_service_end_date_service_start_date_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='service',
            name='end_date',
        ),
        migrations.RemoveField(
            model_name='service',
            name='start_date',
        ),
        migrations.RemoveField(
            model_name='servicemaster',
            name='is_duration_based',
        ),
        migrations.AddField(
            model_name='package',
            name='type',
            field=models.CharField(choices=[('package', 'package'), ('service', 'service')], default='package', max_length=50),
        ),
        migrations.AddField(
            model_name='service',
            name='is_duration_based',
            field=models.BooleanField(default=False),
        ),
    ]