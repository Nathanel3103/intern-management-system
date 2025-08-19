from rest_framework import serializers
from django.contrib.auth import get_user_model
from interns.models import InternProfile
from .models import Task


User = get_user_model()


class TaskSerializer(serializers.ModelSerializer):
    assigned_to_user_id = serializers.IntegerField(write_only=True)
    assignedTo = serializers.SerializerMethodField(read_only=True)
    dueDate = serializers.DateField(source="due_date", read_only=True)
    priority_display = serializers.SerializerMethodField(read_only=True)
    status_display = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "assigned_to_user_id",
            "due_date",
            "dueDate",
            "priority",
            "priority_display",
            "status",
            "status_display",
            "progress",
            "assignedTo",
        ]
        extra_kwargs = {
            "due_date": {"write_only": True},
            "priority": {"required": False},
            "status": {"required": False},
            "progress": {"required": False},
        }

    def validate_priority(self, value: str):
        # Accept both internal codes and human-readable values from the UI
        if value is None or value == "":
            return value
        normalized_map = {
            "low": "LOW",
            "medium": "MEDIUM",
            "high": "HIGH",
        }
        code = normalized_map.get(str(value).strip().lower())
        if code:
            return code
        # If already a valid code, pass through
        if str(value).upper() in {"LOW", "MEDIUM", "HIGH"}:
            return str(value).upper()
        raise serializers.ValidationError("Invalid priority value")

    def get_assignedTo(self, obj) -> str:
        user = getattr(obj.assigned_to, "user", None)
        if not user:
            return "Unknown"
        name = f"{user.first_name} {user.last_name}".strip()
        return name or user.email

    def get_priority_display(self, obj) -> str:
        mapping = {"LOW": "Low", "MEDIUM": "Medium", "HIGH": "High"}
        return mapping.get(obj.priority, obj.priority)

    def get_status_display(self, obj) -> str:
        mapping = {"IN_PROGRESS": "In Progress", "COMPLETED": "Completed"}
        return mapping.get(obj.status, obj.status)

    def validate_assigned_to_user_id(self, user_id: int) -> int:
        if not InternProfile.objects.filter(user_id=user_id).exists():
            raise serializers.ValidationError("Invalid intern user id")
        return user_id

    def create(self, validated_data):
        user_id = validated_data.pop("assigned_to_user_id")
        # user_id refers to the core User's id; fetch the related intern by user_id
        intern = InternProfile.objects.get(user_id=user_id)

        request = self.context.get("request")
        task = Task.objects.create(
            assigned_to=intern,
            assigned_by=getattr(request, "user", None) if request else None,
            # Defaults handled by model fields
            **validated_data,
        )
        return task

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Normalize to frontend shape expected by TaskManagement.jsx
        ret["assignedTo"] = self.get_assignedTo(instance)
        ret["dueDate"] = instance.due_date
        ret["priority"] = self.get_priority_display(instance)
        ret["status"] = self.get_status_display(instance)
        ret["progress"] = instance.progress
        # Remove write-only/internal fields if present
        ret.pop("assigned_to_user_id", None)
        ret.pop("priority_display", None)
        ret.pop("status_display", None)
        ret.pop("due_date", None)
        return ret


