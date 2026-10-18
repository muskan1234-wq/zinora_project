from django.urls import path

from .views import (
    PublicOffersView,
    AdminOffersView,
    AdminOfferDetailView,
)

urlpatterns = [
    path("", PublicOffersView.as_view(), name="public-offers"),
    path("admin/", AdminOffersView.as_view(), name="admin-offers"),
    path(
        "admin/<int:pk>/",
        AdminOfferDetailView.as_view(),
        name="admin-offer-detail",
    ),
]