from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import InternProfile


User = get_user_model()


class InternSerializer(serializers.ModelSerializer):
    """Flatten intern profile and core user fields into a single representation."""

    id = serializers.IntegerField(source="user.id", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)
    name = serializers.SerializerMethodField()

    class Meta:
        model = InternProfile
        fields = [
            "id",
            "name",
            "email",
            "role",
            "department",
            "status",
            "progress",
        ]

    def get_name(self, obj) -> str:
        first_name = getattr(obj.user, "first_name", "") or ""
        last_name = getattr(obj.user, "last_name", "") or ""
        return f"{first_name} {last_name}".strip()


