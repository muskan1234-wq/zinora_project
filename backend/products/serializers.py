
from django.utils.text import slugify
from rest_framework import serializers
from .models import Category, Product


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
