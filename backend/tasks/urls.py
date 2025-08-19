from django.urls import path
from .views import TaskListCreateView, TaskRetrieveUpdateDestroyView


app_name = "tasks"

urlpatterns = [
    path("", TaskListCreateView.as_view(), name="task-list-create"),
    path("<int:pk>/", TaskRetrieveUpdateDestroyView.as_view(), name="task-detail"),
]


