from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from products.models import Order
from products.serializers import OrderSerializer

class AdminOrdersView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def check_admin(self, request):
        return request.user.is_authenticated and getattr(request.user, "role", None) == "ADMIN"

    def get(self, request, pk=None):
        if not self.check_admin(request):
            return Response({"error": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)

        if pk is not None:
            order = get_object_or_404(
                Order.objects.select_related("customer", "address").prefetch_related("items"), pk=pk
            )
            return Response(OrderSerializer(order).data)

        orders = Order.objects.select_related("customer", "address").prefetch_related("items").order_by("-created_at")
        return Response({
            "count": orders.count(),
            "orders": OrderSerializer(orders, many=True).data,
        })

    def patch(self, request, pk=None):
        if not self.check_admin(request):
            return Response({"error": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)
        if pk is None:
            return Response({"error": "Order ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        order = get_object_or_404(Order, pk=pk)
        status_aliases = {"PENDING": "PLACED", "PROCESSING": "PACKED", "PLACED": "PLACED", "CONFIRMED": "CONFIRMED", "PACKED": "PACKED", "SHIPPED": "SHIPPED", "DELIVERED": "DELIVERED", "CANCELLED": "CANCELLED", "RETURNED": "RETURNED"}

        if "status" in request.data:
            requested_status = str(request.data["status"]).strip().upper()
            new_status = status_aliases.get(requested_status)
            if new_status not in dict(Order.ORDER_STATUSES):
                return Response({"error": "Invalid order status."}, status=status.HTTP_400_BAD_REQUEST)
            order.status = new_status

            # === YE 4 LINE ADD KARO - COD AUTO PAID LOGIC ===
            if new_status == "DELIVERED":
                # COD hai to Deliver hote hi Paid kar do
                if getattr(order, 'payment_method', 'COD') == 'COD':
                    order.payment_status = "PAID"
            if new_status == "CANCELLED":
                # Cancel hua to payment failed/refunded
                if order.payment_status == "PAID":
                    order.payment_status = "REFUNDED"
                else:
                    order.payment_status = "FAILED"
            # ============================================

        if "payment_status" in request.data:
            new_payment_status = str(request.data["payment_status"]).strip().upper()
            if new_payment_status not in dict(Order.PAYMENT_STATUSES):
                return Response({"error": "Invalid payment status."}, status=status.HTTP_400_BAD_REQUEST)
            order.payment_status = new_payment_status

        order.save()
        order = Order.objects.select_related("customer", "address").prefetch_related("items").get(pk=order.pk)
        return Response({"message": "Order updated successfully.", "order": OrderSerializer(order).data})
        if not self.check_admin(request):
            return Response({"error": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)
        if pk is None:
            return Response({"error": "Order ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        order = get_object_or_404(Order, pk=pk)
        status_aliases = {"PENDING": "PLACED", "PROCESSING": "PACKED", "PLACED": "PLACED", "CONFIRMED": "CONFIRMED", "PACKED": "PACKED", "SHIPPED": "SHIPPED", "DELIVERED": "DELIVERED", "CANCELLED": "CANCELLED", "RETURNED": "RETURNED"}

        if "status" in request.data:
            requested_status = str(request.data["status"]).strip().upper()
            new_status = status_aliases.get(requested_status)
            if new_status not in dict(Order.ORDER_STATUSES):
                return Response({"error": "Invalid order status."}, status=status.HTTP_400_BAD_REQUEST)
            order.status = new_status

        if "payment_status" in request.data:
            new_payment_status = str(request.data["payment_status"]).strip().upper()
            if new_payment_status not in dict(Order.PAYMENT_STATUSES):
                return Response({"error": "Invalid payment status."}, status=status.HTTP_400_BAD_REQUEST)
            order.payment_status = new_payment_status

        order.save()
        order = Order.objects.select_related("customer", "address").prefetch_related("items").get(pk=order.pk)
        return Response({"message": "Order updated successfully.", "order": OrderSerializer(order).data})