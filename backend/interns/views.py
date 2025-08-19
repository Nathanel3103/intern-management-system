from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import InternProfile
from .serializers import InternSerializer


User = get_user_model()


def _is_admin(user) -> bool:
    return getattr(user, "role", None) == "ADMIN"


class InternListCreateView(APIView):
    """List all interns (admin only) and create an intern (admin only)."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not _is_admin(request.user):
            return Response({"detail": "Only admins can list interns."}, status=status.HTTP_403_FORBIDDEN)

        qs = (
            InternProfile.objects.select_related("user")
            .filter(user__role="INTERN")
            .order_by("user__id")
        )
        data = InternSerializer(qs, many=True).data
        return Response(data, status=status.HTTP_200_OK)

    @transaction.atomic
    def post(self, request):
        if not _is_admin(request.user):
            return Response({"detail": "Only admins can create interns."}, status=status.HTTP_403_FORBIDDEN)

        name = (request.data.get("name") or "").strip()
        email = (request.data.get("email") or "").strip().lower()
        password = request.data.get("password") or ""
        department = (request.data.get("department") or "").strip()

        # Basic validation
        errors = {}
        if not name:
            errors["name"] = ["This field is required."]
        if not email:
            errors["email"] = ["This field is required."]
        if not password:
            errors["password"] = ["This field is required."]
        if not department:
            errors["department"] = ["This field is required."]
        if password and len(password) < 8:
            errors.setdefault("password", []).append("Ensure this field has at least 8 characters.")
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        # Split name
        parts = name.split(" ", 1)
        first_name = parts[0] if parts else ""
        last_name = parts[1] if len(parts) > 1 else ""

        # Check email uniqueness
        if User.objects.filter(email=email).exists():
            return Response({"email": ["A user with this email already exists."]}, status=status.HTTP_400_BAD_REQUEST)

        # Create user and profile
        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role="INTERN",
        )
        profile = InternProfile.objects.create(
            user=user, department=department, status="Active", progress=0
        )

        data = InternSerializer(profile).data
        return Response(data, status=status.HTTP_201_CREATED)


class InternRetrieveView(APIView):
    """Retrieve a single intern by user id. Admin can access any; interns only their own."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk: int):
        if not (_is_admin(request.user) or request.user.id == pk):
            return Response({"detail": "Not authorized to view this intern."}, status=status.HTTP_403_FORBIDDEN)

        profile = get_object_or_404(
            InternProfile.objects.select_related("user").filter(user__role="INTERN"),
            pk=pk,
        )
        data = InternSerializer(profile).data
        return Response(data, status=status.HTTP_200_OK)

