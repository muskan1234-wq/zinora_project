from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

from django.contrib.auth import authenticate, get_user_model

from .serializers import RegisterSerializer


User = get_user_model()


# ---------------- REGISTER API ----------------

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# ---------------- LOGIN API ----------------

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        identifier = (
            request.data.get("email")
            or request.data.get("username")
            or ""
        ).strip()

        password = request.data.get("password")

        # Check required fields
        if not identifier or not password:
            return Response(
                {
                    "error": "Email/username and password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find user by email or username
        if "@" in identifier:
            matched_users = User.objects.filter(
                email__iexact=identifier
            )

            # No account found
            if not matched_users.exists():
                return Response(
                    {"error": "Invalid email or password."},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # If multiple accounts share an email,
            # select the ADMIN account.
            if matched_users.count() > 1:
                user_record = matched_users.filter(
                    role="ADMIN"
                ).first()

                if user_record is None:
                    return Response(
                        {"error": "Invalid email or password."},
                        status=status.HTTP_401_UNAUTHORIZED
                    )

            else:
                user_record = matched_users.first()

            username = user_record.username

        else:
            username = identifier

        # Authenticate user
        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is None:
            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Check active status
        if not user.is_active:
            return Response(
                {"error": "This account is inactive."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Create or retrieve authentication token
        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                "message": "Login successful",
                "token": token.key,
                "username": user.username,
                "role": user.role,
            },
            status=status.HTTP_200_OK
        )


# ---------------- ADMIN DASHBOARD API ----------------

class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # Verify application role
        if request.user.role != "ADMIN":
            return Response(
                {"error": "Admin access required"},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response(
            {
                "message": "Welcome to Zinora Admin Dashboard"
            },
            status=status.HTTP_200_OK
        )


# ---------------- CUSTOMER DASHBOARD API ----------------

class CustomerDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Verify application role
        if request.user.role != "CUSTOMER":
            return Response(
                {"error": "Customer access required"},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response(
            {
                "message": f"Welcome to Zinora, {request.user.username}!"
            },
            status=status.HTTP_200_OK
        )