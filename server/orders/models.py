from django.db import models
from django.contrib.auth.models import User
from products.models import Products


class Orders(models.Model):
    first_name = models.CharField(max_length=100, verbose_name="Ім'я")
    last_name = models.CharField(max_length=100, verbose_name='Прізвище')
    email = models.EmailField(verbose_name='Електронна пошта')
    country = models.CharField(max_length=100, verbose_name='Країна')
    city = models.CharField(max_length=100, verbose_name='Місто')
    post_index = models.IntegerField(verbose_name='Поштовий індекс')
    count_products = models.IntegerField(default=1, verbose_name='Кількість продуктів')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Час створення')
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Замовник')


class OrdersProducts(models.Model):
    products = models.ForeignKey(Products, on_delete=models.CASCADE, verbose_name='Продукт')
    number_orders = models.IntegerField(null=True, db_index=True, verbose_name='Замовлення')
    status = models.CharField(max_length=100, default='В процесі', verbose_name='Статус замовлення')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Продавець')

