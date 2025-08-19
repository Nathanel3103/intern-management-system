from django.db import models
from django.conf import settings


class InternProfile(models.Model):
    """Profile data specific to an intern.

    The primary key is the related user id for simpler lookups and URLs.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="intern_profile",
        primary_key=True,
    )
    department = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default="Active")
    progress = models.PositiveIntegerField(default=0)

    def __str__(self) -> str:
        return f"InternProfile(user_id={self.user_id}, department={self.department})"

