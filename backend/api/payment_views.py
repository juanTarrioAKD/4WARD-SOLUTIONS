from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import mercadopago
from django.conf import settings
from .models import Alquiler
from django.urls import reverse
from django.conf import settings

# Configuración de MercadoPago
sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_preference(request):
    """
    Crea una preferencia de pago en Mercado Pago para un alquiler
    """
    try:
        alquiler_id = request.data.get('alquiler_id')
        alquiler = Alquiler.objects.get(id=alquiler_id, cliente=request.user)
        
        # Crear la preferencia de pago
        preference_data = {
            "items": [
                {
                    "title": f"Alquiler de vehículo #{alquiler.id}",
                    "quantity": 1,
                    "currency_id": "ARS",  # o el código de moneda correspondiente
                    "unit_price": float(alquiler.monto_total)
                }
            ],
            "payer": {
                "name": request.user.nombre,
                "email": request.user.email,
            },
            "back_urls": {
                "success": f"{settings.FRONTEND_URL}/pagos/success",
                "failure": f"{settings.FRONTEND_URL}/pagos/failure",
                "pending": f"{settings.FRONTEND_URL}/pagos/pending"
            },
            "auto_return": "approved",
            "external_reference": str(alquiler.id),
            "notification_url": f"{settings.BACKEND_URL}/api/pagos/webhook/"
        }

        # Crear la preferencia en Mercado Pago
        preference_response = sdk.preference().create(preference_data)

        if preference_response["status"] == 201:
            return Response({
                "id": preference_response["response"]["id"],
                "init_point": preference_response["response"]["init_point"]
            })
        else:
            return Response({
                "error": "Error al crear la preferencia de pago"
            }, status=status.HTTP_400_BAD_REQUEST)

    except Alquiler.DoesNotExist:
        return Response({
            "error": "Alquiler no encontrado o no pertenece al usuario"
        }, status=status.HTTP_404_NOT_FOUND)
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
        payment_data = request.data
        if payment_data["type"] == "payment":
            payment_id = payment_data["data"]["id"]
            # Obtener información del pago
            payment_info = sdk.payment().get(payment_id)
            
            if payment_info["status"] == 200:
                payment = payment_info["response"]
                external_reference = payment["external_reference"]
                status = payment["status"]

                # Actualizar el estado del alquiler según el pago
                try:
                    alquiler = Alquiler.objects.get(id=external_reference)
                    if status == "approved":
                        alquiler.estado_pago = "PAGADO"
                    elif status == "pending":
                        alquiler.estado_pago = "PENDIENTE"
                    elif status == "rejected":
                        alquiler.estado_pago = "RECHAZADO"
                    alquiler.save()
                except Alquiler.DoesNotExist:
                    return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 