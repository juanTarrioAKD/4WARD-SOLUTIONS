from rest_framework import permissions

class IsCliente(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.rol == 'cliente'

class IsEmpleado(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.rol == 'empleado'

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.rol == 'admin'

class IsEmpleadoOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.rol in ['empleado', 'admin']

class IsClienteOrEmpleadoOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.rol in ['cliente', 'empleado', 'admin']

class IsOwnerOrEmpleadoOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Si es admin o empleado, puede ver cualquier objeto
        if request.user.rol in ['admin', 'empleado']:
            return True
        # Si es cliente, solo puede ver sus propios objetos
        return obj.usuario == request.user 