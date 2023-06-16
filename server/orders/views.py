from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .permissions import IsOwnerOrReadOnly

from .serializers import OrdersSerializers, OrdersSellSerializers
from .models import Orders
from users.models import Profile
from .utils import OrdersMixin


class CreateOrdersAPIView(generics.CreateAPIView):
    """
        СТВОРЕННЯ ЗАМОВЛЕННЯ ДЛЯ АВТОРИЗОВАНИХ КОРИСТУВАЧІВ
    """
    serializer_class = OrdersSerializers
    permission_classes = (IsAuthenticated,)


class MyOrdersBuyAPIView(generics.ListAPIView):
    serializer_class = OrdersSerializers
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Orders.objects.filter(buyer=self.request.user.pk).order_by('-id')
    

class MyOrdersSellAPIView(OrdersMixin, generics.ListCreateAPIView):
    serializer_class = OrdersSellSerializers
    permission_classes = (IsAuthenticated,)

    def put(self, request, *args, **kwargs):
        pk = request.data['id']
        update = Orders.objects.get(pk=pk)
        
        update = Orders.objects.get(pk=request.data['id'])
        update.status = request.data['status']
        update.save()
       

        return Response({'message': 'Статус змінено!'})


    def get_queryset(self):
        seller = Profile.objects.get(profile__username=self.request.user.username)

        return Orders.objects.filter(seller=seller.pk, status='В процесі').order_by('-id')
