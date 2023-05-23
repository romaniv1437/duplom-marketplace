from django.shortcuts import render
from rest_framework import generics

from orders.models import Category, Orders
from orders.serializer import OrdersSerializer
from .serializer import CategorySerializer



class CategoryListView(generics.ListAPIView):
    """
        ВІДОБРАЖЕННЯ ВСІХ КАТЕГОРІЙ ( РИНКІВ ) ДЛЯ КОРИСТУВАЧІВ
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class OrdersToCategoryListView(generics.ListAPIView):
    serializer_class = OrdersSerializer

    def get_queryset(self, *args, **kwargs):
        return Orders.objects.filter(category__slug=self.kwargs['slug'])