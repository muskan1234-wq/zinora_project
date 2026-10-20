from django.urls import path
from .views import AdminPaymentListView

urlpatterns = [
    path('admin/', AdminPaymentListView.as_view(), name='admin-payments'),
    path('admin/<int:pk>/', AdminPaymentListView.as_view(), name='admin-payment-detail'),
]