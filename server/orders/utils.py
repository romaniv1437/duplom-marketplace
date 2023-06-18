from products.models import Products
from products.serializers import ProductsSerializer
from server.settings import DATETIME_FORMAT
from .models import Orders, OrdersProducts
from .serializers import OrdersProductsSerializer
from datetime import timedelta


# class OrdersMixin:
#     def get_context_data(self, instance, representation={}, *args, **kwargs):
#         order = Orders.objects.get(buyer=instance.buyer)
#         orders_products = OrdersProducts.objects.filter(number_orders=order.pk)
    
#         products = OrdersProductsSerializer(data=orders_products, many=True)
        
#         products.is_valid()
#         representation['products'] = products.data
#         avatar = instance.buyer.profile.avatar
#         date_joined = instance.buyer.date_joined + timedelta(hours=3)

#         if avatar:
#             avatar = 'http://127.0.0.1:8000' + avatar.url
#         else:
#             avatar = None

#         representation['buyer'] = {
#             'id': instance.buyer.pk,
#             'username': instance.buyer.username,
#             'first_name': instance.buyer.first_name,
#             'last_name': instance.buyer.last_name,
#             'date_joined': date_joined.strftime(DATETIME_FORMAT),
#             'avatar': avatar
#         }