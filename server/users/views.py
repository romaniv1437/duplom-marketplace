from django.shortcuts import redirect
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.models import TokenUser
from rest_framework.permissions import IsAuthenticated

from .permissions import IsNotRegistered
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, ProfileSerializer
from orders.permissions import IsOwnerOrReadOnly
from django.contrib.auth import logout
# from datetime import datetime, timedelta


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
        # print(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data
        serializer = UserSerializer(user)
        token = RefreshToken.for_user(user)

        data = serializer.data
        data['tokens'] = {
            'refresh': str(token),
            'access': str(token.access_token)
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
    