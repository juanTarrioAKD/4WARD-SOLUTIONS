from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
import mercadopago
from django.conf import settings
from .models import Alquiler
from django.urls import reverse
from django.conf import settings

# Configuración de MercadoPago
sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_payment_preference(request):
    """
    Crea una preferencia de pago mock para pruebas
    """
    try:
        alquiler_id = request.data.get('alquiler_id')
        
        # Para el mock, redirigimos directamente a la página de éxito
        # Ya que no tenemos integración real con Mercado Pago
        success_url = f"{settings.FRONTEND_URL}/pagos/success?alquiler_id={alquiler_id}"
        
        # Crear una preferencia mock
        preference_response = {
            "id": "mock_preference_id",
            "init_point": success_url,
            "alquiler_id": alquiler_id
        }

        return Response(preference_response)

    except Exception as e:
        return Response({
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def payment_webhook(request):
    """
    Webhook para recibir notificaciones de pagos de Mercado Pago
    """
    try:
        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 