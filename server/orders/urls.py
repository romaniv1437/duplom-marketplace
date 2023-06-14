from .views import CreateOrdersAPIView, MyOrdersBuyAPIView, MyOrdersSellAPIView
from django.urls import path, include

urlpatterns = [
    path('create-orders/', CreateOrdersAPIView.as_view(), name='create-orders'),
    path('myorders/buy/', MyOrdersBuyAPIView.as_view(), name='my-orders'),
    path('myorders/sell/', MyOrdersSellAPIView.as_view(), name='my-orders-sell'),
]