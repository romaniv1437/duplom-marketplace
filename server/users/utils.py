from datetime import timedelta
from server.settings import DATETIME_FORMAT
from django.db.models import Sum
from .models import Rating, Profile
from products.models import Products
from django.contrib.auth.models import User, AnonymousUser
from products.serializers import ProductsSerializer

from rest_framework import serializers


class ProfileMixin:
    def get_context_data(self, instance, representation={}, request=None, *args, **kwargs):
        try:
            representation['avatar'] = representation['profile']['avatar']
            del representation['profile']
        except:
            pass
    
        date_joined = instance.date_joined + timedelta(hours=3)
        rating = Rating.objects.filter(for_user=instance)
        n = len(rating)
        
        you_stars = None
    
        if not request.user.is_anonymous:       #  Якщо користувач не анонімний то можна отримати поточний рейтинг
            you_rating = Rating.objects.filter(from_user=Profile.objects.get(profile=request.user), for_user=instance)   # роблю запит в бд чи я користувач ставив оцінку іншому користувачеві
            you_stars = you_rating[0].stars if you_rating else None     # якщо запис існує, то отримую оцінку і передаємо на фронт, якщо ні - None
        
        products = ProductsSerializer(data=Products.objects.filter(user=instance.pk).order_by('-id'), many=True)
        products.is_valid()
        
        representation['username'] = instance.username
        representation['first_name'] = instance.first_name
        representation['last_name'] = instance.last_name
        representation['date_joined'] = date_joined.strftime(DATETIME_FORMAT)
        representation['stars'] = round(rating.aggregate(Sum('stars'))['stars__sum'] / n if rating else 0.00, 1)
        representation['persons'] = n
        representation['you_stars'] = you_stars
        representation['products'] = products.data

        return representation
    
    
    def rating_create(self, stars, username, pk, request=None, *args, **kwargs):
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

        context = self.get_context_data(instance=for_user, request=request)
        avatar = Profile.objects.get(profile=for_user)
        context['avatar'] = 'http://127.0.0.1:8000' + avatar.avatar.url if avatar.avatar else None

        return context
    

    def rating_delete(self, username: str, pk: int, request=None, *args, **kwargs):
        from_user = Profile.objects.get(pk=pk)      # підставляю айді для отримання Profile-instance
        for_user = User.objects.get(username=username)  # отримую користувача якому ставлять рейтинг

        if username == self.request.user.username:
            raise serializers.ValidationError({"error_message": "Неможливо видалити власний рейтинг!"})

        Rating.objects.filter(from_user=from_user, for_user=for_user).delete()

        context = self.get_context_data(instance=for_user, request=request)

        return context
