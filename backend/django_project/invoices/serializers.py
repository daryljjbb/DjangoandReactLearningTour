from rest_framework import serializers
from django.db.models import Sum
from django.contrib.auth.models import User
from .models import Invoice,Payment,Profile,Customer


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


class PaymentSerializer(serializers.ModelSerializer):
    # Converts Payment model to JSON and JSON back to model
    class Meta:
        model = Payment
        fields = '__all__'


class InvoiceSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    balance_due = serializers.SerializerMethodField()
    # Converts Invoice model to JSON and JSON back to model
    class Meta:
        model = Invoice
        fields = '__all__'  # include all fields from the model


    def get_balance_due(self, obj):
        total_paid = obj.payments.aggregate(total=Sum("amount"))["total"] or 0
        return obj.total_amount - total_paid



class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"



    



class UserProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "avatar_url"]

    def get_avatar_url(self, obj):
        if hasattr(obj, "profile") and obj.profile.avatar:
            return obj.profile.avatar.url
        return None



class AvatarUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["avatar"]
