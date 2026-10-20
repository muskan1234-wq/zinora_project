from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from products.models import Order, Payment

class AdminPaymentListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def check_admin(self, request):
        user = request.user
        return (
            user.is_authenticated and (
                getattr(user, "role", None) == "ADMIN"
                or user.is_staff
                or user.is_superuser
            )
        )

    def get(self, request):
        if not self.check_admin(request):
            return Response({"error": f"Admin access required. Your role: {getattr(request.user, 'role', 'None')}"}, status=403)

        orders = Order.objects.select_related("customer").order_by('-created_at')
        data = []
        for order in orders:
            customer_name = "Customer"
            try:
                if order.customer:
                    if hasattr(order.customer, 'get_full_name') and order.customer.get_full_name():
                        customer_name = order.customer.get_full_name()
                    elif hasattr(order.customer, 'username'):
                        customer_name = order.customer.username
                    else:
                        customer_name = str(order.customer)
            except:
                pass

            # Real life status logic
            # COD + DELIVERED = PAID auto
            # ONLINE + PENDING = Payment not done yet
            payment_status = getattr(order, 'payment_status', 'PENDING')
            
            data.append({
                "id": order.id,
                "payment_id": f"PAY-{order.id}",
                "order": order.id,
                "order_number": getattr(order, 'order_number', f"ORD-{order.id}"),
                "customer": customer_name,
                "customer_name": customer_name,
                "amount": float(order.total_amount or 0),
                "payment_method": getattr(order, 'payment_method', 'COD'),
                "status": payment_status,  # PENDING / PAID / FAILED / REFUNDED
                "order_status": getattr(order, 'status', 'PLACED'),
                "transaction_id": f"TXN{order.id}",
                "created_at": order.created_at,
            })
        return Response(data)

    def patch(self, request, pk=None):
        # Real Life: Admin manually mark kar sakta hai PAID/FAILED/REFUNDED
        if not self.check_admin(request):
            return Response({"error": "Admin access required."}, status=403)

        if pk is None:
            order_id = request.data.get("order_id") or request.data.get("id")
            if not order_id:
                return Response({"error": "Order ID required"}, status=400)
            pk = order_id

        order = get_object_or_404(Order, pk=pk)
        new_status = request.data.get("status") or request.data.get("payment_status")

        if not new_status:
            return Response({"error": "Payment status required (PAID/FAILED/REFUNDED/PENDING)"}, status=400)

        new_status = str(new_status).upper()
        valid = ["PENDING", "PAID", "FAILED", "REFUNDED"]
        if new_status not in valid:
            return Response({"error": f"Invalid status. Valid: {valid}"}, status=400)

        # ===== REAL LIFE VALIDATION =====
        # ONLINE order ko bina verification ke PAID karna admin ka kaam hai
        # COD ko sirf DELIVERED ke baad hi PAID karna chahiye, par admin force kar sakta hai
        
        order.payment_status = new_status
        order.save(update_fields=["payment_status"])
        Payment.objects.filter(order=order).update(status=new_status)

        return Response({
            "message": f"Payment marked as {new_status}",
            "order_id": order.id,
            "order_number": order.order_number,
            "payment_status": new_status
        })