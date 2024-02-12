# Generated by Django 4.2.7 on 2024-02-08 08:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('packages', '0009_servicemastermetadata_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='servicemaster',
            name='twitter_service_type',
            field=models.CharField(blank=True, choices=[('tweet', 'tweet'), ('like_tweet', 'like_tweet'), ('reply_to_tweet', 'reply_to_tweet'), ('quote_tweet', 'quote_tweet'), ('poll', 'poll'), ('retweet', 'retweet')], max_length=50, null=True),
        ),
    ]