from django.contrib import admin
from .models import Orders, OrdersProducts


class OrdersAdmin(admin.ModelAdmin):
    list_display = ('pk', 'first_name', 'last_name', 'email', 'country', 'city', 'post_index', 'count_products', 'time_create', 'user')
    list_display_links = ('pk', 'user')
    search_fields = ('first_name', 'country', 'city', 'post_index')


class OrdersProductsAdmin(admin.ModelAdmin):
    list_display = ('pk', 'products', 'number_orders', 'status', 'seller')
    list_display_links = ('pk', 'number_orders', 'seller')
    search_fields = ('status',)


admin.site.register(Orders, OrdersAdmin)
admin.site.register(OrdersProducts, OrdersProductsAdmin)
