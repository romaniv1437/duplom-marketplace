from rest_framework import serializers
from rest_framework.response import Response

from .models import Profile, Rating
from .utils import ProfileMixin

from django.contrib.auth.models import User
from django.db.utils import IntegrityError
from django.core.exceptions import ValidationError
from django.contrib.auth import login, authenticate, get_user_model
from django.db.models import Sum
from datetime import timedelta

from server.settings import DATETIME_FORMAT


class ProfileAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('avatar', 'profile')
        depth = 1

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if instance.avatar:
            representation['avatar'] = 'http://127.0.0.1:8000' + instance.avatar.url
            del representation['profile']
        else:
            representation['avatar'] = None
            del representation['profile']
        
        return representation


# class ProfileSerializer(ProfileMixin, serializers.ModelSerializer):
#     profile = ProfileAvatarSerializer(required=False)
    
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'first_name', 'last_name', 'profile', 'date_joined')
#         extra_kwargs = {
#             'date_joined': {'read_only': True}
#         }


#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         context = super().get_context_data(instance, representation)
        
#         return context    

class ProfileSerializer(ProfileMixin, serializers.ModelSerializer):
    profile = ProfileAvatarSerializer(required=False, read_only=True)
    stars = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'profile', 'date_joined', 'stars')
        extra_kwargs = {
            'date_joined': {'read_only': True},
            'username': {'read_only': True},
            'first_name': {'read_only': True},
            'last_name': {'read_only': True},
        }


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        context = super().get_context_data(instance, representation)
        
        return context


# class UpdateProfileSerializer(ProfileMixin, serializers.ModelSerializer):
#     profile = ProfileAvatarSerializer(required=False)
    
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'first_name', 'last_name', 'profile', 'date_joined')
#         extra_kwargs = {
#             'date_joined': {'read_only': True}
#         }


#     def to_representation(self, instance):
#         representation = super().to_representation(instance)

#         date_joined = instance.date_joined + timedelta(hours=3)

#         representation['username'] = instance.username
#         representation['first_name'] = instance.first_name
#         representation['last_name'] = instance.last_name
#         representation['date_joined'] = date_joined.strftime(DATETIME_FORMAT)
        
#         return representation

        

class ChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(label='Старий пароль: ', required=True,  style={'input_type': 'password'}, write_only=True)
    new_password = serializers.CharField(label='Новий пароль: ', required=True, style={'input_type': 'password'}, write_only=True)
    confirm_password = serializers.CharField(label='Підтвердження паролю: ', required=True, style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ('old_password', 'new_password', 'confirm_password')


    def validate(self, attrs):
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')

        if new_password != confirm_password:
            raise ValidationError({'error_message': 'Паролі не співпадають!'})

        if len(new_password) < 8:
            raise serializers.ValidationError({'error_message': 'Пароль повинен містити мінімум 8 символів!'})
        
        if new_password.isalpha():
            raise serializers.ValidationError({'error_message': 'Пароль повинен мінімум 1 знак або число!'})
        
        if new_password.isdigit():
            raise serializers.ValidationError({'error_message': 'Пароль не може містити тільки цифри!'})

        return super().validate(attrs)



# class RatingSerializer(ProfileMixin, serializers.ModelSerializer):
#     profile = ProfileAvatarSerializer(required=False, read_only=True)
#     stars = serializers.IntegerField(write_only=True)
    
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'first_name', 'last_name', 'profile', 'date_joined', 'stars')
#         extra_kwargs = {
#             'date_joined': {'read_only': True},
#             'username': {'read_only': True},
#             'first_name': {'read_only': True},
#             'last_name': {'read_only': True},
#         }


#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         context = super().get_context_data(instance, representation)
        
#         return context