# Generated by Django 4.2.7 on 2023-12-12 06:44

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='Language')),
                ('langCode', models.CharField(blank=True, max_length=100, null=True)),
                ('langEnglishName', models.CharField(blank=True, max_length=100, null=True)),
                ('langNativeName', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'db_table': 'language',
            },
        ),
    ]