from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Invoice, Payment
from .serializers import InvoiceSerializer, PaymentSerializer, UserProfileSerializer, AvatarUploadSerializer

def get_total_paid(invoice):
    # Sum all payments linked to this invoice
    return (
        Payment.objects.filter(invoice=invoice)
        .aggregate(Sum('amount'))['amount__sum'] or 0
    )


def update_status_if_paid(invoice):
    total_paid = get_total_paid(invoice)

    if total_paid >= invoice.amount:
        invoice.status = "paid"
    else:
        invoice.status = "unpaid"

    invoice.save()

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
    


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_invoices = Invoice.objects.count()
        paid = Invoice.objects.filter(status="paid").count()
        unpaid = Invoice.objects.filter(status="unpaid").count()
        overdue = Invoice.objects.filter(status="overdue").count()

        total_revenue = Invoice.objects.aggregate(Sum('amount'))['amount__sum'] or 0
        unpaid_total = Invoice.objects.filter(status="unpaid").aggregate(Sum('amount'))['amount__sum'] or 0
        total_payments = Payment.objects.aggregate(Sum('amount'))['amount__sum'] or 0

        return Response({
            "total_invoices": total_invoices,
            "paid": paid,
            "unpaid": unpaid,
            "overdue": overdue,
            "total_revenue": total_revenue,
            "unpaid_total": unpaid_total,
            "total_payments_collected": total_payments,
        })



class MonthlyRevenueView(APIView):
    def get(self, request):
        data = (
            Invoice.objects
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(total=Sum('amount'))
            .order_by('month')
        )

        return Response(data)

class MonthlyPaymentsView(APIView):
    def get(self, request):
        data = (
            Payment.objects
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(total=Sum('amount'))
            .order_by('month')
        )

        return Response(data)


from datetime import datetime, timedelta

class OverdueInvoicesView(APIView):
    def get(self, request):
        thirty_days_ago = datetime.now() - timedelta(days=30)

        overdue = Invoice.objects.filter(
            status="unpaid",
            created_at__lte=thirty_days_ago
        )

        serializer = InvoiceSerializer(overdue, many=True)
        return Response(serializer.data)




class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Protected summary data"})






class UserProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        request.user.profile.refresh_from_db()
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)





class AvatarUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request):
        profile = request.user.profile
        serializer = AvatarUploadSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            profile.refresh_from_db()
            return Response({"avatar_url": profile.avatar.url})

        return Response(serializer.errors, status=400)

