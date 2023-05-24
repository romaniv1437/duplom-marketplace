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


class OrdersPhotoSerializers(serializers.ModelSerializer):


    class Meta:
        model = Photo
        fields = "__all__"


class OrdersSerializer(serializers.ModelSerializer):
    PHOTO_ID = 1
    CURRENCY_ID = 1
    CATEGORY_ID = 1
    USER_ID = 1

    photo = serializers.SerializerMethodField('get_photo')
    currency = serializers.SerializerMethodField('get_currency')
    category = serializers.SerializerMethodField('get_category')
    user = serializers.SerializerMethodField('get_user')

    class Meta:
        model = Orders
<<<<<<< HEAD
        exclude = ('number_photo', 'is_active')
        

    
    def to_representation(self, instance):

        data = Orders.objects.filter(pk=instance.id)[0].number_photo
        photo = ['http://127.0.0.1:8000' + i.photo.url for i in Photo.objects.filter(number_photo=data)]

        representation = super().to_representation(instance)
        # representation["id"] = instance.id
        # representation["title"] = instance.title
        # representation["description"] = instance.description
        # representation["slug"] = instance.slug
        # representation["price"] = instance.price
        representation['currency'] = instance.currency.title
        representation["category"] = [{'title': instance.category.title, 'slug': instance.category.slug}]
        representation["user"] = [{
            'title': instance.user.profile.username,
            'email': instance.user.profile.email,
            'first_name': instance.user.profile.first_name,
        }]
        representation["photo"] = photo

        return representation

        
=======
        # fields = ('pk', 'title', 'slug', 'description', 'price', 'currency', 'category', 'user', 'photo')
        fields = ('pk', 'title', 'slug', 'description', 'price', 'currency', 'category', 'user', 'photo')


    def get_photo(self, *args, **kwargs):
        try:
            Orders.objects.filter(pk=self.PHOTO_ID)[0]
            self.PHOTO_ID += 1
        except Exception as exc:
            while True:
                self.PHOTO_ID += 1
                break

        return ['http://127.0.0.1:8000' + i.photo.url for i in Photo.objects.filter(number_photo=Orders.objects.filter(pk=self.PHOTO_ID)[0].number_photo)]

    
    def get_currency(self, *args, **kwargs):
        try:
            Orders.objects.filter(pk=self.CURRENCY_ID)[0]
            self.CURRENCY_ID += 1
        except Exception:

            while True:
                self.CURRENCY_ID += 1
                break

        return Orders.objects.filter(pk=self.CURRENCY_ID)[0].currency.title


    def get_category(self, *args, **kwargs):
        try:
            Orders.objects.filter(pk=self.CATEGORY_ID)[0]
            self.CATEGORY_ID += 1
        except IndexError:
            self.CATEGORY_ID += 1

            while True:
                break

        return Orders.objects.filter(pk=self.CATEGORY_ID)[0].category.title
    

    def get_user(self, *args, **kwargs):
        try:
            Orders.objects.filter(pk=self.USER_ID)[0]
            self.USER_ID += 1
        except IndexError:
            self.USER_ID += 1

            while True:
                break

        return Orders.objects.filter(pk=self.USER_ID)[0].user.profile.username
        

>>>>>>> origin
    


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