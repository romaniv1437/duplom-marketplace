from django.shortcuts import render
from django.http import Http404, HttpResponseRedirect
from django.urls import reverse_lazy

from rest_framework.response import Response
from rest_framework import generics, views
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.views import TokenViewBase

from .serializer import OrdersSerializer, AddOrdersSerializer, TokenObtainLifetimeSerializer, TokenRefreshLifetimeSerializer
from .models import Orders, Category
from .permissions import IsOwnerOrReadOnly, IsAdminOrReadOnly
from users.models import Profile
from django.contrib.auth.models import User


class OrdersListView(generics.ListAPIView):
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer
    # permission_classes = (IsAuthenticatedOrReadOnly,)


class OrdersUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """
        ЗГОДОМ ДОБАВИТИ UPDATE SERIALIZER ДЛЯ АПДЕЙТІВ
    """
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer
    permission_classes = (IsOwnerOrReadOnly,)


class AddOrdersView(generics.CreateAPIView):
    queryset = Orders.objects.all()
    serializer_class = AddOrdersSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)


class OrdersDestroyView(generics.RetrieveDestroyAPIView):
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer
    permission_classes = (IsOwnerOrReadOnly,)


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