from django.db import models
from users.models import Profile
from category.models import Category



class Photo(models.Model):
    photo = models.ImageField(upload_to='products/%Y/%m/%d/', verbose_name='Фотографії')
    time_create = models.DateTimeField(auto_now_add=True)
    number_photo = models.IntegerField(null=False, default=True, blank=True)

    def __str__(self):
        return str(self.number_photo)
    
    class Meta:
        verbose_name = 'Фотографію'
        verbose_name_plural = 'Фотографії'
    

class Currency(models.Model):
    title = models.CharField(max_length=100, unique=True, db_index=True, verbose_name='Валюти')

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'Валюту'
        verbose_name_plural = 'Валюти'


class Products(models.Model):
    title = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField()
    slug = models.SlugField(max_length=255, unique=True, db_index=True, verbose_name='URL')
    price = models.FloatField()
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE, verbose_name='Валюти')
    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)
    number_photo = models.IntegerField(null=True, db_index=True, verbose_name='Фотографії')
    is_active = models.BooleanField(default=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, db_index=True, verbose_name='Категорія')
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True)


    class Meta:
        verbose_name = 'Товари'
        verbose_name_plural = 'Товари'

    
    def __str__(self):
        return self.title
