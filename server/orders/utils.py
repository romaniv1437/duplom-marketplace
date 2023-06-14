from products.models import Products
from products.serializers import ProductsSerializer
from server.settings import DATETIME_FORMAT

from datetime import timedelta


# class OrdersMixin:
#     def get_context_data(self, instance, representation, *args, **kwargs):
#         """
#             ПЕРЕДАЧА СЕРІАЛІЗОВАНИХ ДАНИХ ПРО КОРИСТУВАЧА ТА ЙОГО ЗАМОВЛЕННЯ
#         """
#         date_joined = instance.buyer.date_joined + timedelta(hours=3)
#         time_create = instance.time_create + timedelta(hours=3)
#         rating = Rating.objects.filter(for_user=instance.buyer.pk)
#         avatar_image = Profile.objects.filter(profile__username=instance.buyer.username)
#         avatar = 'http://127.0.0.1:8000' + avatar_image[0].avatar.url if avatar_image[0].avatar else None
        
#         n = len(rating)
        
#         get_orders_products = OrdersProducts.objects.filter(number_orders=instance.pk).order_by('-id')[0].products
#         data = Products.objects.filter(pk=get_orders_products.pk)

#         print(OrdersProducts.objects.filter(number_orders=instance.pk))
#         s = OrdersProductsSerializers(data=OrdersProducts.objects.filter(number_orders=instance.pk), many=True)
#         s.is_valid()
#         print(s.data)
 
#         products = ProductsSerializer(data=data, many=True)
#         products.is_valid()

#         representation['time_create'] = time_create.strftime(DATETIME_FORMAT)
#         representation['buyer'] = {
#             'id': instance.buyer.pk,
#             'username': instance.buyer.username,
#             'first_name': instance.buyer.first_name,
#             'last_name': instance.buyer.last_name,
#             'date_joined': date_joined.strftime(DATETIME_FORMAT),
#             'stars': rating.aggregate(Sum('stars'))['stars__sum'] / n if rating else 0.00,
#             'persons': n,
#             'avatar': avatar,
#         }
#         representation['products'] = s.data

#         Products.objects.filter(user=instance.buyer.pk)


#         return representation


class OrdersMixin:
    def get_context_data(self, instance, representation={}, *args, **kwargs):
        try:
            del representation['seller']
        except:
            pass

        serializer = ProductsSerializer(data=Products.objects.filter(pk=instance.products.pk), many=True)
        serializer.is_valid()
        representation['products'] = serializer.data

        date_joined = instance.buyer.date_joined + timedelta(hours=3)
        get_avatar = instance.buyer.profile.avatar

        if get_avatar:
            avatar = 'http://127.0.0.1:8000' + get_avatar.url
        else:
            avatar = None

        representation['buyer'] = {
            'id': instance.buyer.pk,
            'username': instance.buyer.username,
            'first_name': instance.buyer.first_name,
            'last_name': instance.buyer.last_name,
            'date_joined': date_joined.strftime(DATETIME_FORMAT),
            'avatar': avatar,
        }

        return representation