from rest_framework import serializers
from .models import Profile
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.contrib.auth import login, authenticate, get_user_model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'date_joined')


class RegisterSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(label="Ім'я: ", required=True, write_only=True)
    last_name = serializers.CharField(label="Прізвище: ", required=False, write_only=True)
    password = serializers.CharField(label="Пароль: ", required=True, style={'input_type': 'password'}, write_only=True)
    confirm_password = serializers.CharField(label="Підтвердження паролю: ", required=True, style={'input_type': 'password'}, write_only=True)


    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'password', 'confirm_password')


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['first_name'] = instance.first_name
        representation['last_name'] = instance.last_name
        representation['date_joined'] = instance.date_joined

        return representation


    def validate(self, attrs):
        data = dict(attrs)

        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'error_message': 'Паролі не співпадають!'})
        
        return super().validate(attrs)


    def create(self, validated_data):
        del validated_data['confirm_password']
        
        return User.objects.create_user(**validated_data)
    

class LoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField(label='Псевдонім: ', required=True)
    password = serializers.CharField(label="Пароль: ", required=True, style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password')


    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        
        raise serializers.ValidationError("Incorrect Credentials")