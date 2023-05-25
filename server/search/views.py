from django.shortcuts import render
from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import AllowAny
from orders.models import *

from .serializers import SearchSeriazlier
from orders.serializers import OrdersSerializer


class SearchOrdersAPIView(generics.ListAPIView):
    # queryset = Orders.objects.all()
    serializer_class = SearchSeriazlier
    permission_classes = (AllowAny,)
    lookup_field = 'search_word'

    def get_queryset(self, *args, **kwargs):
        search_word = self.kwargs['search_word']
        return Orders.objects.filter(Q(title__icontains=search_word) | Q(description__icontains=search_word))
