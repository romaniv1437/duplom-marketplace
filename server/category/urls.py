from django.urls import path, include
from .views import *


urlpatterns = [
    path('category/', CategoryListView.as_view(), name='category'),
    path('category/<slug:slug>/', OrdersToCategoryListView.as_view(), name='orders-category'),
]