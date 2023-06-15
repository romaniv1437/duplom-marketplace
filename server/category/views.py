from rest_framework import generics, filters
from django_filters import rest_framework as rest_filters
from products.models import Category, Products
from products.serializers import ProductsSerializer
from .serializers import CategorySerializer



class CategoryListView(generics.ListAPIView):
    """
        ВІДОБРАЖЕННЯ ВСІХ КАТЕГОРІЙ ( РИНКІВ ) ДЛЯ КОРИСТУВАЧІВ
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductsToCategoryListView(generics.ListAPIView):
    serializer_class = ProductsSerializer
    filter_backends = [rest_filters.DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'description']
    

    def get_queryset(self, *args, **kwargs):
        return Products.objects.filter(category__slug=self.kwargs['slug'])