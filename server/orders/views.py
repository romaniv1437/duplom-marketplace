from django.http import Http404
from django.shortcuts import redirect

from rest_framework.response import Response
from rest_framework import generics, views
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.views import TokenViewBase

from .serializers import OrdersSerializer, AddOrdersSerializer, TokenObtainLifetimeSerializer, TokenRefreshLifetimeSerializer
from .models import Orders, Photo
from .permissions import IsOwnerOrReadOnly
from .utils import OrdersMixinUpdate


class OrdersListView(generics.ListAPIView):
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer
    

    # def get(self, request, *args, **kwargs):
    #     data = Orders.objects.all()

    #     response = {}

    #     if not data:
    #         raise Http404()
        
    #     for i in data:
    #         response[i.pk] = model_to_dict(i)
    #         photos = Photo.objects.filter(number_photo=i.number_photo)
    #         photo = ['http://127.0.0.1:8000' + i.photo.url for i in photos]
    #         response[i.pk]['photo'] = photo


    #     return Response(response)
    
    
class OrdersUpdateView(OrdersMixinUpdate, generics.RetrieveUpdateDestroyAPIView):
    """
        ЗГОДОМ ДОБАВИТИ UPDATE SERIALIZER ДЛЯ АПДЕЙТІВ
    """
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer
    permission_classes = (IsOwnerOrReadOnly,)
    lookup_field = 'slug'


    # def get(self, request, *args, **kwargs):
    #     context = super().get_context_data(**kwargs)    # звертання до супер-функції super та батьківського методу get_context_data

    #     return Response(context)
    

    def delete(self, request, *args, **kwargs):
        context = super().delete_my_orders(**kwargs)    # видалення оголошення та очищення пов'язаних фотографій
        
        return context
    

class AddOrdersView(generics.CreateAPIView):
    queryset = Orders.objects.all()
    serializer_class = AddOrdersSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)


# class OrdersDestroyView(generics.RetrieveDestroyAPIView):
#     queryset = Orders.objects.all()
#     serializer_class = OrdersSerializer
#     permission_classes = (IsOwnerOrReadOnly,)


class MyOrdersView(generics.ListAPIView):
    serializer_class = OrdersSerializer
    permission_classes = (IsOwnerOrReadOnly,)


    def get_queryset(self):
        username = self.request.user.username
        
        return Orders.objects.filter(user__profile__username=username)



class TokenObtainPairView(TokenViewBase):
    """
        Return JWT tokens (access and refresh) for specific user based on username and password.
    """
    serializer_class = TokenObtainLifetimeSerializer


class TokenRefreshView(TokenViewBase):
    """
        Renew tokens (access and refresh) with new expire time based on specific user's access token.
    """
    serializer_class = TokenRefreshLifetimeSerializer