## 🧾 Invoice Model (Django)

#This model represents a basic invoice that can be used in medical, student, insurance, or general business applications.  
#It includes fields for customer name, amount, status, and creation date.

#```python
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

