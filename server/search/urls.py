from django.urls import path, include, re_path
from .views import *

urlpatterns = [
    path('search/<slug:search_word>/', SearchOrdersAPIView.as_view(), name='search')
]