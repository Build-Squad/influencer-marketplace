# Generated by Django 4.2.7 on 2024-02-23 10:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('packages', '0013_alter_servicemastermetadata_field_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='servicemaster',
            name='twitter_service_type',
            field=models.CharField(blank=True, choices=[('tweet', 'tweet'), ('like_tweet', 'like_tweet'), ('reply_to_tweet', 'reply_to_tweet'), ('quote_tweet', 'quote_tweet'), ('poll', 'poll'), ('retweet', 'retweet'), ('thread', 'thread')], max_length=50, null=True),
        ),
    ]
