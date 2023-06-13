from rest_framework import generics


class CreateOrdersAPIView(generics.CreateAPIView):
    """
        СТВОРЕННЯ ЗАМОВЛЕННЯ ДЛЯ АВТОРИЗОВАНИХ КОРИСТУВАЧІВ
    """