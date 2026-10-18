
from decimal import Decimal

from django.db.models import Sum

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from .models import Payment


class AdminPaymentsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Only admin users can access payment records.
        if not (
            request.user.is_staff
            or getattr(request.user, "role", "") == "ADMIN"
        ):
            return Response(
                {"detail": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        payments = (
            Payment.objects
            .select_related("order")
            .order_by("-created_at")
        )

        results = []

        for payment in payments:
            order = payment.order
            customer = getattr(order, "customer", None)

            customer_name = ""

            if customer:
                customer_name = (
                    customer.get_full_name()
                    or getattr(customer, "username", "")
                )

            results.append({
                "id": payment.id,
                "payment_id": payment.payment_id,
                "order_id": order.pk,
                "order_number": str(order),
                "customer_name": customer_name,
                "amount": str(payment.amount),
                "payment_method": payment.payment_method,
                "status": payment.status,
                "transaction_id": payment.transaction_id or "",
                "created_at": payment.created_at.isoformat(),
                "updated_at": payment.updated_at.isoformat(),
            })

        total_amount = (
            Payment.objects
            .filter(status="SUCCESS")
            .aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )

        return Response({
            "count": len(results),
            "total_successful_amount": str(total_amount),
            "results": results,
        })
