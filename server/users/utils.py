from datetime import timedelta
from server.settings import DATETIME_FORMAT
from django.db.models import Sum
from .models import Rating, Profile
from django.contrib.auth.models import User
from django.forms.models import model_to_dict

from rest_framework import serializers


class ProfileMixin:
    def get_context_data(self, instance, representation, *args, **kwargs):
        try:
            representation['avatar'] = representation['profile']['avatar']
            del representation['profile']
        except:
            pass
            # representation['avatar'] = None
            # del representation['profile']

        date_joined = instance.date_joined + timedelta(hours=3)
        rating = Rating.objects.filter(for_user=instance)
        n = len(rating)

        representation['username'] = instance.username
        representation['first_name'] = instance.first_name
        representation['last_name'] = instance.last_name
        representation['date_joined'] = date_joined.strftime(DATETIME_FORMAT)
        representation['stars'] = rating.aggregate(Sum('stars'))['stars__sum'] / n if rating else 0.00
        representation['persons'] = n

        return representation
    

    def rating_create(self, stars: int, username: str, pk: int):
        """
            СИСТЕМА СТВОРЕННЯ РЕЙТИНГУ ТА ОТРИМАННЯ ПОТОЧНИХ ДАНИХ
        """
        from_user = Profile.objects.get(pk=pk)      # підставляю айді для отримання Profile-instance
        for_user = User.objects.get(username=username)  # отримую користувача якому ставлять рейтинг

        if username == self.request.user.username:
            raise serializers.ValidationError({"error_message": "Ставити рейтинг самому собі заборонено!"})


        if Rating.objects.filter(from_user=from_user, for_user=for_user):
            raise serializers.ValidationError({'error_message': 'Ви оцінили даного користувача!'})


        rating = Rating.objects.create(
            stars=stars,
            from_user=from_user,
            for_user=for_user
        )
        rating.save()

        date_joined = for_user.date_joined + timedelta(hours=3)
        rating = Rating.objects.filter(for_user=for_user)
        n = len(rating)
        avatar_image = Profile.objects.filter(profile__username=for_user.username)
        avatar = 'http://127.0.0.1:8000' + avatar_image[0].avatar.url if avatar_image[0].avatar else None

        response = {
            'id': for_user.pk,
            'username': for_user.username,
            'avatar': avatar,
            'first_name': for_user.first_name,
            'last_name': for_user.last_name,
            'date_time': date_joined.strftime(DATETIME_FORMAT),
            'stars': rating.aggregate(Sum('stars'))['stars__sum'] / n if rating else 0.00,
            'persons': n,
        }

        return response
    

    def rating_delete(self, username: str, pk: int):
        from_user = Profile.objects.get(pk=pk)      # підставляю айді для отримання Profile-instance
        for_user = User.objects.get(username=username)  # отримую користувача якому ставлять рейтинг

        if username == self.request.user.username:
            raise serializers.ValidationError({"error_message": "Неможливо видалити власний рейтинг!"})

        Rating.objects.filter(from_user=from_user, for_user=for_user).delete()

        date_joined = for_user.date_joined + timedelta(hours=3)
        rating = Rating.objects.filter(for_user=for_user)
        n = len(rating)
        avatar_image = Profile.objects.filter(profile__username=for_user.username)
        avatar = 'http://127.0.0.1:8000' + avatar_image[0].avatar.url if avatar_image[0].avatar else None

        response = {
            'id': for_user.pk,
            'username': for_user.username,
            'avatar': avatar,
            'first_name': for_user.first_name,
            'last_name': for_user.last_name,
            'date_time': date_joined.strftime(DATETIME_FORMAT),
            'stars': rating.aggregate(Sum('stars'))['stars__sum'] / n if rating else 0.00,
            'persons': n,
        }

        return response
