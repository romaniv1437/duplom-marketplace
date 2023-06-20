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


class CreateOrdersProductsAPIView(generics.CreateAPIView):
    serializer_class = OrdersProductsSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class OrdersListBuyAPIView(generics.ListAPIView):
    serializer_class = OrdersBuySerializer
    permission_classes = (IsAuthenticated,)

    def delete(self, request, *args, **kwargs):
        pk = request.data['id']
        orders = Orders.objects.get(pk=pk)
        orders.is_published = False
        orders.save()

        return Response({'message': 'Ваше замовлення переміщено до історії'})

    def get_queryset(self):
        return Orders.objects.filter(buyer=self.request.user, is_published=True)


class OrdersListSellAPIView(generics.ListCreateAPIView):
    serializer_class = OrdersSellSerializer
    permission_classes = (IsAuthenticated,)

    def put(self, request, *args, **kwargs):
        pk = request.data['product']
        orders = OrdersProducts.objects.get(pk=pk)
        orders.status = 'Відправлено'
        orders.save()
        
        return Response({'message': 'Статус замовлення успішно змінений!'})

    def get_queryset(self):
        return OrdersProducts.objects.filter(seller=self.request.user, status='В процесі')
    

class OrdersListHistorySellAPIView(generics.ListAPIView):
    serializer_class = OrdersSellSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return OrdersProducts.objects.filter(seller=self.request.user, status='Відправлено')


class OrdersListHistoryBuyAPIView(generics.ListAPIView):
    serializer_class = OrdersBuySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Orders.objects.filter(buyer=self.request.user, is_published=False)
