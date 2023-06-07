from rest_framework.response import Response
from rest_framework import generics, filters, views
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters import rest_framework as rest_filters 

from .serializers import OrdersSerializer, AddOrdersSerializer, OrdersPhotoSerializers
from .models import Orders, Photo
from .permissions import IsOwnerOrReadOnly
from .utils import OrdersMixinUpdate


class OrdersListView(generics.ListAPIView):
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer
    filter_backends = [rest_filters.DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'description']
    

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
    # queryset = Orders.objects.all()
    serializer_class = OrdersSerializer
    permission_classes = (IsOwnerOrReadOnly,)
    lookup_field = 'slug'


    def delete(self, request, *args, **kwargs):
        context = super().delete_my_orders(**kwargs)    # видалення оголошення та очищення пов'язаних фотографій

        return context


    def get_queryset(self):
        slug = self.kwargs['slug']

        return Orders.objects.filter(slug=slug)


class AddOrdersView(generics.ListCreateAPIView):
    queryset = Orders.objects.all()
    serializer_class = AddOrdersSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    # parser_classes = (FileUploadParser,)


class AddPhotoOrdersView(generics.ListCreateAPIView):
    queryset = Orders.objects.all()
    serializer_class = OrdersPhotoSerializers
    permission_classes = (IsAuthenticatedOrReadOnly,)
    lookup_field = 'slug'

    def post(self, request, *args, **kwargs):
        slug = self.kwargs['slug']
        order = Orders.objects.filter(slug=slug)
        order.update(number_photo=order[0].pk)
        
        for i in request.FILES:
            data = i

        photo = request.FILES[data]
        Photo.objects.create(photo=photo, number_photo=order[0].pk)
        
        return Response({'message': 'Оголошення відправлено!'})


class UpdatePhotoOrdersView(generics.ListCreateAPIView):
    queryset = Orders.objects.all()
    serializer_class = OrdersPhotoSerializers
    permission_classes = (IsAuthenticatedOrReadOnly,)
    lookup_field = 'slug'

    def post(self, request, *args, **kwargs):

        if not request.FILES:
            return Response({'message': 'Оголошення змінено!'})
        
        slug = kwargs['slug']
        number_photo = Orders.objects.filter(slug=slug)[0].number_photo
        Photo.objects.filter(number_photo=number_photo).delete()
        
        for i in request.FILES:
            data = i

        photo = request.FILES[data]
        Photo.objects.create(photo=photo, number_photo=number_photo)
        
        return Response({'message': 'Оголошення відправлено!'})

    


# class OrdersDestroyView(generics.RetrieveDestroyAPIView):
#     queryset = Orders.objects.all()
#     serializer_class = OrdersSerializer
#     permission_classes = (IsOwnerOrReadOnly,)


class MyOrdersView(generics.ListAPIView):
    serializer_class = OrdersSerializer
    permission_classes = (IsOwnerOrReadOnly,)
    filter_backends = [rest_filters.DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'description']


    def get_queryset(self):
        username = self.request.user.username

        return Orders.objects.filter(user__profile__username=username).order_by('-id')
