from django.http import Http404
from django.forms.models import model_to_dict
from django.shortcuts import redirect

from .models import Orders, Photo


class OrdersMixinUpdate:

    def get_context_data(self, *args, **kwargs):
        """
            ОГОЛОШЕННЯ АБСТРАКТНОГО КЛАСУ, ЯКИЙ ОПРАЦЬОВУЄ ОГОЛОШЕННЯ КОРИСТУВАЧА
            ТА ВИВОДИТЬ РЕЗУЛЬТАТ.
            ЯКЩО ОГОЛОШЕННЯ ВІДСУТНЄ, ТО ГЕНЕРАЦІЯ СТОРІНКИ 404.
        """
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
    
    
    def delete_my_orders(self, *args, **kwargs):
        """
        ОГОЛОШЕННЯ АБСТРАКТНОГО КЛАСУ ВИДАЛЕННЯ ОГОЛОШЕННЯ ТА АВТОМАТИЧНЕ ОЧИЩЕННЯ
        ВІД ПОВ'ЯЗАНИХ ФОТОГРАФІЙ.
        """
        slug = kwargs['slug']
        
        data = Orders.objects.filter(slug=slug)[0]
        data.delete()
        Photo.objects.filter(number_photo=data.number_photo).delete()

        return redirect('home')

    
    def update_photo(self, *args, **kwargs):
        slug = kwargs['slug']
        number_photo = Orders.objects.filter(slug=slug)[0].number_photo
        Photo.objects.filter(number_photo=number_photo).delete()

        