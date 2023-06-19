from django.contrib import admin
from .models import Orders, OrdersProducts


class OrdersAdmin(admin.ModelAdmin):
    list_display = ('pk', 'first_name', 'last_name', 'email', 'country', 'city', 'post_index', 'time_create', 'is_published', 'buyer')
    list_display_links = ('pk', 'first_name', 'last_name', 'email', 'buyer')
    search_fields = ('first_name', 'country', 'city', 'post_index')
    list_editable = ('is_published',)


class OrdersProductsAdmin(admin.ModelAdmin):
    list_display = ('pk', 'products', 'count_products', 'total_price', 'currency', 'number_orders', 'status', 'seller')
    list_display_links = ('pk', 'products', 'number_orders', 'status', 'seller')


admin.site.register(Orders, OrdersAdmin)
admin.site.register(OrdersProducts, OrdersProductsAdmin)
