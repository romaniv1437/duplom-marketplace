from django.urls import path, include
from .views import RegisterUserAPIView, LoginUserAPIView, MyProfile, LogoutUserAPIView, UpdateMyProfileAPIView, ChangePasswordAPIView, UsersListAPIView
# from django.contrib.auth.views import LogoutView


urlpatterns = [
    path('login/', LoginUserAPIView.as_view(), name='login'),
    path('register/', RegisterUserAPIView.as_view(), name='register'),
    path('logout/', LogoutUserAPIView.as_view(), name='logout'),
    path('me/', MyProfile.as_view(), name='profile'),

    path('settings/', UpdateMyProfileAPIView.as_view(), name='settings'),
    path('change-password/', ChangePasswordAPIView.as_view(), name='change-password'),

    path('users/', UsersListAPIView.as_view(), name='users'),
]