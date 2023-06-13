from django.urls import path, include
from .views import *


urlpatterns = [
    path('category/', CategoryListView.as_view(), name='category'),
    path('category/<slug:slug>/', ProductsToCategoryListView.as_view(), name='products-category'),
]