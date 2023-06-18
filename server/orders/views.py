from rest_framework import generics, pagination
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .permissions import IsOwnerOrReadOnly

from .serializers import OrdersSerializer, OrdersProductsSerializer, OrdersBuySerializer, OrdersSellSerializer
from .models import Orders, OrdersProducts
from users.models import Profile
from products.models import Products
from products.serializers import ProductsSerializer


class CreateOrdersAPIView(generics.CreateAPIView):
    """
        СТВОРЕННЯ ЗАМОВЛЕННЯ ДЛЯ АВТОРИЗОВАНИХ КОРИСТУВАЧІВ
    """
    serializer_class = OrdersSerializer
    permission_classes = (IsAuthenticated,)

    # def post(self, request, *args, **kwargs):
    #     products = Products.objects.get(pk=1)
    #     count_products = 2
    #     total_price = 250
    #     currency = '$'
    #     number_orders = 1 if Orders.objects.first() is None else Orders.objects.first().pk + 1
    #     seller = products.user.profile
        
    #     order = OrdersProducts.objects.create(
    #         products=products,
    #         count_products=count_products,
    #         total_price=total_price,
    #         currency=currency,
    #         number_orders=number_orders,
    #         seller=seller
    #     )
    #     order.save()


    #     return super().post(request, *args, **kwargs)

class CreateOrdersProductsAPIView(generics.CreateAPIView):
    serializer_class = OrdersProductsSerializer

    def post(self, request, *args, **kwargs):
        print(request.data)
        return super().post(request, *args, **kwargs)


class OrdersListBuyAPIView(generics.ListAPIView):
    serializer_class = OrdersBuySerializer

    def get_queryset(self):
        return Orders.objects.filter(buyer=self.request.user)


class OrdersListPagination(pagination.PageNumberPagination):
    page_size = 1
    page_size_query_param = 'page_size'
    max_page_size = 1000


class OrdersListSellAPIView(generics.ListCreateAPIView):
    serializer_class = OrdersSellSerializer
    pagination_class = OrdersListPagination

    def get_queryset(self):
        return OrdersProducts.objects.filter(seller=self.request.user, status='В процесі')