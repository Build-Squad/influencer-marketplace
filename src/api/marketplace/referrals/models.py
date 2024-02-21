from django.db import models
import uuid

from accounts.models import User

# Create your models here.


class UserReferrals(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="User Referral ID",
        default=uuid.uuid4,
        editable=False,
    )
    user_account = models.OneToOneField(
        User,
        related_name="user_account",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    referred_by = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='referred_by_account')

    class Meta:
        db_table = "user_referrals"

    def __str__(self):
        return f"{self.user_account.username} referrals"