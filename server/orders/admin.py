from django.contrib import admin
from .views import OrdersListView
from .models import Orders, Category, Photo, Currency
from .models import Orders, Category, Photo


class OrdersAdmin(admin.ModelAdmin):
    list_display = ('pk', 'title', 'description', 'slug', 'price',  'time_create', 'time_update', 'number_photo', 'is_active', 'category', 'user')
    list_display_links = ('pk', 'title', 'slug')
    list_editable = ('is_active',)
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}




class PhotoAdmin(admin.ModelAdmin):
    list_display = ('pk', 'photo', 'number_photo')


class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('pk', 'title')


admin.site.register(Orders, OrdersAdmin)
admin.site.register(Photo, PhotoAdmin)
admin.site.register(Currency, CurrencyAdmin)