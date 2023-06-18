from .views import CreateOrdersAPIView, OrdersListBuyAPIView, OrdersListSellAPIView, CreateOrdersProductsAPIView
from django.urls import path, include

urlpatterns = [
    path('create-orders/', CreateOrdersAPIView.as_view(), name='create-orders'),
    path('myorders/buy/', OrdersListBuyAPIView.as_view(), name='myorders-buy'),
    path('myorders/sell/', OrdersListSellAPIView.as_view(), name='myorders-sell'),
    path('create-orders-products/', CreateOrdersProductsAPIView.as_view(), name='create-orders-products'),
]