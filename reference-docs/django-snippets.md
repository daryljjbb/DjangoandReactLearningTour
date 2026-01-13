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

class Payment(models.Model):
    # Link each payment to a specific invoice
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    # Amount paid in this transaction
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    # Optional note (e.g., "Paid via credit card", "Insurance payment")
    note = models.CharField(max_length=255, blank=True, null=True)

    # Timestamp of the payment
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment of ${self.amount} for Invoice #{self.invoice.id}"



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


class PaymentListCreateView(APIView):
    # GET: return all payments
    def get(self, request):
        payments = Payment.objects.all().order_by('-created_at')
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

    # POST: create a new payment
    def post(self, request):
        serializer = PaymentSerializer(data=request.data)

        if serializer.is_valid():
            payment = serializer.save()

            # Optional: auto-update invoice status
            update_status_if_paid(payment.invoice)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentDetailView(APIView):
    # Helper to get payment or return None
    def get_object(self, pk):
        try:
            return Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return None

    # GET: return a single payment
    def get(self, request, pk):
        payment = self.get_object(pk)
        if not payment:
            return Response({"error": "Payment not found"}, status=404)

        serializer = PaymentSerializer(payment)
        return Response(serializer.data)

    # PUT: update payment
    def put(self, request, pk):
        payment = self.get_object(pk)
        if not payment:
            return Response({"error": "Payment not found"}, status=404)

        serializer = PaymentSerializer(payment, data=request.data)
        if serializer.is_valid():
            updated_payment = serializer.save()

            # Optional: re-evaluate invoice status
            update_status_if_paid(updated_payment.invoice)

            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    # DELETE: delete payment
    def delete(self, request, pk):
        payment = self.get_object(pk)
        if not payment:
            return Response({"error": "Payment not found"}, status=404)

        invoice = payment.invoice
        payment.delete()

        # Optional: recalc invoice status after deletion
        update_status_if_paid(invoice)

        return Response(status=204)


# serializers.py

from rest_framework import serializers
from .models import Invoice

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


#invoices/urls.py

from django.urls import path
from .views import (
    InvoiceListCreateView, InvoiceDetailView,
    PaymentListCreateView, PaymentDetailView
)

urlpatterns = [
    # Invoice endpoints
    path('invoices/', InvoiceListCreateView.as_view()),
    path('invoices/<int:pk>/', InvoiceDetailView.as_view()),

    # Payment endpoints
    path('payments/', PaymentListCreateView.as_view()),
    path('payments/<int:pk>/', PaymentDetailView.as_view()),
]



# django_project/urls.py

from django.urls import path, include

urlpatterns = [
    path('api/', include('invoices.urls')),
]

# Django Query Snippets for Reference

#🔍 1. Get All Invoices

# Get every invoice in the database
invoices = Invoice.objects.all()

#🔍 2. Order Invoices (Newest First)

# Sort invoices by creation date (newest first)
invoices = Invoice.objects.order_by('-created_at')

#🔍 3. Filter by Status

# Get only unpaid invoices
unpaid = Invoice.objects.filter(status="unpaid")

# Get only paid invoices
paid = Invoice.objects.filter(status="paid")

# Get overdue invoices
overdue = Invoice.objects.filter(status="overdue")

#🔎 4. Filter by Customer Name

# Get invoices for a specific customer
john_invoices = Invoice.objects.filter(customer_name="John Doe")

#🔍 5. Case‑Insensitive Search

# Search customer names that contain "john" (case-insensitive)
results = Invoice.objects.filter(customer_name__icontains="john")

# 🔢 6. Count Records

# Count all invoices
total_invoices = Invoice.objects.count()

# Count unpaid invoices
unpaid_count = Invoice.objects.filter(status="unpaid").count()


#💰 7. Sum Amounts (Perfect for Dashboards)
from django.db.models import Sum

# Total revenue from all invoices
total_amount = Invoice.objects.aggregate(Sum('amount'))['amount__sum']

# Total unpaid amount
unpaid_total = Invoice.objects.filter(status="unpaid").aggregate(Sum('amount'))['amount__sum']

#📊 8. Group by Month (Monthly Revenue)

from django.db.models.functions import TruncMonth

# Sum of invoice amounts grouped by month
monthly = (
    Invoice.objects
    .annotate(month=TruncMonth('created_at'))
    .values('month')
    .annotate(total=Sum('amount'))
    .order_by('month')
)

#⏳ 9. Filter by Date Range

from datetime import datetime, timedelta

# Invoices created in the last 30 days
last_30_days = Invoice.objects.filter(
    created_at__gte=datetime.now() - timedelta(days=30)
)

#🔥 10. Detect Overdue Invoices (Business Logic)

# Get invoices marked as unpaid AND older than 30 days
from datetime import datetime, timedelta

overdue = Invoice.objects.filter(
    status="unpaid",
    created_at__lte=datetime.now() - timedelta(days=30)
)

#💳 11. Remaining Balance (If You Add Payments Later)
#(You’ll use this when we build the Payments model.)

from django.db.models import Sum

# Total payments made toward an invoice
paid_amount = Payment.objects.filter(invoice=invoice).aggregate(
    Sum('amount')
)['amount__sum'] or 0

