
from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Public users can view active products and categories.
    Only admins can create, update, or delete them.
    """

    def has_permission(self, request, view):
        # GET, HEAD and OPTIONS requests are allowed
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

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

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
            queryset = queryset.filter(
                is_active=True,
                category__is_active=True,
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()
import uuid
from decimal import Decimal

from django.db import transaction
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Address,
    Product,
    Order,
    OrderItem,
    Payment,
    Notification,
    StoreSettings,
)

from .serializers import AddressSerializer, OrderSerializer

class CustomerAddressAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk is not None:
            address = get_object_or_404(
                Address,
                pk=pk,
                customer=request.user,
            )
            return Response(AddressSerializer(address).data)

        addresses = Address.objects.filter(
            customer=request.user
        ).order_by("-is_default", "-created_at")

        return Response(AddressSerializer(addresses, many=True).data)

    def post(self, request, pk=None):
        serializer = AddressSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            if serializer.validated_data.get("is_default"):
                Address.objects.filter(
                    customer=request.user
                ).update(is_default=False)

            address = serializer.save(customer=request.user)

        return Response(
            AddressSerializer(address).data,
            status=status.HTTP_201_CREATED,
        )

    def put(self, request, pk=None):
        return self._update(request, pk, partial=False)

    def patch(self, request, pk=None):
        return self._update(request, pk, partial=True)

    def _update(self, request, pk, partial):
        if pk is None:
            return Response(
                {"error": "Address ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        address = get_object_or_404(
            Address,
            pk=pk,
            customer=request.user,
        )

        serializer = AddressSerializer(
            address,
            data=request.data,
            partial=partial,
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            if serializer.validated_data.get("is_default"):
                Address.objects.filter(
                    customer=request.user
                ).exclude(pk=address.pk).update(is_default=False)

            address = serializer.save()

        return Response(AddressSerializer(address).data)

    def delete(self, request, pk=None):
        if pk is None:
            return Response(
                {"error": "Address ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        address = get_object_or_404(
            Address,
            pk=pk,
            customer=request.user,
        )

        # Agar address kisi order mein use hua hai aur Order.address
        # on_delete=PROTECT hai, to Django usse delete nahi karne dega.
        try:
            address.delete()
        except Exception:
            return Response(
                {
                    "error": (
                        "This address is linked to an order and cannot "
                        "be deleted. Please keep it for order history."
                    )
                },
                status=status.HTTP_409_CONFLICT,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)

class CheckoutAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        customer = request.user
        data = request.data

        raw_items = data.get("items", [])
        address_input = data.get("address", data.get("address_id"))
        payment_method = str(
            data.get("payment_method", "COD")
        ).upper()

        if payment_method not in ["COD", "ONLINE"]:
            return Response(
                {"error": "Invalid payment method."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not isinstance(raw_items, list) or not raw_items:
            return Response(
                {"error": "Your cart is empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if address_input in [None, ""]:
            return Response(
                {"error": "Please select a delivery address."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Duplicate product entries ko combine karo.
        quantities = {}

        for item in raw_items:
            try:
                product_id = int(
                    item.get("product", item.get("id"))
                )
                quantity = int(item.get("quantity", 1))
            except (TypeError, ValueError, AttributeError):
                return Response(
                    {"error": "Invalid product or quantity."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if product_id <= 0 or quantity <= 0:
                return Response(
                    {"error": "Product ID and quantity must be positive."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            quantities[product_id] = (
                quantities.get(product_id, 0) + quantity
            )

        try:
            with transaction.atomic():

                # Address ID diya ho to verify karo ki address isi
                # logged-in customer ka hai.
                if isinstance(address_input, dict):
                    address_id = address_input.get("id")

                    if address_id:
                        address = get_object_or_404(
                            Address.objects.select_for_update(),
                            pk=address_id,
                            customer=customer,
                        )
                    else:
                        address_serializer = AddressSerializer(
                            data=address_input
                        )

                        if not address_serializer.is_valid():
                            return Response(
                                {
                                    "error": "Invalid delivery address.",
                                    "details": address_serializer.errors,
                                },
                                status=status.HTTP_400_BAD_REQUEST,
                            )

                        address = address_serializer.save(
                            customer=customer
                        )
                else:
                    try:
                        address_id = int(address_input)
                    except (TypeError, ValueError):
                        return Response(
                            {"error": "Invalid address ID."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    address = get_object_or_404(
                        Address.objects.select_for_update(),
                        pk=address_id,
                        customer=customer,
                    )

                order_products = []
                subtotal = Decimal("0.00")

                # Lock and verify products and stock.
                for product_id, quantity in quantities.items():
                    try:
                        product = Product.objects.select_for_update().get(
                            pk=product_id,
                            is_active=True,
                        )
                    except Product.DoesNotExist:
                        return Response(
                            {
                                "error": (
                                    f"Product ID {product_id} is unavailable."
                                )
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    if product.stock_quantity < quantity:
                        return Response(
                            {
                                "error": (
                                    f"Insufficient stock for {product.name}. "
                                    f"Available: {product.stock_quantity}"
                                )
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    line_total = product.price * quantity
                    subtotal += line_total

                    order_products.append(
                        (product, quantity)
                    )

                # Existing store settings use a free-shipping threshold.
                settings_obj = StoreSettings.objects.first()
                free_threshold = (
                    settings_obj.free_shipping_minimum
                    if settings_obj
                    else Decimal("999.00")
                )

                shipping_amount = (
                    Decimal("0.00")
                    if subtotal >= free_threshold
                    else Decimal("99.00")
                )

                discount_amount = Decimal("0.00")
                total_amount = (
                    subtotal + shipping_amount - discount_amount
                )

                order = Order.objects.create(
                    order_number=(
                        "ZIN-" + timezone.now().strftime("%Y%m%d") +
                        "-" + uuid.uuid4().hex[:8].upper()
                    ),
                    customer=customer,
                    address=address,
                    status="PLACED",
                    payment_method=payment_method,
                    payment_status="PENDING",
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

                    # Stock ko database mein update karo.
                    Product.objects.filter(
                        pk=product.pk
                    ).update(
                        stock_quantity=F("stock_quantity") - quantity
                    )

                Payment.objects.create(
                    order=order,
                    method=payment_method,
                    amount=total_amount,
                    status="PENDING",
                )

                # New order aane par admin notification save karo.
                Notification.objects.create(
                    recipient=None,
                    title="New Order Received",
                    message=(
                        f"Order {order.order_number} was placed by "
                        f"{customer.get_full_name() or customer.username}. "
                        f"Total: ₹{total_amount}"
                    ),
                )

                order = (
                    Order.objects
                    .select_related("customer", "address")
                    .prefetch_related("items")
                    .get(pk=order.pk)
                )

                return Response(
                    {
                        "message": "Order placed successfully.",
                        "order": OrderSerializer(order).data,
                    },
                    status=status.HTTP_201_CREATED,
                )

        except Exception as exc:
            # Server-side log mein actual error dekha ja sakta hai.
            import logging
            logging.getLogger(__name__).exception(
                "Checkout failed"
            )

            return Response(
                {"error": "Unable to place order. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class CustomerOrdersAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = (
            Order.objects
            .filter(customer=request.user)
            .select_related("customer", "address")
            .prefetch_related("items")
            .order_by("-created_at")
        )

        serializer = OrderSerializer(orders, many=True)

        return Response({
            "count": orders.count(),
            "orders": serializer.data,
        })
class AdminNotificationsAPIView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def check_admin(self, request):
        return (
            request.user.is_authenticated
            and getattr(request.user, "role", None) == "ADMIN"
        )

    def get(self, request):
        if not self.check_admin(request):
            return Response(
                {"error": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        notifications = Notification.objects.filter(
            recipient__isnull=True
        ).order_by("-created_at")

        return Response({
            "count": notifications.count(),
            "unread_count": notifications.filter(
                is_read=False
            ).count(),
            "notifications": [
                {
                    "id": item.id,
                    "title": item.title,
                    "message": item.message,
                    "is_read": item.is_read,
                    "created_at": item.created_at,
                }
                for item in notifications[:100]
            ],
        })

    def patch(self, request, pk=None):
        if not self.check_admin(request):
            return Response(
                {"error": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if pk is None:
            return Response(
                {"error": "Notification ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        notification = get_object_or_404(
            Notification,
            pk=pk,
            recipient__isnull=True,
        )

        notification.is_read = True
        notification.save(update_fields=["is_read"])

        return Response({
            "message": "Notification marked as read.",
            "id": notification.id,
            "is_read": notification.is_read,
        })
        
class AdminOrdersAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def check_admin(self, request):
        user = request.user
        return (
            getattr(user, "role", None) == "ADMIN"
            or user.is_staff
            or user.is_superuser
        )

    def get(self, request):
        if not self.check_admin(request):
            return Response(
                {"error": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        orders = (
            Order.objects
            .select_related("customer", "address")
            .prefetch_related("items")
            .order_by("-created_at")
        )

        serializer = OrderSerializer(
            orders,
            many=True,
            context={"request": request},
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

        new_status = request.data.get("status")

        if not new_status:
            return Response(
                {"error": "Status is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        valid_statuses = [
            choice[0]
            for choice in Order._meta.get_field("status").choices
        ]

        if new_status not in valid_statuses:
            return Response(
                {
                    "error": "Invalid order status.",
                    "valid_statuses": valid_statuses,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = new_status
        order.save(update_fields=["status"])

        order = (
            Order.objects
            .select_related("customer", "address")
            .prefetch_related("items")
            .get(pk=order.pk)
        )

        serializer = OrderSerializer(
            order,
            context={"request": request},
        )

        return Response({
            "message": "Order status updated successfully.",
            **serializer.data,
        })
class CustomerChatMessageAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        customer = request.user

        order_id = str(
            request.data.get("order_id", "")
        ).strip()

        message = str(
            request.data.get("message", "")
        ).strip()

        if not order_id:
            return Response(
                {"error": "Order ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not message:
            return Response(
                {"error": "Message is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(message) > 2000:
            return Response(
                {"error": "Message cannot exceed 2000 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify that the order belongs to this customer.
        order = Order.objects.filter(
            customer=customer,
            order_number=order_id,
        ).first()

        # Also allow the database order ID if supplied.
        if order is None and order_id.isdigit():
            order = Order.objects.filter(
                customer=customer,
                pk=int(order_id),
            ).first()

        if order is None:
            return Response(
                {
                    "error": (
                        "Order not found in your account. "
                        "Please check your Order ID."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        customer_name = (
            customer.get_full_name() or customer.username
        )

        Notification.objects.create(
            recipient=None,
            title="Customer Support Message",
            message=(
                f"Customer: {customer_name}\n"
                f"Username: {customer.username}\n"
                f"Order ID: {order.order_number}\n"
                f"Message: {message}"
            ),
        )

        return Response(
            {
                "message": (
                    "Your message has been sent to the "
                    "Zinora admin team."
                ),
                "order_id": order.order_number,
            },
            status=status.HTTP_201_CREATED,
        )
