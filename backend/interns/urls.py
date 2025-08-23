from django.urls import path
from .views import InternListCreateView, InternRetrieveView, InternWithProgressListView


app_name = "interns"

urlpatterns = [
    path("", InternListCreateView.as_view(), name="intern-list-create"),
    path("<int:pk>/", InternRetrieveView.as_view(), name="intern-retrieve"),
    path("with-progress/", InternWithProgressListView.as_view(), name="intern-list-with-progress"),
]


