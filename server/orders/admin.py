from django.contrib import admin
from .models import Orders


class OrdersAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'first_name',
        'last_name',
        'email',
        'country',
        'city',
        'post_index',
        'count_products',
        'time_create',
        'products',
        'status',
        'currency',
        'price',
        'buyer',
        'seller',
    )
    list_display_links = ('pk', 'first_name', 'last_name', 'email', 'products', 'buyer', 'seller')
    search_fields = ('first_name', 'country', 'city', 'post_index')


admin.site.register(Orders, OrdersAdmin)
