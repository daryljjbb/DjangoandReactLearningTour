# models.py

## 🧾 Invoice Model (Django)

This model represents a basic invoice that can be used in medical, student, insurance, or general business applications.  
It includes fields for customer name, amount, status, and creation date.

```python
from django.db import models

class Invoice(models.Model):
    # Name of the customer (later you can replace this with a Customer model)
    customer_name = models.CharField(max_length=255)

    # Total amount of the invoice
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    # Status of the invoice: paid, unpaid, or overdue
    status = models.CharField(
        max_length=20,
        choices=[
            ("paid", "Paid"),
            ("unpaid", "Unpaid"),
            ("overdue", "Overdue")
        ],
        default="unpaid"
    )

    # Date the invoice was created (automatically set)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Makes the invoice readable in Django admin and logs
        return f"Invoice #{self.id} - {self.customer_name}"


# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Invoice
from .serializers import InvoiceSerializer

class InvoiceListCreateView(APIView):
    # GET: return all invoices
    def get(self, request):
        invoices = Invoice.objects.all().order_by('-created_at')
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)

    # POST: create a new invoice
    def post(self, request):
        serializer = InvoiceSerializer(data=request.data)

        # Validate incoming data
        if serializer.is_valid():
            serializer.save()  # create invoice
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # If validation fails, return errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InvoiceDetailView(APIView):
    # Helper method to get invoice or return None
    def get_object(self, pk):
        try:
            return Invoice.objects.get(pk=pk)
        except Invoice.DoesNotExist:
            return None

    # GET: return a single invoice
    def get(self, request, pk):
        invoice = self.get_object(pk)
        if not invoice:
            return Response({"error": "Invoice not found"}, status=404)

        serializer = InvoiceSerializer(invoice)
        return Response(serializer.data)

    # PUT: update invoice
    def put(self, request, pk):
        invoice = self.get_object(pk)
        if not invoice:
            return Response({"error": "Invoice not found"}, status=404)

        serializer = InvoiceSerializer(invoice, data=request.data)
        if serializer.is_valid():
            serializer.save()  # update invoice
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    # DELETE: delete invoice
    def delete(self, request, pk):
        invoice = self.get_object(pk)
        if not invoice:
            return Response({"error": "Invoice not found"}, status=404)

        invoice.delete()
        return Response(status=204)


# serializers.py

from rest_framework import serializers
from .models import Invoice

class InvoiceSerializer(serializers.ModelSerializer):
    # Converts Invoice model to JSON and JSON back to model
    class Meta:
        model = Invoice
        fields = '__all__'  # include all fields from the model



#invoices/urls.py

from django.urls import path
from .views import InvoiceListCreateView, InvoiceDetailView

urlpatterns = [
    path('invoices/', InvoiceListCreateView.as_view()),
    path('invoices/<int:pk>/', InvoiceDetailView.as_view()),
]


# django_project/urls.py

from django.urls import path, include

urlpatterns = [
    path('api/', include('invoices.urls')),
]

