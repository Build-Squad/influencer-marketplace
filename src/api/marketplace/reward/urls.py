from django.urls import path
from .views import ReferralLink, ReferralValidity, UserReferralsListView


urlpatterns = [
    path("check-referral-validity/", ReferralValidity.as_view(), name="referral-validity"),
    path("referral-link/", ReferralLink.as_view(), name="referral-link"),
    path("user-referrals/", UserReferralsListView.as_view(), name="user-referrals"),
]