from django.urls import path
from .views import (
    InvoiceListCreateView,
    PaymentListCreateView, PaymentDetailView,
    DashboardSummaryView, MonthlyRevenueView, MonthlyPaymentsView, OverdueInvoicesView,
    UserProfileUpdateView, AvatarUploadView, AvatarDeleteView, ChangePasswordView,
    CustomerListCreateView, CustomerRetrieveUpdateDeleteView, InvoiceRetrieveUpdateDeleteView, CustomerInvoiceListView
)

urlpatterns = [

    path("customers/", CustomerListCreateView.as_view(), name="customer-list"),
    path("customers/<int:pk>/", CustomerRetrieveUpdateDeleteView.as_view(), name="customer-detail"),
    path("customers/<int:pk>/invoices/", CustomerInvoiceListView.as_view()),

    
    # Invoice endpoints
    path("invoices/", InvoiceListCreateView.as_view()),
    path("invoices/<int:pk>/", InvoiceRetrieveUpdateDeleteView.as_view(), name="invoice-detail"),

    # Payment endpoints
    path("payments/", PaymentListCreateView.as_view()),
    path("payments/<int:pk>/", PaymentDetailView.as_view()),

    # Profile + Avatar
    path("user/profile/", UserProfileUpdateView.as_view()),
    path("user/avatar/", AvatarUploadView.as_view()),
    path("user/avatar/delete/", AvatarDeleteView.as_view(), name="avatar-delete"),
    path("user/change-password/", ChangePasswordView.as_view(), name="change-password"),



    # Dashboard endpoints
    path("dashboard/summary/", DashboardSummaryView.as_view()),
    path("dashboard/monthly-revenue/", MonthlyRevenueView.as_view()),
    path("dashboard/monthly-payments/", MonthlyPaymentsView.as_view()),
    path("dashboard/overdue/", OverdueInvoicesView.as_view()),
]

