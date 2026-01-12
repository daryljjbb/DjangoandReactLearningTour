# models.py

# Invoice model with status and amount
class Invoice(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[("paid", "Paid"), ("unpaid", "Unpaid")])
    created_at = models.DateTimeField(auto_now_add=True)

# views.py

# List all invoices
class InvoiceListView(APIView):
    def get(self, request):
        invoices = Invoice.objects.all()
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)

# serializers.py

# Convert Invoice model to JSON
class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'
