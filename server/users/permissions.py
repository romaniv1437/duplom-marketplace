from rest_framework import permissions


class IsNotRegistered(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return str(request.user) == str('AnonymousUser')