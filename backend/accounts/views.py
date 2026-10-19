
from django.contrib.auth import (
    authenticate,
    get_user_model,
    update_session_auth_hash,
)
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email

from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RegisterSerializer


User = get_user_model()


# --------------------------------------------------
# HELPER: CHECK ADMIN
# --------------------------------------------------

def is_admin_user(user):
    return (
        user.is_authenticated
        and (
            getattr(user, "role", "") == "ADMIN"
            or user.is_staff
            or user.is_superuser
        )
    )


# --------------------------------------------------
# REGISTER API
# --------------------------------------------------

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# --------------------------------------------------
# LOGIN API
# --------------------------------------------------

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        identifier = (
            request.data.get("email")
            or request.data.get("username")
            or ""
        ).strip()

        password = request.data.get("password")

        if not identifier or not password:
            return Response(
                {
                    "error": "Email/username and password are required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Find the user by email or username.
        if "@" in identifier:
            matched_users = User.objects.filter(
                email__iexact=identifier
            )

            if not matched_users.exists():
                return Response(
                    {"error": "Invalid email or password."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            # If multiple accounts share an email, prefer ADMIN.
            if matched_users.count() > 1:
                user_record = matched_users.filter(
                    role="ADMIN"
                ).first()

                if user_record is None:
                    return Response(
                        {"error": "Invalid email or password."},
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
            else:
                user_record = matched_users.first()

            username = user_record.username
        else:
            username = identifier

        user = authenticate(
            request,
            username=username,
            password=password,
        )

        if user is None:
            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {"error": "This account is inactive."},
                status=status.HTTP_403_FORBIDDEN,
            )

        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                "message": "Login successful",
                "token": token.key,
                "username": user.username,
                "role": getattr(user, "role", "CUSTOMER"),
            },
            status=status.HTTP_200_OK,
        )


# --------------------------------------------------
# ADMIN DASHBOARD API
# --------------------------------------------------

class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not is_admin_user(request.user):
            return Response(
                {"error": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response(
            {
                "message": "Welcome to Zinora Admin Dashboard"
            },
            status=status.HTTP_200_OK,
        )


# --------------------------------------------------
# CUSTOMER DASHBOARD API
# --------------------------------------------------

class CustomerDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if getattr(request.user, "role", "") != "CUSTOMER":
            return Response(
                {"error": "Customer access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response(
            {
                "message": (
                    f"Welcome to Zinora, {request.user.username}!"
                )
            },
            status=status.HTTP_200_OK,
        )


# --------------------------------------------------
# ADMIN PROFILE API
# GET: LOAD PROFILE
# PATCH: UPDATE PROFILE
# --------------------------------------------------

class AdminProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not is_admin_user(request.user):
            return Response(
                {"error": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        user = request.user

        full_name = (
            f"{user.first_name} {user.last_name}"
        ).strip()

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "name": full_name or user.username,
                "email": user.email or "",
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request):
        if not is_admin_user(request.user):
            return Response(
                {"error": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        user = request.user

        name = request.data.get("name")
        email = request.data.get("email")

        if name is None or email is None:
            return Response(
                {"error": "Name and email are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        name = name.strip() if isinstance(name, str) else ""
        email = email.strip() if isinstance(email, str) else ""

        if not name:
            return Response(
                {"name": ["Name is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not email:
            return Response(
                {"email": ["Email is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {"email": ["Enter a valid email address."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Do not allow duplicate email addresses.
        duplicate_email = (
            User.objects.filter(email__iexact=email)
            .exclude(pk=user.pk)
            .exists()
        )

        if duplicate_email:
            return Response(
                {"email": ["This email address is already in use."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        name_parts = name.split(maxsplit=1)

        user.first_name = name_parts[0]
        user.last_name = (
            name_parts[1] if len(name_parts) > 1 else ""
        )
        user.email = email

        user.save(
            update_fields=[
                "first_name",
                "last_name",
                "email",
            ]
        )

        return Response(
            {
                "message": "Profile updated successfully.",
                "id": user.id,
                "username": user.username,
                "name": (
                    f"{user.first_name} {user.last_name}"
                ).strip(),
                "email": user.email,
            },
            status=status.HTTP_200_OK,
        )


# --------------------------------------------------
# ADMIN CHANGE PASSWORD API
# --------------------------------------------------

class AdminChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user

        if not is_admin_user(user):
            return Response(
                {"error": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        current_password = request.data.get(
            "current_password", ""
        )
        new_password = request.data.get(
            "new_password", ""
        )
        confirm_password = request.data.get(
            "confirm_password", ""
        )

        if not all(
            [
                current_password,
                new_password,
                confirm_password,
            ]
        ):
            return Response(
                {"error": "All password fields are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(current_password):
            return Response(
                {
                    "currentPassword": [
                        "Current password is incorrect."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password != confirm_password:
            return Response(
                {
                    "confirmPassword": [
                        "New passwords do not match."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_password(new_password, user=user)
        except ValidationError as error:
            return Response(
                {"newPassword": error.messages},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Django hashes the password before saving it.
        user.set_password(new_password)
        user.save(update_fields=["password"])

        # Preserve the current session when session auth is used.
        update_session_auth_hash(request, user)

        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )


# --------------------------------------------------
# ADMIN CUSTOMERS API
# GET: LIST CUSTOMERS
# PATCH: ACTIVATE / BLOCK CUSTOMER
# --------------------------------------------------

class AdminCustomersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def check_admin(self, request):
        return is_admin_user(request.user)

    def get(self, request):
        if not self.check_admin(request):
            return Response(
                {"error": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        customers = User.objects.filter(
            role="CUSTOMER"
        ).order_by("-date_joined")

        data = []

        for customer in customers:
            full_name = (
                f"{customer.first_name} {customer.last_name}"
            ).strip()

            data.append(
                {
                    "id": customer.id,
                    "customer_id": f"CUS{customer.id:03d}",
                    "name": full_name or customer.username,
                    "username": customer.username,
                    "email": customer.email or "",
                    "phone": getattr(customer, "phone", "") or "",
                    "address": getattr(customer, "address", "") or "",
                    "joined": customer.date_joined.isoformat(),
                    "is_active": customer.is_active,
                    "status": (
                        "Active"
                        if customer.is_active
                        else "Blocked"
                    ),
                }
            )

        return Response(
            {
                "count": len(data),
                "customers": data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk=None):
        if not self.check_admin(request):
            return Response(
                {"error": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if pk is None:
            return Response(
                {"error": "Customer ID is required in the URL."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        is_active = request.data.get("is_active")

        if not isinstance(is_active, bool):
            return Response(
                {"error": "is_active must be true or false."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            customer = User.objects.get(
                pk=pk,
                role="CUSTOMER",
            )
        except User.DoesNotExist:
            return Response(
                {"error": "Customer not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        customer.is_active = is_active
        customer.save(update_fields=["is_active"])

        return Response(
            {
                "message": (
                    "Customer activated successfully."
                    if is_active
                    else "Customer blocked successfully."
                ),
                "id": customer.id,
                "username": customer.username,
                "is_active": customer.is_active,
                "status": (
                    "Active" if customer.is_active else "Blocked"
                ),
            },
            status=status.HTTP_200_OK,
        )
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class CustomerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone": user.phone or "",
            "address": user.address or "",
        })

    def patch(self, request):
        user = request.user

        allowed_fields = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "address",
        ]

        for field in allowed_fields:
            if field in request.data:
                setattr(user, field, request.data[field])

        user.save()

        return Response({
            "message": "Profile saved successfully in database.",
            "profile": {
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone": user.phone or "",
                "address": user.address or "",
            },
        })