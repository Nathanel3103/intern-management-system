from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "assigned_to", "due_date", "priority", "status", "progress", "is_started", "started_at", "completed_at", "created_at")
    list_filter = ("priority", "status", "due_date", "started_at", "completed_at", "is_started")
    search_fields = ("title", "description", "assigned_to__user__email", "assigned_to__user__first_name", "assigned_to__user__last_name")
    readonly_fields = ("created_at", "updated_at")
    
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'assigned_to', 'assigned_by')
        }),
        ('Timing', {
            'fields': ('due_date', 'started_at', 'completed_at')
        }),
        ('Status', {
            'fields': ('priority', 'status', 'progress', 'is_started')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

