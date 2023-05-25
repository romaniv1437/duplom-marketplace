from django.contrib.auth.models import User
from django.contrib.auth import login, logout
from django.shortcuts import redirect
from django.core.exceptions import ValidationError

from rest_framework import generics, views
from rest_framework.response import Response
from rest_framework import status

from .permissions import IsNotRegistered
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer


class RegisterUserAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (IsNotRegistered,)


    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        login(request, user)

        return Response(serializer.data)


class LoginUserAPIView(generics.CreateAPIView):
    serializer_class = LoginSerializer
    permission_classes = (IsNotRegistered,)


    def post(self, request, format=None):
        serializer = LoginSerializer(data=self.request.data, context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        login(request, user)

        return redirect('myorders')




def logout_user(request):
    logout(request)

    return redirect('home')

