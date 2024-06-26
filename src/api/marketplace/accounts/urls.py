from django.urls import path
from .views import (
    AccountRegionList,
    BookmarkDetailView,
    BookmarkView,
    OTPAuth,
    OTPAuthV2,
    OTPVerification,
    OTPVerifyV2,
    TopInfluencers,
    TwitterAccountList,
    TwitterAccountDetail,
    CategoryMasterList,
    CategoryMasterDetail,
    AccountCategoryList,
    AccountCategoryDetail,
    TwitterPromotionView,
    UserList,
    UserDetail,
    BankAccountList,
    BankAccountDetail,
    TwitterAuth,
    RoleList,
    RoleDetail,
    UserAuth,
    EmailVerification,
    WalletAuth,
    WalletConnect,
    WalletDetail,
    WalletList,
    BusinessAccountMetaDataDetail,
    WalletNonceCreateView, 
    DisconnectTwitterAccount
)

urlpatterns = [
    path("", UserAuth.as_view(), name="user-auth"),

    path("role/", RoleList.as_view(), name="role-list"),
    path("role/<uuid:pk>/", RoleDetail.as_view(), name="role-detail"),

    path("twitter-auth/", TwitterAuth.as_view(), name="twitter-auth"),

    path("twitter-account/", TwitterAccountList.as_view(), name="twitter-account-list"),
    path("twitter-account/<uuid:pk>/", TwitterAccountDetail.as_view(), name="twitter-account-detail"),
    path("disconnect-twitter-account/<uuid:pk>/", DisconnectTwitterAccount.as_view(), name="disconnect-twitter-account"),


    path("category-master/", CategoryMasterList.as_view(), name="category-master-list"),
    path("category-master/<uuid:pk>/", CategoryMasterDetail.as_view(), name="category-master-detail"),


    path("account-category/", AccountCategoryList.as_view(), name="account-category-list"),
    path("account-category/<uuid:pk>/", AccountCategoryDetail.as_view(), name="account-category-detail"),


    path("account-region/", AccountRegionList.as_view(), name="account-region-list"),


    path("user/", UserList.as_view(), name="user-list"),
    path("user/<uuid:pk>/", UserDetail.as_view(), name="user-detail"),



    path("business-meta-data/<uuid:userId>/", BusinessAccountMetaDataDetail.as_view(), name="business-account-meta-data-detail"),

    path("bank-account/", BankAccountList.as_view(), name="bank-account-list"),
    path("bank-account/<uuid:pk>/", BankAccountDetail.as_view(), name="bank-account-detail"),

    path("otp/", OTPAuth.as_view(), name="otp-auth"),
    path("otp/verify/", OTPVerification.as_view(), name="otp-verify"),
    
    path("otp/v2", OTPAuthV2.as_view(), name="otp-auth-v2"),
    path("otp/verify/v2", OTPVerifyV2.as_view(), name="otp-verify-v2" ),

    path("email-verify/", EmailVerification.as_view(), name="email-verify"),

    path("wallet-auth/", WalletAuth.as_view(), name="wallet-auth"),

    path("connect-wallet/", WalletConnect.as_view(), name="connect-wallet"),
    path("wallets/", WalletList.as_view(), name="wallets"),
    
    path("wallets/<uuid:pk>/", WalletDetail.as_view(), name="wallets-detail"),


    path("top-influencers/", TopInfluencers.as_view(), name="TopInfluencers"),

    path("wallet-create/", WalletNonceCreateView.as_view(),
         name="wallet-nonce-create"),

    path("bookmarks/", BookmarkView.as_view(), name="bookmarks"),
    path("bookmarks/<uuid:pk>/", BookmarkDetailView.as_view(),
         name="bookmark-detail"),

    path("promote-xfluencer/", TwitterPromotionView.as_view(),
         name="promote-xfluencer"),
]
