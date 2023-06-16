from rest_framework import serializers

from .models import Orders
from django.db.models import Sum
from .utils import OrdersMixin
from products.serializers import ProductsSerializer
from products.models import Products
from datetime import timedelta
from server.settings import DATETIME_FORMAT


class OrdersSerializers(OrdersMixin, serializers.ModelSerializer):
    buyer = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Orders
        fields = '__all__'
        extra_kwargs = {
            'status': {'read_only': True},
            'seller': {'read_only': True}
        }


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        context = super().get_context_data(instance=instance, representation=representation)
        
        return context
    

    def create(self, validated_data):
        seller = validated_data['products'].user
        validated_data['seller'] = seller

        return super().create(validated_data)
    

class OrdersSellSerializers(OrdersMixin, serializers.ModelSerializer):
    status = serializers.CharField(write_only=True)

    class Meta:
        model = Orders
        fields = '__all__'
        # read_only_fields = ('first_name', 'last_name', 'email', 'country', 'city', 'post_index', 'count_products', 'price', 'currency', 'products', 'buyer', 'seller')


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        context = super().get_context_data(instance=instance, representation=representation)
        context['status'] = instance.status
        
        return context
