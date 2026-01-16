## 🧾 Invoice Model (Django)

#This model represents a basic invoice that can be used in medical, student, insurance, or general business applications.  
#It includes fields for customer name, amount, status, and creation date.

#```python
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

# invoices/models.py



class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name




class Invoice(models.Model):

    STATUS_CHOICES = [
    ("unpaid", "Unpaid"),
    ("partially_paid", "Partially Paid"),
    ("paid", "Paid"),
]

    # Name of the customer (later you can replace this with a Customer model)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="invoices")
    invoice_number = models.CharField(max_length=50, unique=True)
    issue_date = models.DateField(default=timezone.now)
    due_date = models.DateField()
    is_overdue = models.BooleanField(default=False)


    # Total amount of the invoice
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    # Status of the invoice: paid, unpaid, or overdue
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="unpaid")

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






class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)

    def __str__(self):
        return self.user.username
    


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()

