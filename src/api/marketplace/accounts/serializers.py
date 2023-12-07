from rest_framework import serializers
from .models import TwitterAccount, CategoryMaster, AccountCategory, User, BankAccount, Role


class TwitterAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = TwitterAccount
        fields = "__all__"


class CategoryMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryMaster
        fields = "__all__"


class AccountCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountCategory
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    status = serializers.CharField(read_only=True)
    joined_at = serializers.DateTimeField(read_only=True)
    last_login = serializers.DateTimeField(read_only=True)
    role = serializers.CharField(read_only=True)
    twitter_account = TwitterAccountSerializer(read_only=True)

    class Meta:
        model = User
        fields = "__all__"


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = "__all__"


class TwitterAuthSerializer(serializers.Serializer):
    role = serializers.CharField(max_length=100)


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"
