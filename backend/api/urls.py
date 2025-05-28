from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    UsuarioViewSet, VehiculoViewSet, PublicacionViewSet,
    SucursalViewSet, PoliticaDeCancelacionViewSet,
    MarcaViewSet, EstadoVehiculoViewSet, CategoriaViewSet,
    CalificacionViewSet, ModeloViewSet, LocalidadViewSet,
    PreguntaViewSet, getDatosCategorias, getDatosUsuarios, registerUser
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'vehiculos', VehiculoViewSet, basename='vehiculo')
router.register(r'publicaciones', PublicacionViewSet, basename='publicacion')
router.register(r'sucursales', SucursalViewSet, basename='sucursal')
router.register(r'politicas', PoliticaDeCancelacionViewSet, basename='politica')
router.register(r'marcas', MarcaViewSet, basename='marca')
router.register(r'modelos', ModeloViewSet, basename='modelo')
router.register(r'estados', EstadoVehiculoViewSet, basename='estado')
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'calificaciones', CalificacionViewSet, basename='calificacion')
router.register(r'localidades', LocalidadViewSet, basename='localidad')
router.register(r'preguntas', PreguntaViewSet, basename='pregunta')

urlpatterns = [
    path('', include(router.urls)),
    path('get-categories/', getDatosCategorias, name='get-categories'),
    path('get-users/', getDatosUsuarios, name='get-users'),
    path('register/', registerUser, name='register-user'),
] 