import uuid
from decimal import Decimal

from django.db import transaction
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import status, viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import (
    Category,
    Product,
    Address,
    Order,
    OrderItem,
    Payment,
    Notification,
    StoreSettings,
)
from .serializers import (
    CategorySerializer, 
    ProductSerializer,
    AddressSerializer, 
    OrderSerializer
)

# ==================== CATEGORY & PRODUCT VIEWSETS ====================

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user
        return (
            user.is_authenticated
            and (
                getattr(user, "role", "") == "ADMIN"
                or user.is_staff
                or user.is_superuser
            )
        )

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Category.objects.all()
        user = self.request.user
        is_admin = (
            user.is_authenticated
            and (
                getattr(user, "role", "") == "ADMIN"
                or user.is_staff
                or user.is_superuser
            )
        )
        if not is_admin:
            queryset = queryset.filter(is_active=True)
        return queryset

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = Product.objects.select_related("category").all()
        user = self.request.user
        is_admin = (
            user.is_authenticated
            and (
                getattr(user, "role", "") == "ADMIN"
                or user.is_staff
                or user.is_superuser
            )
        )
        if not is_admin:
            queryset = queryset.filter(is_active=True, category__is_active=True)
        return queryset

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

# ==================== CUSTOMER ADDRESS ====================

class CustomerAddressAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk is not None:
            address = get_object_or_404(Address, pk=pk, customer=request.user)
            return Response(AddressSerializer(address).data)
        addresses = Address.objects.filter(customer=request.user).order_by("-is_default", "-created_at")
        return Response(AddressSerializer(addresses, many=True).data)

    def post(self, request, pk=None):
        serializer = AddressSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            if serializer.validated_data.get("is_default"):
                Address.objects.filter(customer=request.user).update(is_default=False)
            address = serializer.save(customer=request.user)
        return Response(AddressSerializer(address).data, status=status.HTTP_201_CREATED)

    def put(self, request, pk=None):
        return self._update(request, pk, partial=False)

    def patch(self, request, pk=None):
        return self._update(request, pk, partial=True)

    def _update(self, request, pk, partial):
        if pk is None:
            return Response({"error": "Address ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        address = get_object_or_404(Address, pk=pk, customer=request.user)
        serializer = AddressSerializer(address, data=request.data, partial=partial)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            if serializer.validated_data.get("is_default"):
                Address.objects.filter(customer=request.user).exclude(pk=address.pk).update(is_default=False)
            address = serializer.save()
        return Response(AddressSerializer(address).data)

    def delete(self, request, pk=None):
        if pk is None:
            return Response({"error": "Address ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        address = get_object_or_404(Address, pk=pk, customer=request.user)
        try:
            address.delete()
        except Exception:
            return Response({"error": "This address is linked to an order and cannot be deleted."}, status=status.HTTP_409_CONFLICT)
        return Response(status=status.HTTP_204_NO_CONTENT)

# ==================== CHECKOUT - REAL LIFE LOGIC ====================

class CheckoutAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        customer = request.user
        data = request.data
        raw_items = data.get("items", [])
        address_input = data.get("address", data.get("address_id"))
        payment_method = str(data.get("payment_method", "COD")).upper()

        if payment_method not in ["COD", "ONLINE"]:
            return Response({"error": "Invalid payment method."}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(raw_items, list) or not raw_items:
            return Response({"error": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        if address_input in [None, ""]:
            return Response({"error": "Please select a delivery address."}, status=status.HTTP_400_BAD_REQUEST)

        quantities = {}
        for item in raw_items:
            try:
                product_id = int(item.get("product", item.get("id")))
                quantity = int(item.get("quantity", 1))
            except (TypeError, ValueError, AttributeError):
                return Response({"error": "Invalid product or quantity."}, status=status.HTTP_400_BAD_REQUEST)
            if product_id <= 0 or quantity <= 0:
                return Response({"error": "Product ID and quantity must be positive."}, status=status.HTTP_400_BAD_REQUEST)
            quantities[product_id] = quantities.get(product_id, 0) + quantity

        try:
            with transaction.atomic():
                if isinstance(address_input, dict):
                    address_id = address_input.get("id")
                    if address_id:
                        address = get_object_or_404(Address.objects.select_for_update(), pk=address_id, customer=customer)
                    else:
                        address_serializer = AddressSerializer(data=address_input)
                        if not address_serializer.is_valid():
                            return Response({"error": "Invalid delivery address.", "details": address_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                        address = address_serializer.save(customer=customer)
                else:
                    try:
                        address_id = int(address_input)
                    except (TypeError, ValueError):
                        return Response({"error": "Invalid address ID."}, status=status.HTTP_400_BAD_REQUEST)
                    address = get_object_or_404(Address.objects.select_for_update(), pk=address_id, customer=customer)

                order_products = []
                subtotal = Decimal("0.00")

                for product_id, quantity in quantities.items():
                    try:
                        product = Product.objects.select_for_update().get(pk=product_id, is_active=True)
                    except Product.DoesNotExist:
                        return Response({"error": f"Product ID {product_id} is unavailable."}, status=status.HTTP_400_BAD_REQUEST)

                    if product.stock_quantity < quantity:
                        return Response({"error": f"Insufficient stock for {product.name}. Available: {product.stock_quantity}"}, status=status.HTTP_400_BAD_REQUEST)

                    line_total = product.price * quantity
                    subtotal += line_total
                    order_products.append((product, quantity))

                settings_obj = StoreSettings.objects.first()
                free_threshold = settings_obj.free_shipping_minimum if settings_obj else Decimal("999.00")
                shipping_amount = Decimal("0.00") if subtotal >= free_threshold else Decimal("99.00")
                discount_amount = Decimal("0.00")
                total_amount = subtotal + shipping_amount - discount_amount

                # ===== REAL LIFE LOGIC =====
                # COD ho ya ONLINE, dono pehle PENDING rahega
                # ONLINE tabhi PAID hoga jab payment gateway success dega
                final_payment_status = "PENDING"

                order = Order.objects.create(
                    order_number=("ZIN-" + timezone.now().strftime("%Y%m%d") + "-" + uuid.uuid4().hex[:8].upper()),
                    customer=customer,
                    address=address,
                    status="PLACED",
                    payment_method=payment_method,
                    payment_status=final_payment_status,
                    subtotal=subtotal,
                    discount_amount=discount_amount,
                    shipping_amount=shipping_amount,
                    total_amount=total_amount,
                )

                for product, quantity in order_products:
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        product_name=product.name,
                        unit_price=product.price,
                        quantity=quantity,
                    )
                    Product.objects.filter(pk=product.pk).update(stock_quantity=F("stock_quantity") - quantity)

                Payment.objects.create(
                    order=order,
                    method=payment_method,
                    amount=total_amount,
                    status=final_payment_status,
                )

                Notification.objects.create(
                    recipient=None,
                    title="New Order Received",
                    message=f"Order {order.order_number} was placed by {customer.get_full_name() or customer.username}. Total: ₹{total_amount} | Method: {payment_method}",
                )

                order = Order.objects.select_related("customer", "address").prefetch_related("items").get(pk=order.pk)

                return Response({
                    "message": "Order placed successfully.",
                    "order": OrderSerializer(order).data,
                }, status=status.HTTP_201_CREATED)

        except Exception as exc:
            import logging
            logging.getLogger(__name__).exception("Checkout failed")
            return Response({"error": "Unable to place order. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ==================== PAYMENT VERIFICATION - NEW FOR ONLINE ====================

class PaymentVerifyAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk=None):
        # Customer apna payment verify karega
        if pk is None:
            order_id = request.data.get("order_id")
            if not order_id:
                return Response({"error": "Order ID required"}, status=400)
            order = get_object_or_404(Order, pk=order_id, customer=request.user)
        else:
            order = get_object_or_404(Order, pk=pk, customer=request.user)

        # Yaha pe Razorpay signature verify hota hai real project me
        # Abhi ke liye hum direct PAID kar rahe hai jab frontend success bolega
        
        payment_success = request.data.get("payment_success", True)
        transaction_id = request.data.get("transaction_id", f"TXN{order.id}{uuid.uuid4().hex[:6].upper()}")

        if payment_success:
            order.payment_status = "PAID"
            order.save(update_fields=["payment_status"])
            Payment.objects.filter(order=order).update(status="PAID", transaction_id=transaction_id)
            return Response({"message": "Payment verified successfully", "status": "PAID", "order_number": order.order_number})
        else:
            order.payment_status = "FAILED"
            order.save(update_fields=["payment_status"])
            Payment.objects.filter(order=order).update(status="FAILED")
            return Response({"message": "Payment failed", "status": "FAILED"}, status=400)

# ==================== CUSTOMER ORDERS ====================

class CustomerOrdersAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(customer=request.user).select_related("customer", "address").prefetch_related("items").order_by("-created_at")
        serializer = OrderSerializer(orders, many=True)
        return Response({"count": orders.count(), "orders": serializer.data})

# ==================== ADMIN NOTIFICATIONS ====================

class AdminNotificationsAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def check_admin(self, request):
        user = request.user
        return getattr(user, "role", None) == "ADMIN" or user.is_staff or user.is_superuser

    def get(self, request):
        if not self.check_admin(request):
            return Response({"error": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)
        notifications = Notification.objects.filter(recipient__isnull=True).order_by("-created_at")
        return Response({
            "count": notifications.count(),
            "unread_count": notifications.filter(is_read=False).count(),
            "notifications": [{"id": item.id, "title": item.title, "message": item.message, "is_read": item.is_read, "created_at": item.created_at} for item in notifications[:100]],
        })

    def patch(self, request, pk=None):
        if not self.check_admin(request):
            return Response({"error": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)
        if pk is None:
            return Response({"error": "Notification ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        notification = get_object_or_404(Notification, pk=pk, recipient__isnull=True)
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        return Response({"message": "Notification marked as read.", "id": notification.id, "is_read": notification.is_read})

# ==================== ADMIN ORDERS - REAL LIFE LOGIC ====================

class AdminOrdersAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def check_admin(self, request):
        user = request.user
        return getattr(user, "role", None) == "ADMIN" or user.is_staff or user.is_superuser

    def get(self, request):
        if not self.check_admin(request):
            return Response({"error": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)
        orders = Order.objects.select_related("customer", "address").prefetch_related("items").order_by("-created_at")
        serializer = OrderSerializer(orders, many=True, context={"request": request})
        return Response({"count": orders.count(), "orders": serializer.data})

    def patch(self, request, pk=None):
        if not self.check_admin(request):
            return Response({"error": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)
        if pk is None:
            return Response({"error": "Order ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        order = get_object_or_404(Order, pk=pk)
        new_status = request.data.get("status")
        new_payment_status = request.data.get("payment_status")

        if new_status:
            valid_statuses = [choice[0] for choice in Order._meta.get_field("status").choices]
            if new_status not in valid_statuses:
                return Response({"error": "Invalid order status.", "valid_statuses": valid_statuses}, status=status.HTTP_400_BAD_REQUEST)
            order.status = new_status

            # REAL LIFE: COD DELIVERED hone par hi PAID
            if new_status == "DELIVERED" and order.payment_method == "COD":
                order.payment_status = "PAID"
                Payment.objects.filter(order=order).update(status="PAID")
            
            # ONLINE order DELIVERED tabhi ho sakta hai jab PAID ho
            if new_status == "DELIVERED" and order.payment_method == "ONLINE" and order.payment_status != "PAID":
                return Response({"error": "Cannot deliver ONLINE order without PAID status. Please mark payment as PAID first."}, status=status.HTTP_400_BAD_REQUEST)

            if new_status == "CANCELLED":
                if order.payment_status == "PAID":
                    order.payment_status = "REFUNDED"
                    Payment.objects.filter(order=order).update(status="REFUNDED")
                else:
                    order.payment_status = "FAILED"
                    Payment.objects.filter(order=order).update(status="FAILED")

        if new_payment_status:
            valid_payment = [choice[0] for choice in Order._meta.get_field("payment_status").choices]
            if new_payment_status not in valid_payment:
                return Response({"error": "Invalid payment status."}, status=status.HTTP_400_BAD_REQUEST)
            order.payment_status = new_payment_status
            Payment.objects.filter(order=order).update(status=new_payment_status)

        order.save()
        order = Order.objects.select_related("customer", "address").prefetch_related("items").get(pk=order.pk)
        serializer = OrderSerializer(order, context={"request": request})
        return Response({"message": "Order updated successfully.", **serializer.data})

# ==================== CUSTOMER CHAT ====================

class CustomerChatMessageAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        customer = request.user
        order_id = str(request.data.get("order_id", "")).strip()
        message = str(request.data.get("message", "")).strip()

        if not order_id:
            return Response({"error": "Order ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not message:
            return Response({"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)
        if len(message) > 2000:
            return Response({"error": "Message cannot exceed 2000 characters."}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.filter(customer=customer, order_number=order_id).first()
        if order is None and order_id.isdigit():
            order = Order.objects.filter(customer=customer, pk=int(order_id)).first()

        if order is None:
            return Response({"error": "Order not found in your account."}, status=status.HTTP_404_NOT_FOUND)

        customer_name = customer.get_full_name() or customer.username
        Notification.objects.create(
            recipient=None,
            title="Customer Support Message",
            message=f"Customer: {customer_name}\nUsername: {customer.username}\nOrder ID: {order.order_number}\nMessage: {message}",
        )

        return Response({"message": "Your message has been sent to the Zinora admin team.", "order_id": order.order_number}, status=status.HTTP_201_CREATED)