
from django.utils.text import slugify
from rest_framework import serializers
from .models import Category, Product
from .models import (
    Category,
    Product,
    Address,
    Order,
    OrderItem,
)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    image_url = serializers.SerializerMethodField()

    # Slug automatically generate hoga
    slug = serializers.SlugField(required=False)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "sku",
            "description",
            "category",
            "category_name",
            "price",
            "original_price",
            "image",
            "image_url",
            "stock_quantity",
            "is_new_arrival",
            "is_featured",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")

        if not obj.image:
            return None

        image_url = obj.image.url

        if request:
            return request.build_absolute_uri(image_url)

        return image_url

    def create(self, validated_data):
        if not validated_data.get("slug"):
            validated_data["slug"] = self.generate_unique_slug(
                validated_data.get("name", "")
            )

        return super().create(validated_data)

    def update(self, instance, validated_data):
        if not validated_data.get("slug") and "name" in validated_data:
            validated_data["slug"] = self.generate_unique_slug(
                validated_data["name"],
                instance_id=instance.id
            )

        return super().update(instance, validated_data)

    def generate_unique_slug(self, name, instance_id=None):
        base_slug = slugify(name)

        if not base_slug:
            base_slug = "product"

        slug = base_slug
        counter = 1

        while Product.objects.filter(slug=slug).exclude(
            id=instance_id
        ).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        return slug



class AddressSerializer(serializers.ModelSerializer):
    # Frontend field names ko existing database fields se map karna.
    address_line = serializers.CharField(
        source="address_line1"
    )

    landmark = serializers.CharField(
        source="address_line2",
        required=False,
        allow_blank=True,
    )

    pincode = serializers.CharField(
        source="postal_code"
    )

    class Meta:
        model = Address
        fields = [
            "id",
            "full_name",
            "phone",
            "address_line",
            "landmark",
            "city",
            "state",
            "pincode",
            "country",
            "address_type",
            "is_default",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "unit_price",
            "quantity",
            "line_total",
        ]

    def get_line_total(self, obj):
        return str(obj.unit_price * obj.quantity)


class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()
    customer_phone = serializers.SerializerMethodField()

    delivery_address = AddressSerializer(
        source="address",
        read_only=True
    )

    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "customer",
            "customer_name",
            "customer_email",
            "customer_phone",
            "delivery_address",
            "items",
            "status",
            "payment_method",
            "payment_status",
            "subtotal",
            "discount_amount",
            "shipping_amount",
            "total_amount",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "order_number",
            "customer",
            "customer_name",
            "customer_email",
            "customer_phone",
            "delivery_address",
            "items",
            "payment_method",
            "payment_status",
            "subtotal",
            "discount_amount",
            "shipping_amount",
            "total_amount",
            "created_at",
            "updated_at",
        ]

    def get_customer_name(self, obj):
        user = obj.customer
        return user.get_full_name() or user.username

    def get_customer_email(self, obj):
        return obj.customer.email or ""

    def get_customer_phone(self, obj):
        return getattr(obj.customer, "phone", "") or ""

    def validate_status(self, value):
        valid_statuses = [
            choice[0]
            for choice in Order._meta.get_field("status").choices
        ]

        if value not in valid_statuses:
            raise serializers.ValidationError(
                "Invalid order status."
            )

        return value
