from rest_framework import serializers
from orders.models import Orders, Photo


class SearchSeriazlier(serializers.ModelSerializer):
    class Meta:
        model = Orders
        exclude = ('number_photo', 'is_active')


    def to_representation(self, instance):
        data = Orders.objects.filter(pk=instance.id)[0].number_photo
        photo = ['http://127.0.0.1:8000' + i.photo.url for i in Photo.objects.filter(number_photo=data)]

        representation = super().to_representation(instance)
        representation['currency'] = instance.currency.title
        representation["category"] = [{'title': instance.category.title, 'slug': instance.category.slug}]
        representation["user"] = [{
            'title': instance.user.profile.username,
            'email': instance.user.profile.email,
            'first_name': instance.user.profile.first_name,
        }]
        representation["photo"] = photo

        return representation