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
    Crea una preferencia de pago en Mercado Pago
    """
    try:
        alquiler_id = request.data.get('alquiler_id')
        if not alquiler_id:
            return Response({"error": "ID de alquiler no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener el alquiler
        try:
            alquiler = Alquiler.objects.get(id=alquiler_id)
        except Alquiler.DoesNotExist:
            return Response({"error": "Alquiler no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        # Crear preferencia en Mercado Pago
        preference_data = {
            "items": [
                {
                    "title": f"Alquiler de vehículo - {alquiler.vehiculo.modelo.nombre}",
                    "quantity": 1,
                    "currency_id": "ARS",
                    "unit_price": float(alquiler.monto_total)
                }
            ],
            "back_urls": {
                "success": f"{settings.FRONTEND_URL}/pagos/success?alquiler_id={alquiler_id}",
                "failure": f"{settings.FRONTEND_URL}/pagos/failure?alquiler_id={alquiler_id}",
                "pending": f"{settings.FRONTEND_URL}/pagos/pending?alquiler_id={alquiler_id}"
            },
            "auto_return": "approved",
            "external_reference": str(alquiler_id)
        }

        # Crear preferencia usando el SDK de Mercado Pago
        preference = sdk.preference().create(preference_data)

        if not preference or "response" not in preference:
            raise Exception("Error al crear la preferencia de pago")

        return Response({
            "id": preference["response"]["id"],
            "init_point": preference["response"]["init_point"],
            "alquiler_id": alquiler_id
        })

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