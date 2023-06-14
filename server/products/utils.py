from django.http import Http404
from django.forms.models import model_to_dict
from django.shortcuts import redirect
from rest_framework.response import Response

from .models import Products, Photo


class ProductsMixinUpdate:
    def delete_my_products(self, *args, **kwargs):
        """
        ОГОЛОШЕННЯ АБСТРАКТНОГО КЛАСУ ВИДАЛЕННЯ ОГОЛОШЕННЯ ТА АВТОМАТИЧНЕ ОЧИЩЕННЯ
        ВІД ПОВ'ЯЗАНИХ ФОТОГРАФІЙ.
        """
        slug = kwargs['slug']
        
        data = Products.objects.filter(slug=slug)[0]
        data.delete()
        Photo.objects.filter(number_photo=data.number_photo).delete()

        return Response({'message': 'Ваше оголошення успішно видалене!'})

    
    def update_photo(self, slug: str, *args, **kwargs):
        number_photo = Products.objects.filter(slug=slug)[0].number_photo
        Photo.objects.filter(number_photo=number_photo).delete()

        return Response({'message': 'Фотографії успішно оновлені!'})

        