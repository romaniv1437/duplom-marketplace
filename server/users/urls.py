from django.urls import path
from .views import RegisterUserAPIView, LoginUserAPIView
from django.contrib.auth.views import LogoutView


urlpatterns = [
    path('login/', LoginUserAPIView.as_view(), name='login'),
    path('register/', RegisterUserAPIView.as_view(), name='register'),
]