from django.db import models
import uuid
from django.db.models import SET_NULL
from accounts.models import User
from core.models import Currency

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
        related_name="referral_user_account",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    referred_by = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='referred_by_account')

    class Meta:
        db_table = "user_referrals"

    def __str__(self):
        return f"{self.user_account.username} referrals"
    

class ReferralRewardsMaster(models.Model):
    TYPE_CHOICES = (
        ('comission', 'comission'),
        ('discount', 'discount')
    )
    id = models.UUIDField(
        primary_key=True,
        verbose_name="User Referral Rewards ID",
        default=uuid.uuid4,
        editable=False,
    )
    # type, percentage, deleted, created_at, deleted_at
    type = models.CharField(choices=TYPE_CHOICES,
                            max_length=50, default='service')
    percentage = models.DecimalField(
        max_digits=6, decimal_places=3, blank=True, null=True)
    deleted = models.BooleanField(default=False, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "referral_rewards_master"

    def __str__(self):
        return f"{self.type} type"

class UserReferralRewards(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="User Referral Rewards ID",
        default=uuid.uuid4,
        editable=False,
    )
    user_account = models.OneToOneField(
        User,
        related_name="reward_user_account",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    type=models.OneToOneField(
        ReferralRewardsMaster,
        related_name="reward_referral_referral_master_type",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    amount = models.DecimalField(
        max_digits=10, decimal_places=5, blank=True, null=True)
    is_claimed = models.BooleanField(default=False, blank=True, null=True)
    currency = models.ForeignKey(
        Currency, related_name="reward_bank_account_currency", on_delete=SET_NULL, null=True
    )

    class Meta:
        db_table = "user_referrals_rewards"

    def __str__(self):
        return f"{self.user_account.username} reward of type{self.type.type}"
