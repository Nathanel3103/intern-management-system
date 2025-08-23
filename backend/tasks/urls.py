from django.urls import path
from .views import TaskListCreateView, TaskRetrieveUpdateDestroyView, task_interaction


app_name = "tasks"

urlpatterns = [
    path("", TaskListCreateView.as_view(), name="task-list-create"),
    path("<int:pk>/", TaskRetrieveUpdateDestroyView.as_view(), name="task-detail"),
    path("<int:task_id>/interact/", task_interaction, name="task-interact"),
]


