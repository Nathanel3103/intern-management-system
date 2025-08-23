from rest_framework import permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from rest_framework import permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model

from .models import Task
from .serializers import TaskSerializer


User = get_user_model()


def _is_admin(user) -> bool:
    return getattr(user, "role", None) == "ADMIN"


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Task.objects.select_related("assigned_to", "assigned_to__user").all()
        if _is_admin(user):
            return qs
        # Interns only see their own tasks
        return qs.filter(assigned_to__user=user)

    def create(self, request, *args, **kwargs):
        if not _is_admin(request.user):
            return Response({"detail": "Only admins can create tasks."}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Task.objects.select_related("assigned_to", "assigned_to__user").all()

    def patch(self, request, *args, **kwargs):
        # Admin can update anything; intern can update only own and limited fields
        instance = self.get_object()
        if _is_admin(request.user):
            return super().patch(request, *args, **kwargs)

        if instance.assigned_to.user_id != request.user.id:
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

        # Limit intern-updatable fields to status/progress/time tracking only
        allowed_fields = {"status", "progress", "started_at", "completed_at", "is_started"}
        data = {k: v for k, v in request.data.items() if k in allowed_fields}
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        if not _is_admin(request.user):
            return Response({"detail": "Only admins can delete tasks."}, status=status.HTTP_403_FORBIDDEN)
        return super().delete(request, *args, **kwargs)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def task_interaction(request, task_id):
    try:
        task = Task.objects.get(id=task_id)

        # Check if the task belongs to the current user or the user is admin
        if task.assigned_to.user != request.user and not _is_admin(request.user):
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

        action = request.data.get('action')

        if action == 'start':
            task.is_started = True
            task.save()
            serializer = TaskSerializer(task)
            return Response(serializer.data)

        elif action == 'update_progress':
            progress = request.data.get('progress')
            if progress is not None:
                try:
                    progress = int(progress)
                except (TypeError, ValueError):
                    return Response({"detail": "Invalid progress value."}, status=status.HTTP_400_BAD_REQUEST)
                task.progress = max(0, min(100, progress))
                task.save()
                serializer = TaskSerializer(task)
                return Response(serializer.data)
            else:
                return Response({"detail": "Progress value required."}, status=status.HTTP_400_BAD_REQUEST)

        elif action == 'complete':
            task.progress = 100
            task.save()
            serializer = TaskSerializer(task)
            return Response(serializer.data)

        else:
            return Response({"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

    except Task.DoesNotExist:
        return Response({"detail": "Task not found."}, status=status.HTTP_404_NOT_FOUND)
from django.utils import timezone



from .models import Task

from .serializers import TaskSerializer



