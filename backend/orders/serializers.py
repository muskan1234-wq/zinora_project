
from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):

    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "customer",
            "customer_name",
            "customer_email",
            "total_amount",
            "status",
            "payment_status",
            "item_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "order_number",
            "customer",
            "customer_name",
            "customer_email",
            "item_count",
            "created_at",
            "updated_at",
        ]

    def get_customer_name(self, obj):
        customer = obj.customer

        full_name = (
            f"{customer.first_name} {customer.last_name}"
        ).strip()

        return full_name or customer.username

    def get_customer_email(self, obj):
        return obj.customer.email

    def get_item_count(self, obj):
        # This model does not contain individual order items yet.
        return 0
