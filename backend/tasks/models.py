from django.db import models
from django.conf import settings
from django.utils import timezone
from interns.models import InternProfile


class Task(models.Model):
    PRIORITY_CHOICES = [
        ("LOW", "Low"),
        ("MEDIUM", "Medium"),
        ("HIGH", "High"),
    ]

    STATUS_CHOICES = [
        ("IN_PROGRESS", "In Progress"),
        ("COMPLETED", "Completed"),
    ]
    
    PROGRESS_CHOICES = [
        (0, "Not Started"),
        (25, "In Progress - 25%"),
        (50, "Halfway - 50%"),
        (75, "Almost Done - 75%"),
        (100, "Completed"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    assigned_to = models.ForeignKey(
        InternProfile, on_delete=models.CASCADE, related_name="tasks"
    )
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_tasks",
    )
    due_date = models.DateField()
    priority = models.CharField(
        max_length=10, choices=PRIORITY_CHOICES, default="MEDIUM"
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="IN_PROGRESS"
    )
    progress = models.PositiveIntegerField(
        choices=PROGRESS_CHOICES,
        default=0,
    )
    
    # Track if task has been started
    is_started = models.BooleanField(default=False)

    # Time tracking
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Set started_at when task is first marked as started
        if self.is_started and not self.started_at:
            self.started_at = timezone.now()
        
        # Set completed_at when progress reaches 100%
        if self.progress == 100 and not self.completed_at:
            self.completed_at = timezone.now()
            self.status = "COMPLETED"
        elif self.progress < 100 and self.status == "COMPLETED":
            self.status = "IN_PROGRESS"
            self.completed_at = None
            
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        try:
            return f"Task(title={self.title}, assigned_to={self.assigned_to.user.email})"
        except Exception:
            return f"Task(title={self.title})"

