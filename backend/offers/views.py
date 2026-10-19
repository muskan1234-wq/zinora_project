
from datetime import date

from django.conf import settings
from django.utils import timezone

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Offer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication


def serialize_offer(offer, request=None):
    image_url = None

    if offer.image:
        image_url = offer.image.url

        if request is not None:
            image_url = request.build_absolute_uri(image_url)

    return {
        "id": offer.id,
        "title": offer.title,
        "description": offer.description,
        "image": image_url,
        "image_url": image_url,
        "coupon_code": offer.coupon_code,
        "discount_type": offer.discount_type,
        "discount_value": str(offer.discount_value),
        "minimum_order_amount": str(
            offer.minimum_order_amount
        ),
        "start_date": offer.start_date.isoformat(),
        "end_date": offer.end_date.isoformat(),
        "is_active": offer.is_active,
        "is_currently_active": offer.is_currently_active,
        "created_at": offer.created_at.isoformat(),
        "updated_at": offer.updated_at.isoformat(),
    }


class PublicOffersView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        today = timezone.localdate()

        offers = Offer.objects.filter(
            is_active=True,
            start_date__lte=today,
            end_date__gte=today,
        ).order_by("-created_at")

        return Response({
            "count": offers.count(),
            "results": [
                serialize_offer(offer, request)
                for offer in offers
            ],
        })


