from rest_framework import serializers
from rest_framework.fields import empty
from .models import Orders, Photo
from users.models import Profile
from django.contrib.auth.models import User

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from pytils.translit import slugify


class OrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = '__all__'

# class AddOrdersSerializer(serializers.ModelSerializer):

#     photo = serializers.ListField(child=serializers.ImageField())
    
#     class Meta:
#         model = Orders
#         fields = ('title', 'description', 'price', 'slug', 'photo', 'cat')

#     def create(self, validated_data):
#         image_part_id = 1 if Photo.objects.last() is None else Photo.objects.last().custom + 1
#         del validated_data['photo']
#         validated_data['custom'] = image_part_id
#         print(validated_data)
#         return super().create(validated_data)

    # def save(self, **kwargs):
    #     photos = self.context['request'].FILES.getlist('photo')
    #     username = self.context['request'].user.pk
    #     user = Profile.objects.filter(profile=username)[0]

    #     image_part_id = 1 if Photo.objects.last() is None else Photo.objects.last().custom + 1
    #     for photo in photos:
    #         Photo.objects.create(
    #             photo=photo,
    #             custom=image_part_id
    #         )

    #     # kwargs['photo'] = image_part_id
    #     kwargs['user'] = user
    #     kwargs['slug'] = slugify(self.validated_data['title'] + '-' + str(Orders.objects.last().pk + 1))
    #     print(kwargs)
    #     return super().save(**kwargs)


class TokenObtainLifetimeSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        print('qwerty')
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['lifetime'] = int(refresh.access_token.lifetime.total_seconds())
        return data


class TokenRefreshLifetimeSerializer(TokenRefreshSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = RefreshToken(attrs['refresh'])
        data['lifetime'] = int(refresh.access_token.lifetime.total_seconds())
        return data
    


class OrdersPhotoSerializers(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = "__all__"


class AddOrdersSerializer(serializers.ModelSerializer):

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)
    #     print(self.fields['category'])
    #     self.fields['category'].initial = 'Категорія не вибрана'

    images = OrdersPhotoSerializers(many=True, read_only=True)
    photo = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True
    )

    class Meta:
        model = Orders
        fields = ["title", "description", "price", "currency", "images",
                  "photo", "category", "user"]
        

    def create(self, validated_data):
        self.is_valid()
        photos = validated_data.pop("photo")
        image_part_id = 1 if Photo.objects.last() is None else Photo.objects.last().number_photo + 1
        username = self.context['request'].user.pk
        user = Profile.objects.filter(profile=username)[0]
        post_id =  1 if Orders.objects.last() is None else Orders.objects.last().pk + 1
        validated_data['slug'] = slugify(self.validated_data['title'] + '-' + str(post_id))
        validated_data['user'] = user
        validated_data['number_photo'] = image_part_id

        for photo in photos:
            Photo.objects.create(photo=photo, number_photo=image_part_id)

        product = Orders.objects.create(**validated_data)

        return product