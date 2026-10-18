
from rest_framework import serializers
from .models import Offer


class OfferSerializer(serializers.ModelSerializer):

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = [
            "id",
            "title",
            "description",
            "image",
            "image_url",
            "coupon_code",
            "discount_type",
            "discount_value",
            "minimum_order_amount",
            "start_date",
            "end_date",
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

        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)

            return obj.image.url

        return None
