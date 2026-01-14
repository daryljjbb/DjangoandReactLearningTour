from django.urls import path
from .views import (
    InvoiceListCreateView, InvoiceDetailView,
    PaymentListCreateView, PaymentDetailView,
    DashboardSummaryView, MonthlyRevenueView, MonthlyPaymentsView, OverdueInvoicesView,
    UserProfileUpdateView, AvatarUploadView, AvatarDeleteView, ChangePasswordView
)

urlpatterns = [
    # Invoice endpoints
    path("invoices/", InvoiceListCreateView.as_view()),
    path("invoices/<int:pk>/", InvoiceDetailView.as_view()),

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

