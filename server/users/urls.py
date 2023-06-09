from django.urls import path, include
from .views import *
# from django.contrib.auth.views import LogoutView


urlpatterns = [
    path('me/', MyProfile.as_view(), name='profile'),
    path('profile/<slug:slug>/', RatingUserAPIView.as_view(), name='get-user'),

    path('settings/', UpdateMyProfileAPIView.as_view(), name='settings'),
    path('change-password/', ChangePasswordAPIView.as_view(), name='change-password'),
    path('add-profile-photo/', AddProfilePhotoAPIView.as_view(), name='add-profile-photo'),

    path('users/', UsersListAPIView.as_view(), name='users'),
]