from rest_framework import serializers
from .models import Invoice,Payment

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
