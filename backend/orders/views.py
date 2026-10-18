
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from .models import Order
from .serializers import OrderSerializer


class AdminOrdersView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def check_admin(self, request):
        user = request.user

        return (
            user.is_authenticated
            and user.is_staff
            and getattr(user, "role", None) == "ADMIN"
        )

    def get(self, request, pk=None):

        if not self.check_admin(request):
            return Response(
                {"error": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if pk is not None:
            order = get_object_or_404(Order, pk=pk)

            serializer = OrderSerializer(order)

            return Response(serializer.data)

        orders = Order.objects.select_related(
            "customer"
        ).all()

        serializer = OrderSerializer(
            orders,
            many=True,
        )

        return Response({
            "count": orders.count(),
            "orders": serializer.data,
        })

    def patch(self, request, pk=None):

        if not self.check_admin(request):
            return Response(
                {"error": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if pk is None:
            return Response(
                {"error": "Order ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order = get_object_or_404(Order, pk=pk)

        allowed_fields = {
            "status",
            "payment_status",
        }

        if not request.data:
            return Response(
                {"error": "No update data provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        unexpected_fields = (
            set(request.data.keys()) - allowed_fields
        )

        if unexpected_fields:
            return Response(
                {
                    "error": (
                        "Only status and payment_status "
                        "can be updated."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_status = request.data.get("status")
        new_payment_status = request.data.get(
            "payment_status"
        )

        if new_status is not None:
            valid_statuses = dict(
                Order.STATUS_CHOICES
            )

            if new_status not in valid_statuses:
                return Response(
                    {"error": "Invalid order status."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            order.status = new_status

        if new_payment_status is not None:
            valid_payment_statuses = dict(
                Order.PAYMENT_STATUS_CHOICES
            )

            if (
                new_payment_status
                not in valid_payment_statuses
            ):
                return Response(
                    {"error": "Invalid payment status."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            order.payment_status = new_payment_status

        order.save()

        serializer = OrderSerializer(order)

        return Response({
            "message": "Order updated successfully.",
            **serializer.data,
        })
