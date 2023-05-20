from django.contrib import admin
from .views import OrdersListView
from .models import Orders, Category, Photo


class OrdersAdmin(admin.ModelAdmin):
    list_display = ('pk', 'title', 'description', 'slug', 'price', 'time_create', 'time_update', 'number_photo', 'is_active', 'cat', 'user')
    list_display_links = ('pk', 'title', 'slug')
    list_editable = ('is_active',)
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('pk', 'name', 'slug', 'is_active')
    list_display_links = ('pk', 'slug')
    list_editable = ('is_active',)
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


class PhotoAdmin(admin.ModelAdmin):
    list_display = ('pk', 'photo', 'number_photo')


admin.site.register(Orders, OrdersAdmin)
admin.site.register(Photo, PhotoAdmin)
admin.site.register(Category, CategoryAdmin)