
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
