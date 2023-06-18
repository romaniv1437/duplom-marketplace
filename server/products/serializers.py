from rest_framework import serializers
from .models import Products, Photo, Currency
from users.models import Profile
from datetime import timedelta

from pytils.translit import slugify
from server.settings import DATETIME_FORMAT


class CurrencySerializers(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = '__all__'


class ProductsPhotoSerializers(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = "__all__"


class ProductsSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    time_create = serializers.DateTimeField(read_only=True, format=DATETIME_FORMAT)
    time_update = serializers.DateTimeField(read_only=True, format=DATETIME_FORMAT)

    class Meta:
        model = Products
        fields = (
            'id',
            'title',
            'description',
            'slug',
            'price',
            'currency',
            'time_create',
            'time_update',
            'category',
            'user',
        )
        depth = 1
        extra_kwargs = {
            'slug': {'read_only': True}
        }


    def to_representation(self, instance):
        data = Products.objects.filter(pk=instance.id)[0].number_photo
        photo = ['http://127.0.0.1:8000' + i.photo.url for i in Photo.objects.filter(number_photo=data)]

        representation = super().to_representation(instance)
        avatar = instance.user.profile.profile.avatar
        date_joined = instance.user.profile.date_joined + timedelta(hours=3)

        if avatar:
            avatar = 'http://127.0.0.1:8000' + avatar.url
        else:
            avatar = None

        representation["user"] = {
            'id': instance.user.profile.id,
            'username': instance.user.profile.username,
            'first_name': instance.user.profile.first_name,
            'last_name': instance.user.profile.last_name,
            'date_joined': date_joined.strftime(DATETIME_FORMAT),
            'avatar': avatar
        }
        representation["photo"] = photo

        return representation


class AddProductsSerializer(serializers.ModelSerializer):

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)
    #     print(self.fields['category'])
    #     self.fields['category'].initial = 'Категорія не вибрана'

    # images = ProductsPhotoSerializers(many=True, read_only=True)
    # photo = serializers.ListField(
    #     child=serializers.ImageField(allow_empty_file=False, use_url=False),
    #     write_only=True
    # )
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    slug = serializers.CharField(read_only=True)

    class Meta:
        model = Products
        # fields = ["title", "description", "slug", "price", "currency", "images",
        #          "category", "photo", "user"]
        fields = [
            'id',
            'slug',
            'title',
            'description',
            'price',
            'currency',
            'category',
            'user',
        ]



    def create(self, validated_data):
        self.is_valid()
        # photos = validated_data.pop("photo")
        # image_part_id = 1 if Photo.objects.last() is None else Photo.objects.last().number_photo + 1
        username = self.context['request'].user.pk
        user = Profile.objects.filter(profile=username)[0]
        post_id =  1 if Products.objects.first() is None else Products.objects.first().pk + 1
        validated_data['slug'] = slugify(self.validated_data['title'] + '-' + str(post_id))
        validated_data['user'] = user

        # validated_data['number_photo'] = image_part_id

        # for photo in photos:
        #     Photo.objects.create(photo=photo, number_photo=image_part_id)

        product = Products.objects.create(**validated_data)

        return product
