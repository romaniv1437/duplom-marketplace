from rest_framework import permissions


class IsNotRegistered(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return str(request.user) == str('AnonymousUser')
    

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return str(obj.user) == str(request.user)
        # return obj.owner == request.user
        # return obj.user == request.user.profile

    def has_permission(self, request, view):
        """
            Кастомний permission під HTTP-запити.
        """
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return bool(request.user and request.user.is_staff)