from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Invoice, Payment
from .serializers import InvoiceSerializer, PaymentSerializer

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
