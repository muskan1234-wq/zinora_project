
from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    AdminDashboardView,
    CustomerDashboardView,
    AdminCustomersView,
    AdminProfileView,
    AdminChangePasswordView,
)

urlpatterns = [
    # Customer registration
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    # Login
    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),

    # Admin dashboard
    path(
        "admin-dashboard/",
        AdminDashboardView.as_view(),
        name="admin-dashboard",
    ),

    # Customer dashboard
    path(
        "customer-dashboard/",
        CustomerDashboardView.as_view(),
        name="customer-dashboard",
    ),

    # Admin profile: fetch and update profile
    path(
        "profile/",
        AdminProfileView.as_view(),
        name="admin-profile",
    ),

    # Admin change password
    path(
        "change-password/",
        AdminChangePasswordView.as_view(),
        name="admin-change-password",
    ),

    # Get all customers
    path(
        "admin/customers/",
        AdminCustomersView.as_view(),
        name="admin-customers",
    ),

    # Update a specific customer's status
    path(
        "admin/customers/<int:pk>/",
        AdminCustomersView.as_view(),
        name="admin-customer-detail",
    ),
]
