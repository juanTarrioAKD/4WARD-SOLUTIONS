from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, VehiculoViewSet, PublicacionViewSet,
    MarcaViewSet, ModeloViewSet, EstadoVehiculoViewSet,
    SucursalViewSet, CategoriaViewSet, PoliticaDeCancelacionViewSet,
    CalificacionViewSet, LocalidadViewSet,
    PreguntaViewSet, AlquilerViewSet, EstadoAlquilerViewSet,
    EstadisticasViewSet, getDatosCategorias, getMockLogin, getMockRegister,
    getMockReservations, getMockPolicies, searchAvailableCategories,
    createMockAlquiler
)
from .payment_views import create_payment_preference, payment_webhook

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'vehiculos', VehiculoViewSet)
router.register(r'publicaciones', PublicacionViewSet)
router.register(r'marcas', MarcaViewSet)
router.register(r'modelos', ModeloViewSet)
router.register(r'estados-vehiculo', EstadoVehiculoViewSet)
router.register(r'sucursales', SucursalViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'politicas', PoliticaDeCancelacionViewSet)
router.register(r'calificaciones', CalificacionViewSet)
router.register(r'localidades', LocalidadViewSet)
router.register(r'preguntas', PreguntaViewSet)
router.register(r'alquileres', AlquilerViewSet)
router.register(r'estados-alquiler', EstadoAlquilerViewSet)
router.register(r'estadisticas', EstadisticasViewSet, basename='estadisticas')

urlpatterns = [
    path('get-categories/', getDatosCategorias, name='get-categories'),
    path('mock-login/', getMockLogin, name='mock-login'),
    path('register/', getMockRegister, name='register'),
    path('mock-reservations/', getMockReservations, name='mock-reservations'),
    path('mock-policies/', getMockPolicies, name='mock-policies'),
    path('pagos/crear-preferencia/', create_payment_preference, name='create-payment-preference'),
    path('pagos/webhook/', payment_webhook, name='payment-webhook'),
    path('search-available-categories/', searchAvailableCategories, name='search-available-categories'),
    path('alquileres/crear/', createMockAlquiler, name='create-mock-alquiler'),
    path('', include(router.urls)),
] 