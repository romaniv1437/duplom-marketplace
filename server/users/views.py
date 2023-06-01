from django.shortcuts import redirect
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

from orders.permissions import IsOwnerOrReadOnly
from django.contrib.auth import logout
from datetime import datetime, timedelta

from .permissions import IsNotRegistered
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, ProfileSerializer
from server.settings import DATETIME_FORMAT


class RegisterUserAPIView(generics.CreateAPIView):
    permission_classes = (IsNotRegistered,)
    serializer_class = RegisterSerializer
    

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        token = RefreshToken.for_user(user)

        data = serializer.data
        data['tokens'] = {
            'refresh': str(token),
            'access': str(token.access_token),
            # 'access_time': datetime.da
        }

        return Response(data, status=status.HTTP_201_CREATED)


class LoginUserAPIView(generics.CreateAPIView):
    permission_classes = (IsNotRegistered,)
    serializer_class = LoginSerializer


    def post(self, request, *args, **kwargs):
        # life_access_token = datetime.now() + timedelta(minutes=30)
        # life_refresh_token = datetime.now() + timedelta(days=7)

        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data
        serializer = UserSerializer(user)
        token = RefreshToken.for_user(user)

        data = serializer.data
        data['tokens'] = {
            'refresh': str(token),
            'access': str(token.access_token),
            # 'life_access': life_access_token.strftime(DATETIME_FORMAT),
            # 'life_refresh': life_refresh_token.strftime(DATETIME_FORMAT),
        }

        return Response(data, status=status.HTTP_200_OK)


class MyProfile(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)

        return Response(serializer.data)


class LogoutUserAPIView(generics.CreateAPIView):
    parser_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        logout(request)

        return Response({'message': 'Ви вийшли з акаунту!'}, status=200)
    