from rest_framework import serializers
from .models import Orders, OrdersProducts
from django.db.models import Sum
from products.serializers import ProductsSerializer
from users.serializers import ProfileSerializer
from products.models import Photo
from products.models import Products
from datetime import timedelta
from server.settings import DATETIME_FORMAT


class OrdersSerializer(serializers.ModelSerializer):
    status = serializers.CharField(read_only=True)
    buyer = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Orders
        fields = '__all__'

    def to_representation(self, instance):
        representanion = super().to_representation(instance)
        representanion['username'] = instance.buyer.username

        return representanion


class OrdersProductsSerializer(serializers.ModelSerializer):
    status = serializers.CharField(read_only=True)
    class Meta:
        model = OrdersProducts
        fields = '__all__'


    def to_representation(self, instance):
        representaion = super().to_representation(instance)

        product = Products.objects.filter(pk=instance.products.pk)
        products = ProductsSerializer(data=product, many=True)
        products.is_valid()
        representaion['products'] = products.data
        

        return representaion
   

class OrdersBuySerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = '__all__'


    def to_representation(self, instance):
        represenation = super().to_representation(instance)
        orders_products = OrdersProducts.objects.filter(number_orders=instance.pk)
    
        s = OrdersProductsSerializer(data=orders_products, many=True)
        
        s.is_valid()
        represenation['info'] = s.data
        avatar = instance.buyer.profile.avatar
        date_joined = instance.buyer.date_joined + timedelta(hours=3)

        if avatar:
            avatar = 'http://127.0.0.1:8000' + avatar.url
        else:
            avatar = None

        represenation['buyer'] = {
            'id': instance.buyer.pk,
            'username': instance.buyer.username,
            'first_name': instance.buyer.first_name,
            'last_name': instance.buyer.last_name,
            'date_joined': date_joined.strftime(DATETIME_FORMAT),
            'avatar': avatar
        }

        return represenation
    

class OrdersSellSerializer(serializers.ModelSerializer):
    status = serializers.CharField(write_only=True)
    number_orders = serializers.IntegerField(read_only=True)


    class Meta:
        model = OrdersProducts
        fields = ('status', 'number_orders')


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        del representation['number_orders']
        
        buyer = OrdersSerializer(data=Orders.objects.filter(pk=instance.number_orders), many=True)
        buyer.is_valid()
        buyer.data
        
        orders_products = OrdersProducts.objects.filter(pk=instance.pk, products=instance.products.pk)
        
        products = OrdersProductsSerializer(data=orders_products, many=True)
        products.is_valid()
        
        representation['info'] = buyer.data
        representation['products'] = products.data

        return representation
        

