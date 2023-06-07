from rest_framework import generics, serializers, status, filters
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User
from django.forms.models import model_to_dict
from django.contrib.auth import logout, authenticate
from django_filters import rest_framework as rest_filters

from datetime import datetime, timedelta

from .permissions import IsNotRegistered
from .serializers import RegisterSerializer, LoginSerializer, ProfileSerializer, ChangePasswordSerializer, ProfileAvatarSerializer
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


class UpdateMyProfileAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,)


    def get_object(self):
        """
            СИСТЕМА НАЛАШТУВАНЬ ДЛЯ ПЕВНОГО КОРИСТУВАЧА
        """

        return self.request.user


    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        return Response(serializer.data)


    def update(self, request, *args, **kwargs):
        data = request.data
        serializers = ProfileSerializer(data=data)
        serializers.is_valid()
        user = User.objects.filter(username=self.request.user.username)
        user.update(
            username=data['username'],
            first_name=data['first_name'],
            last_name=data['last_name'],
        )

<<<<<<< HEAD
        response = {
            'username': serializers.data['username'],
            'first_name': serializers.data['first_name'],
            'last_name': serializers.data['last_name'],
            'date_joined': User.objects.filter(username=self.request.user.username)[0].date_joined,
            'avatar': f'http://127.0.0.1:8000{Profile.objects.filter(profile__username=self.request.user.username)[0].avatar.url}',
        }
    
        return Response(response)
    
=======
        return Response({'message': 'Ваші дані успішно змінені!'})

>>>>>>> origin

    def destroy(self, request, *args, **kwargs):
        username = self.request.user.username

        instance = Profile.objects.get(profile__username=username)
        instance.avatar = None
        instance.save()

        return Response({'message': 'Ваша аватарка успішно видалена!'})


    def get_queryset(self):
        username = self.request.user.username

        return Profile.objects.filter(profile__username=username)


class AddProfilePhotoAPIView(generics.CreateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,)


    def get_object(self):
        return self.request.user


    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        return Response(serializer.data)


    def post(self, request, *args, **kwargs):
        avatar = request.FILES.get('profile.avatar')
        username = self.request.user.username

        if avatar:
            instance = Profile.objects.filter(profile__username=self.request.user.username)[0]
            instance.avatar = request.FILES['profile.avatar']
            instance.save()

<<<<<<< HEAD
        user = User.objects.filter(username=username)[0]
        profile = Profile.objects.filter(profile__username=username)[0]

        response = {
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'date_joined': user.date_joined,
            'avatar': 'http://127.0.0.1:8000' + profile.avatar.url,
        }

        
        return Response(response)
=======
            return Response({'message': 'Ваші дані успішно змінені!'})

        return Response({'message': 'Фотографія профілю не була зміненою!'})
>>>>>>> origin

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

        if user is None:
            raise serializers.ValidationError({'error_message': 'Не правильний старий пароль!'})

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Ваш пароль успішно змінений!'})



class UsersListAPIView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-id')
    serializer_class = ProfileSerializer
    filter_backends = [rest_filters.DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['username', 'first_name', 'last_name']
