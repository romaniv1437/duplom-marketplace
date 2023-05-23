from django.db import models


class Category(models.Model):
    title = models.CharField(max_length=100, unique=True, db_index=True, verbose_name='Категорія')
    slug = models.SlugField(max_length=255, unique=True, db_index=True, verbose_name='URL')


    class Meta:
        verbose_name = 'Категорія'
        verbose_name_plural = 'Категорії'

    
    def __str__(self):
        return self.title
