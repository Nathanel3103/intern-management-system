from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import InternProfile
from tasks.models import Task

# Basic InternSerializer for InternProfile
# In your interns/serializers.py
class InternSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id', read_only=True)
    name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    
    class Meta:
        model = InternProfile
        fields = ['id', 'name', 'email', 'department', 'status', 'progress']
    
    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    
    def get_email(self, obj):
        return obj.user.email

User = get_user_model()

class InternWithProgressSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    task_stats = serializers.SerializerMethodField()

    class Meta:
        model = InternProfile
        fields = ['id', 'name', 'email', 'department', 'status', 'progress', 'task_stats']

    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_email(self, obj):
        return obj.user.email

    def get_progress(self, obj):
        tasks = Task.objects.filter(assigned_to=obj)
        if not tasks.exists():
            return 0
        
        completed_tasks = tasks.filter(status="COMPLETED")
        return round((completed_tasks.count() / tasks.count()) * 100)

    def get_task_stats(self, obj):
        tasks = Task.objects.filter(assigned_to=obj)
        return {
            'total': tasks.count(),
            'completed': tasks.filter(status="COMPLETED").count(),
            'in_progress': tasks.filter(status="IN_PROGRESS", progress__gt=0).count(),
            'not_started': tasks.filter(progress=0).count()
        }