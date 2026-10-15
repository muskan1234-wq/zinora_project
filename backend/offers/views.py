
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Offer
from .serializers import OfferSerializer


class OfferListView(generics.ListAPIView):
    serializer_class = OfferSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Offer.objects.filter(is_active=True)
