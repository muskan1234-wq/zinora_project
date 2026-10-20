from django.urls import path
from .views import AdminOrdersView

urlpatterns = [
    path("admin/", AdminOrdersView.as_view(), name="admin-orders"),
    path("admin/<int:pk>/", AdminOrdersView.as_view(), name="admin-order-detail"),
]