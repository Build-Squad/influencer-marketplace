from django.db import models
import uuid
from accounts.models import User
from django.db.models import SET_NULL

# Create your models here.

class RewardTypes(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="User Referral ID",
        default=uuid.uuid4,
        editable=False,
    )
    name=models.CharField(max_length=255, blank=True, null=True)
    class Meta:
        db_table = "reward_types"

    def __str__(self):
        return self.name
    
class RewardConfig(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="User Referral ID",
        default=uuid.uuid4,
        editable=False,
    )
    count=models.IntegerField(default=1, blank=True, null=True)
    type=models.CharField(max_length=255, blank=True, null=True)
    reward_point=models.IntegerField(blank=True, null=True)
    reward_type=models.ForeignKey(RewardTypes, related_name="reward_config_reward_type",on_delete=SET_NULL, null=True, blank=True)

    class Meta:
        db_table = "reward_config"

    def __str__(self):
        return f"{self.count} number of {self.type} of master type {self.reward_type.name}"
    
class RewardPoints(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="User Referral ID",
        default=uuid.uuid4,
        editable=False,
    )
    user_account = models.ForeignKey(
        User,
        related_name="reward_point_user_account",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    points=models.IntegerField(blank=True, null=True)
    reward_configuration=models.ForeignKey(RewardConfig, related_name="reward_point_reward_config",on_delete=SET_NULL, null=True, blank=True)
    class Meta:
        db_table = "reward_points"

class UserReferrals(models.Model):
    id = models.UUIDField(
        primary_key=True,
        verbose_name="User Referral ID",
        default=uuid.uuid4,
        editable=False,
    )
    user_account = models.ForeignKey(
        User,
        related_name="referral_user_account",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    referred_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='referred_by_account')

    # The one who's referral code was used
    referred_by_reward_point = models.ForeignKey(
        RewardPoints,
        related_name="user_referral_reward_point",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    class Meta:
        db_table = "user_referrals"

    def __str__(self):
        return f"{self.user_account.username} referrals"
