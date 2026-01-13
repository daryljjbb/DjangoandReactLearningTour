from django.urls import path
from .views import (
    InvoiceListCreateView, InvoiceDetailView,
    PaymentListCreateView, PaymentDetailView,
    DashboardSummaryView, MonthlyRevenueView, MonthlyPaymentsView, OverdueInvoicesView
)

urlpatterns = [
    # Invoice endpoints
    path('invoices/', InvoiceListCreateView.as_view()),
    path('invoices/<int:pk>/', InvoiceDetailView.as_view()),

    # Payment endpoints
    path('payments/', PaymentListCreateView.as_view()),
    path('payments/<int:pk>/', PaymentDetailView.as_view()),

    
]


urlpatterns += [
    path('dashboard/summary/', DashboardSummaryView.as_view()),
    path('dashboard/monthly-revenue/', MonthlyRevenueView.as_view()),
    path('dashboard/monthly-payments/', MonthlyPaymentsView.as_view()),
    path('dashboard/overdue/', OverdueInvoicesView.as_view()),
]