# Remaining balance
remaining = invoice.amount - paid_amount

#🧠 12. Check for Overpayment

if paid_amount > invoice.amount:
    print("Overpayment detected")


#📈 13. Dashboard Summary Example

dashboard = {
    "total_invoices": Invoice.objects.count(),
    "paid": Invoice.objects.filter(status="paid").count(),
    "unpaid": Invoice.objects.filter(status="unpaid").count(),
    "overdue": Invoice.objects.filter(status="overdue").count(),
    "total_revenue": Invoice.objects.aggregate(Sum('amount'))['amount__sum'],
}


#🧠 📘 Django Business Logic Snippets

#💳 1. Calculate Remaining Balance for an Invoice
# This assumes you will eventually add a Payment model. Even before that, the pattern is worth saving.

from django.db.models import Sum

def get_remaining_balance(invoice):
    # Total payments made toward this invoice
    paid_amount = (
        Payment.objects.filter(invoice=invoice)
        .aggregate(Sum('amount'))['amount__sum'] or 0
    )

    # Remaining balance
    return invoice.amount - paid_amount


# 💰 2. Detect Overpayment

def is_overpaid(invoice):
    paid_amount = (
        Payment.objects.filter(invoice=invoice)
        .aggregate(Sum('amount'))['amount__sum'] or 0
    )
    return paid_amount > invoice.amount

# 🔥 3. Detect Overdue Invoices (30‑day rule)

from datetime import datetime, timedelta

def get_overdue_invoices():
    thirty_days_ago = datetime.now() - timedelta(days=30)

    return Invoice.objects.filter(
        status="unpaid",
        created_at__lte=thirty_days_ago
    )


# 📅 4. Mark Invoice as Overdue Automatically

def update_invoice_status(invoice):
    from datetime import datetime, timedelta

    if invoice.status == "paid":
        return  # no need to update

    if invoice.created_at <= datetime.now() - timedelta(days=30):
        invoice.status = "overdue"
        invoice.save()


# 📊 5. Dashboard Summary Logic

from django.db.models import Sum

def get_dashboard_summary():
    return {
        "total_invoices": Invoice.objects.count(),
        "paid": Invoice.objects.filter(status="paid").count(),
        "unpaid": Invoice.objects.filter(status="unpaid").count(),
        "overdue": Invoice.objects.filter(status="overdue").count(),
        "total_revenue": Invoice.objects.aggregate(Sum('amount'))['amount__sum'] or 0,
        "unpaid_total": Invoice.objects.filter(status="unpaid").aggregate(Sum('amount'))['amount__sum'] or 0,
    }


# 📈 6. Monthly Revenue Logic

from django.db.models.functions import TruncMonth

def get_monthly_revenue():
    return (
        Invoice.objects
        .annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(total=Sum('amount'))
        .order_by('month')
    )

# 🧾 7. Get Payment History for an Invoice

def get_payment_history(invoice):
    return Payment.objects.filter(invoice=invoice).order_by('-created_at')


# 🧮 8. Automatically Update Status When Paid

def update_status_if_paid(invoice):
    paid_amount = (
        Payment.objects.filter(invoice=invoice)
        .aggregate(Sum('amount'))['amount__sum'] or 0
    )

    if paid_amount >= invoice.amount:
        invoice.status = "paid"
        invoice.save()


# 📘 Payment Query Snippet Library

# 💳 1. Get All Payments for an Invoice

# Return all payments linked to a specific invoice
payments = Payment.objects.filter(invoice=invoice).order_by('-created_at')

# 💰 2. Total Amount Paid Toward an Invoice

from django.db.models import Sum

total_paid = (
    Payment.objects.filter(invoice=invoice)
    .aggregate(Sum('amount'))['amount__sum'] or 0
)

# 🧮 3. Remaining Balance for an Invoice

remaining_balance = invoice.amount - total_paid

# 🔥 4. Detect Overpayment

is_overpaid = total_paid > invoice.amount

# 📅 5. Payment History (Newest First)

payment_history = Payment.objects.filter(invoice=invoice).order_by('-created_at')


# 📊 6. Total Payments Across All Invoices

total_payments = Payment.objects.aggregate(Sum('amount'))['amount__sum'] or 0

# 📈 7. Payments Made in the Last 30 Days

from datetime import datetime, timedelta

recent_payments = Payment.objects.filter(
    created_at__gte=datetime.now() - timedelta(days=30)
)

# 🗂 8. Payments Grouped by Month

from django.db.models.functions import TruncMonth

monthly_payments = (
    Payment.objects
    .annotate(month=TruncMonth('created_at'))
    .values('month')
    .annotate(total=Sum('amount'))
    .order_by('month')
)

# 🔗 9. Payments for All Unpaid Invoices

payments_for_unpaid = Payment.objects.filter(invoice__status="unpaid")

# 🧠 10. Auto‑Recalculate Invoice Status After Payments

def recalc_invoice_status(invoice):
    total_paid = (
        Payment.objects.filter(invoice=invoice)
        .aggregate(Sum('amount'))['amount__sum'] or 0
    )

    if total_paid >= invoice.amount:
        invoice.status = "paid"
    else:
        invoice.status = "unpaid"

    invoice.save()
