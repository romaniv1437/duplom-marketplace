from rest_framework import serializers
from .models import Profile
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.contrib.auth import login, authenticate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'date_joined')

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(label="Псевдонім: ", required=True)
    first_name = serializers.CharField(label="Ім'я: ", required=True, write_only=True)
    last_name = serializers.CharField(label="Прізвище: ", required=False, write_only=True)
    password = serializers.CharField(label="Пароль: ", required=True, style={'input_type': 'password'}, write_only=True)
    confirm_password = serializers.CharField(label="Підтвердження паролю: ", required=True, style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'password', 'confirm_password')


    def create(self, validated_data):
        password = validated_data['password']
        confirm_password = validated_data['confirm_password']

        if password != confirm_password:
            raise ValidationError('Паролі не співпадають!')

        user = User.objects.create(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()

        return user
    

class LoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        label="Username",
        write_only=True
    )

    password = serializers.CharField(
        label="Password",
        style={'input_type': 'password'},
        write_only=True
    )

    class Meta:
        model = User
        fields = ('username', 'password')


    def __validate_data(self, username, password):
        if not User.objects.get(username=username):
            raise serializers.ValidationError('Користувач відсутній!')

        if not password:
            raise serializers.ValidationError('Не правильний пароль!')


    def validate(self, validate_data):
        username = validate_data.get('username')
        password = validate_data.get('password')

        user = authenticate(request=self.context.get('request'), username=username, password=password)
        model_object = User.objects.filter(username=username)

        # if not user:
        if not model_object:
            raise serializers.ValidationError('Користувач відсутній!')
        
        # if not password:
        if model_object and not User.objects.filter(password=password):
            raise serializers.ValidationError('Не правильний пароль!')
        
        validate_data['user'] = user

        return validate_data