class AdminOffersView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def check_admin(self, request):
        return (
            request.user.is_staff
            or getattr(request.user, "role", "") == "ADMIN"
        )

    def get(self, request):
        if not self.check_admin(request):
            return Response(
                {"detail": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        offers = Offer.objects.all().order_by("-created_at")

        return Response({
            "count": offers.count(),
            "results": [
                serialize_offer(offer, request)
                for offer in offers
            ],
        })

    def post(self, request):
        if not self.check_admin(request):
            return Response(
                {"detail": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        data = request.data

        required_fields = [
            "title",
            "coupon_code",
            "discount_type",
            "discount_value",
            "start_date",
            "end_date",
        ]

        missing = [
            field
            for field in required_fields
            if not str(data.get(field, "")).strip()
        ]

        if missing:
            return Response(
                {
                    "detail": "Required fields are missing.",
                    "fields": missing,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        coupon_code = str(
            data["coupon_code"]
        ).strip().upper()

        if Offer.objects.filter(
            coupon_code__iexact=coupon_code
        ).exists():
            return Response(
                {"detail": "Coupon code already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        discount_type = data["discount_type"]

        if discount_type not in ["PERCENTAGE", "FIXED"]:
            return Response(
                {"detail": "Invalid discount type."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            start = date.fromisoformat(str(data["start_date"]))
            end = date.fromisoformat(str(data["end_date"]))

            discount_value = float(data["discount_value"])

            minimum_order_amount = float(
                data.get("minimum_order_amount") or 0
            )

            if end < start:
                return Response(
                    {
                        "detail": (
                            "Expiry date cannot precede start date."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if discount_value <= 0 or minimum_order_amount < 0:
                raise ValueError

            if (
                discount_type == "PERCENTAGE"
                and discount_value > 100
            ):
                return Response(
                    {
                        "detail": (
                            "Percentage discount cannot exceed 100."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except (ValueError, TypeError):
            return Response(
                {
                    "detail": (
                        "Enter valid discount, amount and dates."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        offer = Offer(
            title=str(data["title"]).strip(),
            description=data.get("description", ""),
            coupon_code=coupon_code,
            discount_type=discount_type,
            discount_value=discount_value,
            minimum_order_amount=minimum_order_amount,
            start_date=start,
            end_date=end,
            is_active=str(
                data.get("is_active", "true")
            ).lower() in ["true", "1", "yes", "on"],
        )

        uploaded_image = request.FILES.get("image")

        if uploaded_image:
            if not uploaded_image.content_type.startswith("image/"):
                return Response(
                    {"detail": "Please upload a valid image."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if uploaded_image.size > 5 * 1024 * 1024:
                return Response(
                    {"detail": "Image size must not exceed 5 MB."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            offer.image = uploaded_image

        offer.save()

        return Response(
            serialize_offer(offer, request),
            status=status.HTTP_201_CREATED,
        )


class AdminOfferDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def check_admin(self, request):
        return (
            request.user.is_staff
            or getattr(request.user, "role", "") == "ADMIN"
        )

    def get_offer(self, pk):
        try:
            return Offer.objects.get(pk=pk)
        except Offer.DoesNotExist:
            return None

    def put(self, request, pk):
        return self.update_offer(request, pk)

    def patch(self, request, pk):
        return self.update_offer(request, pk)

    def update_offer(self, request, pk):
        if not self.check_admin(request):
            return Response(
                {"detail": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        offer = self.get_offer(pk)

        if offer is None:
            return Response(
                {"detail": "Offer not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        data = request.data

        fields = [
            "title",
            "description",
            "discount_type",
            "discount_value",
            "minimum_order_amount",
            "start_date",
            "end_date",
            "is_active",
        ]

        for field in fields:
            if field in data:
                value = data[field]

                if field == "title":
                    value = str(value).strip()

                elif field == "discount_value":
                    try:
                        value = float(value)
                    except (ValueError, TypeError):
                        return Response(
                            {"detail": "Invalid discount value."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                elif field == "minimum_order_amount":
                    try:
                        value = float(value)
                    except (ValueError, TypeError):
                        return Response(
                            {"detail": "Invalid minimum order amount."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                elif field == "is_active":
                    if isinstance(value, bool):
                        pass
                    else:
                        value = str(value).lower() in [
                            "true", "1", "yes", "on"
                        ]

                setattr(offer, field, value)

        if "coupon_code" in data:
            offer.coupon_code = str(
                data["coupon_code"]
            ).strip().upper()

        if not offer.title:
            return Response(
                {"detail": "Offer title cannot be empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if Offer.objects.filter(
            coupon_code__iexact=offer.coupon_code
        ).exclude(pk=offer.pk).exists():
            return Response(
                {"detail": "Coupon code already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if offer.discount_type not in ["PERCENTAGE", "FIXED"]:
            return Response(
                {"detail": "Invalid discount type."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if offer.discount_value <= 0:
            return Response(
                {"detail": "Discount value must be greater than zero."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if (
            offer.discount_type == "PERCENTAGE"
            and offer.discount_value > 100
        ):
            return Response(
                {
                    "detail": (
                        "Percentage discount cannot exceed 100."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if offer.minimum_order_amount < 0:
            return Response(
                {
                    "detail": (
                        "Minimum order amount cannot be negative."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if offer.end_date < offer.start_date:
            return Response(
                {
                    "detail": (
                        "Expiry date cannot precede start date."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        uploaded_image = request.FILES.get("image")

        if uploaded_image:
            if not uploaded_image.content_type.startswith("image/"):
                return Response(
                    {"detail": "Please upload a valid image."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if uploaded_image.size > 5 * 1024 * 1024:
                return Response(
                    {"detail": "Image size must not exceed 5 MB."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            offer.image = uploaded_image

        if str(data.get("remove_image", "")).lower() in [
            "true", "1", "yes"
        ]:
            if offer.image:
                offer.image.delete(save=False)
            offer.image = None

        offer.save()

        return Response(serialize_offer(offer, request))

    def delete(self, request, pk):
        if not self.check_admin(request):
            return Response(
                {"detail": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        offer = self.get_offer(pk)

        if offer is None:
            return Response(
                {"detail": "Offer not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if offer.image:
            offer.image.delete(save=False)

        offer.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
class CustomerProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "name": f"{user.first_name} {user.last_name}".strip(),
            "email": user.email,
            "phone": user.phone or "",
            "address": user.address or "",
        })

    def patch(self, request):
        user = request.user
        data = request.data

        allowed_fields = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "address",
        ]

        for field in allowed_fields:
            if field in data:
                value = data[field]

                if value is None:
                    value = ""

                value = str(value).strip()

                if field == "email" and value:
                    from django.core.validators import validate_email
                    from django.core.exceptions import ValidationError

                    try:
                        validate_email(value)
                    except ValidationError:
                        return Response(
                            {"error": "Please enter a valid email address."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                setattr(user, field, value)

        user.save()

        return Response({
            "message": "Profile updated successfully.",
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "name": f"{user.first_name} {user.last_name}".strip(),
            "email": user.email,
            "phone": user.phone or "",
            "address": user.address or "",
        })