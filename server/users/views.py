from rest_framework import generics, serializers
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

from django.core.exceptions import ValidationError
from django.contrib.auth import logout, authenticate
from datetime import datetime, timedelta

from .permissions import IsNotRegistered
from .serializers import RegisterSerializer, LoginSerializer, ProfileSerializer, ChangePasswordSerializer, UserSerializer
from .models import Profile

from server.settings import DATETIME_FORMAT


class RegisterUserAPIView(generics.CreateAPIView):
    permission_classes = (IsNotRegistered,)
    serializer_class = RegisterSerializer
    

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        life_access_token = datetime.now() + timedelta(minutes=30)
        life_refresh_token = datetime.now() + timedelta(days=7)

        user = serializer.save()

        token = RefreshToken.for_user(user)

        data = serializer.data
        data['tokens'] = {
            'refresh': str(token),
            'access': str(token.access_token),
            
            'life_access': life_access_token.strftime(DATETIME_FORMAT),
            'life_refresh': life_refresh_token.strftime(DATETIME_FORMAT),
        }

        return Response(data, status=status.HTTP_201_CREATED)


class LoginUserAPIView(generics.CreateAPIView):
    permission_classes = (IsNotRegistered,)
    serializer_class = LoginSerializer


    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        life_access_token = datetime.now() + timedelta(minutes=30)
        life_refresh_token = datetime.now() + timedelta(days=7)

        user = serializer.validated_data

        # serializer = LoginSerializer(user)
        serializer = ProfileSerializer(user)
        token = RefreshToken.for_user(user)

        data = serializer.data
        data['tokens'] = {
            'refresh': str(token),
            'access': str(token.access_token),
            'life_access': life_access_token.strftime(DATETIME_FORMAT),
            'life_refresh': life_refresh_token.strftime(DATETIME_FORMAT),
        }

        return Response(data, status=status.HTTP_200_OK)


class LogoutUserAPIView(generics.CreateAPIView):
    parser_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        logout(request)

        return Response({'message': 'Ви вийшли з акаунту!'}, status=200)
    

class MyProfile(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        serializer = ProfileSerializer(request.user)

        return Response(serializer.data)


class UpdateMyProfileAPIView(generics.UpdateAPIView):
    serializer_class = ProfileSerializer
    
    def get_queryset(self):
        username = self.request.user.username

        return Profile.objects.filter(profile__username=username)
    

class ChangePasswordAPIView(generics.CreateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = self.request.user.username
        password = request.data['old_password']
        new_password = request.data['new_password']

        user = authenticate(username=username, password=password)
        
        user.set_password(new_password)
        user.save()

        return Response({'message': 'Ваш пароль успішно змінений!'})
