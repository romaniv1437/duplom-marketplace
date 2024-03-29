from rest_framework.response import Response
from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters import rest_framework as rest_filters 

from .serializers import ProductsSerializer, AddProductsSerializer, ProductsPhotoSerializers, CurrencySerializers
from .models import Products, Photo, Currency
from .permissions import IsOwnerOrReadOnly
from .utils import ProductsMixinUpdate


class ProductsListView(generics.ListAPIView):
    # queryset = Products.objects.all().order_by('-time_create')
    serializer_class = ProductsSerializer
    filter_backends = [rest_filters.DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'description']

    def get_queryset(self):
        return Products.objects.exclude(user__profile__username=self.request.user.username)


class ProductsUpdateView(ProductsMixinUpdate, generics.RetrieveUpdateDestroyAPIView):
    """
        ЗГОДОМ ДОБАВИТИ UPDATE SERIALIZER ДЛЯ АПДЕЙТІВ
    """
    # queryset = Products.objects.all()
    serializer_class = ProductsSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    lookup_field = 'slug'


    def delete(self, request, *args, **kwargs):
        context = super().delete_my_products(**kwargs)    # видалення оголошення та очищення пов'язаних фотографій

        return context


    def get_queryset(self):
        slug = self.kwargs['slug']

        return Products.objects.filter(slug=slug)
    

    def update(self, request, *args, **kwargs):
        super().update_photo(self.kwargs['slug'])
        
        return super().update(request, *args, **kwargs)


class AddProductsView(generics.ListCreateAPIView):
    queryset = Products.objects.all()
    serializer_class = AddProductsSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)


class AddPhotoProductsView(generics.ListCreateAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductsPhotoSerializers
    permission_classes = (IsAuthenticatedOrReadOnly,)
    lookup_field = 'slug'

    def post(self, request, *args, **kwargs):
        slug = self.kwargs['slug']
        order = Products.objects.filter(slug=slug)
        order.update(number_photo=order[0].pk)
        
        for i in request.FILES:
            data = i

        photo = request.FILES[data]
        Photo.objects.create(photo=photo, number_photo=order[0].pk)
        
        return Response()


class UpdatePhotoProductsView(ProductsMixinUpdate, generics.ListCreateAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductsPhotoSerializers
    permission_classes = (IsOwnerOrReadOnly,)
    lookup_field = 'slug'


    def post(self, request, *args, **kwargs):

        if not request.FILES:
            return Response({'message': 'Оголошення змінено!'})
        
        slug = kwargs['slug']
        number_photo = Products.objects.filter(slug=slug)[0].number_photo
        # Photo.objects.filter(number_photo=number_photo).delete()
        
        for i in request.FILES:
            data = i

        photo = request.FILES[data]
        Photo.objects.create(photo=photo, number_photo=number_photo)
        
        return Response({'message': 'Оголошення відправлено!'})

    
class ListCurrencyAPIView(generics.ListAPIView):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializers
    permission_classes = (IsOwnerOrReadOnly,)


class MyProductsView(generics.ListAPIView):
    serializer_class = ProductsSerializer
    permission_classes = (IsOwnerOrReadOnly,)
    filter_backends = [rest_filters.DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'description']


    def get_queryset(self):
        username = self.request.user.username

        return Products.objects.filter(user__profile__username=username).order_by('-id')
