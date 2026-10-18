
from django.urls import path
from .views import AdminPaymentsView

urlpatterns = [
    path(
        "admin/",
        AdminPaymentsView.as_view(),
        name="admin-payments",
    ),
]
