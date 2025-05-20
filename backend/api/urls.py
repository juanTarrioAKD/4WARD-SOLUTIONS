from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, VehiculoViewSet, PublicacionViewSet
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'vehiculos', VehiculoViewSet, basename='vehiculo')
router.register(r'publicaciones', PublicacionViewSet, basename='publicacion')

urlpatterns = [
    path('', include(router.urls)),
] 