# Generated by Django 4.2.7 on 2024-01-02 11:54

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_language'),
    ]

    operations = [
        migrations.CreateModel(
            name='LanguageMaster',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='Language Master')),
                ('langCode', models.CharField(blank=True, max_length=100, null=True)),
                ('langEnglishName', models.CharField(blank=True, max_length=100, null=True)),
                ('langNativeName', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'db_table': 'language_master',
            },
        ),
        migrations.DeleteModel(
            name='Language',
        ),
    ]