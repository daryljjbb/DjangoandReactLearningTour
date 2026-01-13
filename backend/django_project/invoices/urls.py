from django.urls import path
from .views import InvoiceListCreateView, InvoiceDetailView

urlpatterns = [
    path('invoices/', InvoiceListCreateView.as_view()),
    path('invoices/<int:pk>/', InvoiceDetailView.as_view()),
]
