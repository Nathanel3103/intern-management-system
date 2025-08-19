from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "assigned_to", "due_date", "priority", "status", "progress")
    list_filter = ("priority", "status", "due_date")
    search_fields = ("title", "description", "assigned_to__user__email", "assigned_to__user__first_name", "assigned_to__user__last_name")

