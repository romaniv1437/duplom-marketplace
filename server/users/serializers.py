from rest_framework import serializers
from rest_framework.response import Response
from .models import Profile
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.contrib.auth import login, authenticate, get_user_model
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
        else:
            representation['avatar'] = None

        return representation


class ProfileSerializer(serializers.ModelSerializer):
    # username = serializers.CharField(label='Електронна пошта: ', required=False, write_only=True)
    # first_name = serializers.CharField(label="Ім'я", required=False, write_only=True)
    # last_name = serializers.CharField(label="Прізвище", required=False, write_only=True)

    profile = ProfileAvatarSerializer(required=False)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'profile', 'date_joined')
        extra_kwargs = {
            'date_joined': {'read_only': True}
        }


    def to_representation(self, instance):
        representation = super().to_representation(instance)

        try:
            representation['avatar'] = representation['profile']['avatar']
            del representation['profile']
        except:
            representation['avatar'] = None
            del representation['profile']

        date_joined = instance.date_joined + timedelta(hours=3)

        representation['username'] = instance.username
        representation['first_name'] = instance.first_name
        representation['last_name'] = instance.last_name
        representation['date_joined'] = date_joined.strftime(DATETIME_FORMAT)
        
        return representation


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



class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(label='Електронна пошта: ', write_only=True)
    first_name = serializers.CharField(label="Ім'я: ", required=True, write_only=True)
    last_name = serializers.CharField(label='Прізвище: ', required=False, write_only=True)
    password = serializers.CharField(label='Пароль: ', required=True, style={'input_type': 'password'}, write_only=True)
    confirm_password = serializers.CharField(label='Підтвердження паролю: ', required=True, style={'input_type': 'password'}, write_only=True)


    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'password', 'confirm_password')


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        date_joined = instance.date_joined + timedelta(hours=3)
        representation['avatar'] = None
        representation['username'] = instance.username
        representation['first_name'] = instance.first_name
        representation['last_name'] = instance.last_name
        representation['date_joined'] = date_joined.strftime(DATETIME_FORMAT)

        return representation


    def validate(self, attrs):
        data = dict(attrs)

        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'error_message': 'Паролі не співпадають!'})
        
        if User.objects.filter(username__icontains=data['username']):
            raise serializers.ValidationError({'error_message': 'Обліковий запис присутній!'})
        
        if len(data['password']) < 8:
            raise serializers.ValidationError({'error_message': 'Пароль повинен містити мінімум 8 символів!'})
        
        if data['password'].isalpha():
            raise serializers.ValidationError({'error_message': 'Пароль повинен мінімум 1 знак або число!'})
        
        if data['password'].isdigit():
            raise serializers.ValidationError({'error_message': 'Пароль не може містити тільки цифри!'})
        
        return super().validate(attrs)
    

    def create(self, validated_data):
        del validated_data['confirm_password']
        validated_data['username'] = validated_data['username'].lower()
        
        return User.objects.create_user(**validated_data)
    

class LoginSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False, read_only=True)
    username = serializers.CharField(label='Електронна пошта: ', required=True)
    password = serializers.CharField(label='Пароль: ', required=True, style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'avatar')


    def validate(self, data):
        username = data['username']

        registered = User.objects.filter(username=username)
        
        if not registered:
            raise serializers.ValidationError({'error_message': 'Обліковий запис відсутній!'})
        
        user = authenticate(**data)
        
        if not user:
            raise serializers.ValidationError({'error_message': 'Не правильний пароль!'})

        if user and user.is_active:
            return user
        
        raise serializers.ValidationError({'error_message': 'Виникла помилка...'})