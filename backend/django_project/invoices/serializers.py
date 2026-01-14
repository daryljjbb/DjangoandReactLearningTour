from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Invoice,Payment,Profile

class InvoiceSerializer(serializers.ModelSerializer):
    # Converts Invoice model to JSON and JSON back to model
    class Meta:
        model = Invoice
        fields = '__all__'  # include all fields from the model

class PaymentSerializer(serializers.ModelSerializer):
    # Converts Payment model to JSON and JSON back to model
    class Meta:
        model = Payment
        fields = '__all__'

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
