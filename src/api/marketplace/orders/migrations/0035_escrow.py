# Generated by Django 4.2.7 on 2024-03-06 11:36

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0020_user_login_method"),
        ("orders", "0034_alter_order_status"),
    ]

    operations = [
        migrations.CreateModel(
            name="Escrow",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        verbose_name="Escrow",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("new", "new"),
                            ("cancelled", "cancelled"),
                            ("delivered", "delivered"),
                        ],
                        default="new",
                        max_length=50,
                    ),
                ),
                (
                    "business_wallet",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="escrow_from_wallet",
                        to="accounts.wallet",
                    ),
                ),
                (
                    "influencer_wallet",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="escrow_to_wallet",
                        to="accounts.wallet",
                    ),
                ),
                (
                    "order",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="escrow_order_id",
                        to="orders.order",
                    ),
                ),
            ],
            options={
                "db_table": "escrow",
            },
        ),
    ]