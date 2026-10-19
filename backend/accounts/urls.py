
from django.urls import path
from products.views import CustomerChatMessageAPIView
from .views import (
    RegisterView,
    LoginView,
    AdminDashboardView,
    CustomerDashboardView,
    AdminCustomersView,
    AdminProfileView,
    AdminChangePasswordView,
)
from .views import CustomerProfileView
from products.views import (
    CustomerAddressAPIView,
    CustomerOrdersAPIView,
)

urlpatterns = [
    # Customer registration
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),
    path(
    "addresses/",
    CustomerAddressAPIView.as_view(),
    name="account-addresses",
),
path(
    "chat/messages/",
    CustomerChatMessageAPIView.as_view(),
    name="customer-chat-messages",
),

path(
    "addresses/<int:pk>/",
    CustomerAddressAPIView.as_view(),
    name="account-address-detail",
),

path(
    "customer/orders/",
    CustomerOrdersAPIView.as_view(),
    name="account-customer-orders",
),
path(
    "customer-profile/",
    CustomerProfileView.as_view(),
    name="customer-profile",
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
