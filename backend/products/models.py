from django.db import models

# Create your models here.

from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils import timezone


# ==========================================================
# 1. CATEGORY
# Admin dashboard se categories manage hongi.
# Example: Necklaces & Chokers, Earrings & Jhumkas
# ==========================================================

class Category(models.Model):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=180, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(
        upload_to="categories/",
        blank=True,
        null=True
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


# ==========================================================
# 2. PRODUCT
# Admin product add/edit/delete karega.
# Main website isi model ka data display karegi.
# ==========================================================

class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    sku = models.CharField(max_length=80, unique=True)
    description = models.TextField(blank=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products"
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))]
    )

    original_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(Decimal("0.00"))]
    )

    image = models.ImageField(
        upload_to="products/",
        blank=True,
        null=True
    )

    stock_quantity = models.PositiveIntegerField(default=0)

    is_new_arrival = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


# ==========================================================
# 3. COUPON
# Admin discount codes create aur manage karega.
# ==========================================================

class Coupon(models.Model):
    DISCOUNT_TYPES = [
        ("PERCENT", "Percentage"),
        ("FIXED", "Fixed Amount"),
    ]

    code = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255, blank=True)

    discount_type = models.CharField(
        max_length=10,
        choices=DISCOUNT_TYPES,
        default="PERCENT"
    )

    discount_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))]
    )

    minimum_order_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))]
    )

    starts_at = models.DateTimeField()
    expires_at = models.DateTimeField()

    usage_limit = models.PositiveIntegerField(
        blank=True,
        null=True
    )

    used_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code


# ==========================================================
# 4. OFFER
# Website par promotional banners/offers manage honge.
# ==========================================================

class Offer(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    image = models.ImageField(
        upload_to="offers/",
        blank=True,
        null=True
    )

    coupon = models.ForeignKey(
        Coupon,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="offers"
    )

    starts_at = models.DateTimeField()
    expires_at = models.DateTimeField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# ==========================================================
# 5. CUSTOMER ADDRESS
# Customer ke saved delivery addresses.
# ==========================================================

class Address(models.Model):
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_addresses"
    )

    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)

    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)

    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=15)
    country = models.CharField(max_length=100, default="India")

    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.city}"


# ==========================================================
# 6. CART ITEM
# Har customer ke cart ke products.
# ==========================================================

class CartItem(models.Model):
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="product_orders"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="cart_items"
    )

    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["customer", "product"],
                name="unique_customer_cart_product"
            )
        ]

    def __str__(self):
        return f"{self.customer} - {self.product}"


# ==========================================================
# 7. WISHLIST ITEM
# Customer ke favourite products.
# ==========================================================

class WishlistItem(models.Model):
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wishlist_items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="wishlist_items"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["customer", "product"],
                name="unique_customer_wishlist_product"
            )
        ]

    def __str__(self):
        return f"{self.customer} - {self.product}"


# ==========================================================
# 8. ORDER
# Customer ke orders aur tracking status.
# ==========================================================

class Order(models.Model):
    ORDER_STATUSES = [
        ("PLACED", "Placed"),
        ("CONFIRMED", "Confirmed"),
        ("PACKED", "Packed"),
        ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"),
        ("CANCELLED", "Cancelled"),
        ("RETURNED", "Returned"),
    ]

    PAYMENT_METHODS = [
        ("COD", "Cash on Delivery"),
        ("ONLINE", "Online Payment"),
    ]

    PAYMENT_STATUSES = [
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("FAILED", "Failed"),
        ("REFUNDED", "Refunded"),
    ]

    order_number = models.CharField(
        max_length=40,
        unique=True
    )

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="orders"
    )

    address = models.ForeignKey(
        Address,
        on_delete=models.PROTECT,
        related_name="orders"
    )

    status = models.CharField(
        max_length=20,
        choices=ORDER_STATUSES,
        default="PLACED"
    )

    payment_method = models.CharField(
        max_length=10,
        choices=PAYMENT_METHODS,
        default="COD"
    )

    payment_status = models.CharField(
        max_length=10,
        choices=PAYMENT_STATUSES,
        default="PENDING"
    )

    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00")
    )

    discount_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00")
    )

    shipping_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00")
    )

    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00")
    )

    coupon = models.ForeignKey(
        Coupon,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="orders"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.order_number


# ==========================================================
# 9. ORDER ITEM
# Order ke samay product name aur price ka snapshot.
# ==========================================================

class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="order_items"
    )

    product_name = models.CharField(max_length=200)

    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"


# ==========================================================
# 10. PAYMENT
# Payment gateway/COD payment records.
# ==========================================================

class Payment(models.Model):
    PAYMENT_METHODS = [
        ("COD", "Cash on Delivery"),
        ("ONLINE", "Online Payment"),
    ]

    PAYMENT_STATUSES = [
        ("PENDING", "Pending"),
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
        ("REFUNDED", "Refunded"),
    ]

    order = models.ForeignKey(
        Order,
        on_delete=models.PROTECT,
        related_name="payments"
    )

    method = models.CharField(
        max_length=10,
        choices=PAYMENT_METHODS
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    transaction_reference = models.CharField(
        max_length=200,
        blank=True
    )

    status = models.CharField(
        max_length=10,
        choices=PAYMENT_STATUSES,
        default="PENDING"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.order.order_number} - {self.status}"


# ==========================================================
# 11. INVENTORY TRANSACTION
# Stock kab aur kitna change hua uska record.
# ==========================================================

class InventoryTransaction(models.Model):
    TRANSACTION_TYPES = [
        ("IN", "Stock In"),
        ("OUT", "Stock Out"),
        ("ADJUSTMENT", "Stock Adjustment"),
    ]

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="inventory_transactions"
    )

    transaction_type = models.CharField(
        max_length=15,
        choices=TRANSACTION_TYPES
    )

    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )

    note = models.CharField(max_length=255, blank=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="inventory_transactions"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.transaction_type}"


# ==========================================================
# 12. STORE SETTINGS
# Store name, shipping aur exchange policies.
# ==========================================================

class StoreSettings(models.Model):
    store_name = models.CharField(
        max_length=150,
        default="Zinora"
    )

    support_email = models.EmailField(blank=True)
    support_phone = models.CharField(max_length=20, blank=True)

    free_shipping_minimum = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("999.00")
    )

    exchange_window_days = models.PositiveIntegerField(default=2)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.store_name


# ==========================================================
# 13. NOTIFICATION
# Admin aur customer notifications.
# ==========================================================

class Notification(models.Model):
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
        blank=True,
        null=True
    )

    title = models.CharField(max_length=200)
    message = models.TextField()

    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
