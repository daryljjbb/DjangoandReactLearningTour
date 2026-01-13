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
