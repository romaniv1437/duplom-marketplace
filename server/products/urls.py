from django.urls import path, include, re_path
from .views import *
from rest_framework import routers

from rest_framework_simplejwt.views import (
    # TokenObtainPairView,
    # TokenRefreshView,
    TokenVerifyView
)



urlpatterns = [
    # '', include(router.urls),
    path('products/', ProductsListView.as_view(), name='home'),
    path('myproducts/', MyProductsView.as_view(), name='myproducts'),
    path('add-products/', AddProductsView.as_view(), name='addproducts'),
    path('products/<slug:slug>/', ProductsUpdateView.as_view()),
    path('add-photo/<slug:slug>/', AddPhotoProductsView.as_view(), name='add-photo'),
    path('update-photo/<slug:slug>/', UpdatePhotoProductsView.as_view(), name='update-photo'),
    path('currency/', ListCurrencyAPIView.as_view(), name='currency')
]