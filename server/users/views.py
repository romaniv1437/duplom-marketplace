from rest_framework import generics, serializers, filters, pagination
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from django.contrib.auth.models import User
from django.contrib.auth import logout, authenticate
from django_filters import rest_framework as rest_filters
from django.http import Http404

from datetime import datetime, timedelta
from django.db.models import Sum

from .permissions import IsNotRegistered
from .serializers import ProfileSerializer, ChangePasswordSerializer
from .models import Profile, Rating
from .utils import ProfileMixin

from server.settings import DATETIME_FORMAT
from products.permissions import IsOwnerOrReadOnly


class MyProfile(generics.RetrieveAPIView):
    """
        URL /me/
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        serializer = ProfileSerializer(request.user, context={'request': self.request})

        return Response(serializer.data)


class UpdateMyProfileAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
        URL /settings/
    """
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
        serializer = ProfileSerializer(data=data)
        serializer.is_valid()

        if User.objects.filter(username=data['username'])\
            and data['username'] != self.request.user.username:
            raise serializers.ValidationError({'error_message': 'Обліковий запис існує!'})


        user = User.objects.filter(username=self.request.user.username) # тут вар через необроблені дані.
        avatar_image = Profile.objects.filter(profile__username=self.request.user.username)
        date_joined = User.objects.filter(username=self.request.user.username)[0].date_joined + timedelta(hours=3)
        avatar = 'http://127.0.0.1:8000' + avatar_image[0].avatar.url if avatar_image[0].avatar else None


        user.update(
            username=data['username'],
            first_name=data['first_name'],
            last_name=data['last_name'],
        )

        rating = Rating.objects.filter(for_user=self.request.user)
        n = len(rating)
        
    
        response = {
            'id': self.request.user.pk,
            'username': data['username'],
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'date_joined': date_joined.strftime(DATETIME_FORMAT),
            'avatar': avatar,
            'stars': rating.aggregate(Sum('stars'))['stars__sum'] / n if rating else 0.00,
            'persons': n,
            'you_stars': None,
        }
        
        return Response(response)


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
        username = self.request.user.username

        for i in request.FILES:
            photo = i

        avatar = request.FILES[photo]

        if avatar:
            instance = Profile.objects.filter(profile__username=self.request.user.username)[0]
            instance.avatar = avatar
            instance.save()

        user = User.objects.filter(username=username)[0]

        response = {
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'date_joined': user.date_joined,
            'avatar': 'http://127.0.0.1:8000' + instance.avatar.url,
        }

        return Response(response)


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



class UserListPagination(pagination.PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 1000


class UsersListAPIView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-id')
    serializer_class = ProfileSerializer
    pagination_class = UserListPagination
    filter_backends = [rest_filters.DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['username', 'first_name', 'last_name']



class RatingUserAPIView(ProfileMixin, generics.ListCreateAPIView):
    """
        View для створення рейтингу зареєстрованим користувачам
        profile/<slug:username>/
    """
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    pagination_class = None


    def get(self, request, *args, **kwargs):
        if not User.objects.filter(username=self.kwargs['slug']):
            """
                ПЕРЕВІРКА НА ВМІСТ КОРИСТУВАЧА
            """
            raise Http404()

        user = User.objects.get(username=self.kwargs['slug'])
        serializer = ProfileSerializer(user, context={'request': self.request})

        return Response(serializer.data)


    def post(self, request, *args, **kwargs):
        stars = request.data['stars']       # отримую число від 1 до 5
        username = self.kwargs['slug']      #  отримую користувача по слагу
        pk = self.request.user.pk       #  отримую унікальний ідентифікатор

        context = super().rating_create(stars, username, pk)

        return Response(context)


    def delete(self, *args, **kwargs):
        username = self.kwargs['slug']      #  отримую користувача по слагу
        pk = self.request.user.pk       #  отримую унікальний ідентифікатор
        
        context = super().rating_delete(username, pk)

        return Response(context)
    

    def get_queryset(self):
        username = self.kwargs['slug']

        return User.objects.filter(username=username)