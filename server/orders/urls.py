from django.urls import path, include, re_path
from .views import *
from rest_framework import routers

from rest_framework_simplejwt.views import (
    # TokenObtainPairView,
    # TokenRefreshView,
    TokenVerifyView
)

# router = routers.DefaultRouter()
# router.register(r'create_orders', OrdersCRUDApi, basename='crud')
# router.register(r'orders', OrdersListView, basename='orders-list')

urlpatterns = [
    # '', include(router.urls),
    path('orders/', OrdersListView.as_view(), name='home'),
    path('myorders/', MyOrdersView.as_view()),
    path('add-orders/', AddOrdersView.as_view(), name='add-orders'),
    path('orders/<int:pk>/', OrdersUpdateView.as_view()),
    path('delete/<int:pk>/', OrdersDestroyView.as_view()),
    
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    re_path(r'api/auth/', include('djoser.urls')), # api/auth/users/ -> register POST
    re_path(r'^auth/', include('djoser.urls.authtoken')),
]