# Generated by Django 4.2.7 on 2023-12-08 06:45

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0001_initial'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='User ID')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('first_name', models.CharField(blank=True, max_length=100, null=True)),
                ('last_name', models.CharField(blank=True, max_length=100, null=True)),
                ('status', models.CharField(blank=True, choices=[('active', 'active'), ('inactive', 'inactive')], max_length=25, null=True)),
                ('joined_at', models.DateTimeField(auto_now_add=True)),
                ('last_login', models.DateTimeField(auto_now=True)),
                ('otp', models.CharField(blank=True, max_length=25, null=True)),
                ('otp_expiration', models.DateTimeField(blank=True, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
            ],
            options={
                'db_table': 'user',
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='CategoryMaster',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='Category Master ID')),
                ('name', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                'db_table': 'category_master',
            },
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='Role ID')),
                ('name', models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                'db_table': 'role',
            },
        ),
        migrations.CreateModel(
            name='TwitterAccount',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='Twitter Account ID')),
                ('twitter_id', models.CharField(blank=True, max_length=255, null=True)),
                ('name', models.CharField(blank=True, max_length=100, null=True)),
                ('user_name', models.CharField(blank=True, max_length=100, null=True)),
                ('access_token', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, max_length=255, null=True)),
                ('profile_image_url', models.CharField(blank=True, max_length=255, null=True)),
                ('followers_count', models.IntegerField(blank=True, null=True)),
                ('following_count', models.IntegerField(blank=True, null=True)),
                ('tweet_count', models.IntegerField(blank=True, null=True)),
                ('listed_count', models.IntegerField(blank=True, null=True)),
                ('verified', models.BooleanField(blank=True, default=False, null=True)),
            ],
            options={
                'db_table': 'twitter_account',
            },
        ),
        migrations.CreateModel(
            name='BankAccount',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='Bank Account ID')),
                ('account_holder_name', models.CharField(blank=True, max_length=150, null=True)),
                ('account_number', models.CharField(blank=True, max_length=50, null=True)),
                ('bank_name', models.CharField(blank=True, max_length=100, null=True)),
                ('branch_name', models.CharField(blank=True, max_length=100, null=True)),
                ('account_type', models.CharField(blank=True, max_length=100, null=True)),
                ('is_verified', models.BooleanField(blank=True, default=True, null=True)),
                ('country', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='bank_account_country_id', to='core.country')),
                ('currency', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='bank_account_currency_id', to='core.currency')),
                ('influencer', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='bank_acc_influencer_id', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'bank_account',
            },
        ),
        migrations.CreateModel(
            name='AccountCategory',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='Account Category ID')),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='cat_category_master_id', to='accounts.categorymaster')),
                ('twitter_account', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='cat_twitter_account_id', to='accounts.twitteraccount')),
            ],
            options={
                'db_table': 'account_category',
            },
        ),
        migrations.AddField(
            model_name='user',
            name='role',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_role_id', to='accounts.role'),
        ),
        migrations.AddField(
            model_name='user',
            name='twitter_account',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_twitter_account_id', to='accounts.twitteraccount'),
        ),
        migrations.AddField(
            model_name='user',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions'),
        ),
    ]
