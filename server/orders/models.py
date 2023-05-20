from django.db import models
from users.models import Profile



class Photo(models.Model):
    photo = models.ImageField()
    time_create = models.DateTimeField(auto_now_add=True)
    number_photo = models.IntegerField(default=True, blank=True, null=True)


    def __str__(self):
        return str(self.number_photo)


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, db_index=True, verbose_name='Категорія')
    slug = models.SlugField(max_length=255, unique=True, db_index=True, verbose_name='URL')
    is_active = models.BooleanField(default=True)


    class Meta:
        verbose_name = 'Категорія'
        verbose_name_plural = 'Категорії'

    
    def __str__(self):
        return self.name


class Orders(models.Model):
    title = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField()
    slug = models.SlugField(max_length=255, unique=True, db_index=True, verbose_name='URL')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)
    number_photo = models.IntegerField(null=True)
    is_active = models.BooleanField(default=True)
    cat = models.ForeignKey(Category, on_delete=models.CASCADE, blank=True, null=True, db_index=True, verbose_name='Категорія')
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True)


    class Meta:
        verbose_name = 'Товари'
        verbose_name_plural = 'Товари'

    
    def __str__(self):
        return self.title
