from django.http import Http404
from django.forms.models import model_to_dict

from .models import Orders, Photo
from .permissions import IsOwnerOrReadOnly


class DataMixinOrders:
    """
        ОГОЛОШЕННЯ АБСТРАКТНОГО КЛАСУ, ЯКИЙ ОПРАЦЬОВУЄ ОГОЛОШЕННЯ КОРИСТУВАЧА
        ТА ВИВОДИТЬ РЕЗУЛЬТАТ.
        ЯКЩО ОГОЛОШЕННЯ ВІДСУТНЄ, ТО ГЕНЕРАЦІЯ СТОРІНКИ 404.
    """
    permission_classes = (IsOwnerOrReadOnly,)
    def get_context_data(self, *args, **kwargs):
        slug = kwargs['slug']

        data = Orders.objects.filter(slug=slug)

        if not data:
            raise Http404()
        
        response = model_to_dict(data[0])
        photos = Photo.objects.filter(number_photo=data[0].number_photo)
        photo = ['http://127.0.0.1:8000' + i.photo.url for i in photos]
        del response['number_photo']
        response['images'] = photo

        return response