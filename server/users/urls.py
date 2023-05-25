from django.urls import path, re_path, include
from .views import RegisterUserAPIView, LoginUserAPIView, logout_user

from django.contrib.auth.views import LogoutView
from rest_framework_simplejwt.views import TokenObtainPairView


urlpatterns = [
    # path('register/', RegisterUserAPIView.as_view(), name='register'),
    # path('login/', LoginUserAPIView.as_view(), name='login'),
    # path('logout/', logout_user, name='logout'),



    path('login/', LoginUserAPIView.as_view(), name='login'),
    path('register/', RegisterUserAPIView.as_view(), name='register'),
    path('logout/', logout_user, name='logout'),
    path('token/', TokenObtainPairView.as_view(), name='login')
]