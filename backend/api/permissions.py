from rest_framework import permissions

class IsCliente(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.rol.id == 1

class IsEmpleado(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.rol.id == 2

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.rol.id == 3

class IsEmpleadoOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.rol.id in [2, 3]

class IsClienteOrEmpleadoOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.rol.id in [1, 2, 3]

class IsOwnerOrEmpleadoOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Si es admin o empleado, puede ver cualquier objeto
        if request.user.rol.id in [2, 3]:
            return True
        # Si es cliente, solo puede ver sus propios objetos
        return obj.usuario == request.user 