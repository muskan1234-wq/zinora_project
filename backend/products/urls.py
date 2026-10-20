from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    ProductViewSet,
    CustomerAddressAPIView,
    CheckoutAPIView,
    CustomerOrdersAPIView,
    AdminNotificationsAPIView,
        AdminOrdersAPIView,
         PaymentVerifyAPIView

)

router = DefaultRouter()

router.register(
    "categories",
    CategoryViewSet,
    basename="category",
)

router.register(
    "",
    ProductViewSet,
    basename="product",
)

urlpatterns = [
    # Specific API paths router ke pehle rakhe hain.
    path(
        "addresses/",
        CustomerAddressAPIView.as_view(),
        name="customer-addresses",
    ),
    path('payment/verify/<int:pk>/', PaymentVerifyAPIView.as_view(), name='payment-verify'),
path('payment/verify/', PaymentVerifyAPIView.as_view(), name='payment-verify-general'),
    path(
        "addresses/<int:pk>/",
        CustomerAddressAPIView.as_view(),
        name="customer-address-detail",
    ),
    path(
    "orders/admin/",
    AdminOrdersAPIView.as_view(),
    name="admin-orders",
),
path(
    "orders/admin/<int:pk>/",
    AdminOrdersAPIView.as_view(),
    name="admin-order-detail",
),
    path(
        "checkout/",
        CheckoutAPIView.as_view(),
        name="checkout",
    ),
    path(
        "customer-orders/",
        CustomerOrdersAPIView.as_view(),
        name="customer-orders",
    ),
    path(
        "admin/notifications/",
        AdminNotificationsAPIView.as_view(),
        name="admin-notifications",
    ),

    path("", include(router.urls)),
]