from django.urls import path, include
from .views import *


urlpatterns = [
    path('login/', LoginUserAPIView.as_view(), name='login'),
    path('register/', RegisterUserAPIView.as_view(), name='register'),
    path('logout/', LogoutUserAPIView.as_view(), name='logout'),
]