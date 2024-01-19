# Generated by Django 4.2.7 on 2024-01-18 06:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_languagemaster_delete_language'),
    ]

    operations = [
        migrations.AlterField(
            model_name='currency',
            name='country',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='currency_country_id', to='core.country'),
        ),
    ]
