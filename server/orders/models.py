from django.db import models
from django.contrib.auth.models import User
from users.models import Profile
from products.models import Products, Category, Currency
from category.models import Category
from django.db import models
from django.contrib.auth.models import User
from users.models import Profile
from products.models import Products


class Orders(models.Model):
    first_name = models.CharField(max_length=100, verbose_name="Ім'я")
    last_name = models.CharField(max_length=100, verbose_name='Прізвище')
    email = models.EmailField(verbose_name='Електронна пошта')
    country = models.CharField(max_length=100, verbose_name='Країна')
    city = models.CharField(max_length=100, verbose_name='Місто')
    post_index = models.IntegerField(verbose_name='Поштовий індекс')
    count_products = models.IntegerField(default=1, verbose_name='Загальна кількість продуктів')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Час створення')
    # status = models.CharField(max_length=100, default='В процесі', verbose_name='Статус замовлення')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Замовник')

    class Meta:
        verbose_name = 'Замовлення'
        verbose_name_plural = 'Замовлення'
        ordering = ['-id']


    def __str__(self, *args, **kwargs):
        return str(self.buyer.username)


class OrdersProducts(models.Model):
    products = models.ForeignKey(Products, on_delete=models.CASCADE, verbose_name='Продукт')
    number_orders = models.IntegerField(null=True, db_index=True, verbose_name='Замовлення')
    count_products = models.IntegerField(default=1)
    total_price = models.FloatField()
    currency = models.CharField(max_length=100)
    status = models.CharField(max_length=100, default='В процесі', verbose_name='Статус замовлення')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Продавець')


    def __str__(self, *args, **kwargs):
        return str(self.products)