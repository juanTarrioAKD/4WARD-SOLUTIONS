from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
import mercadopago
from django.conf import settings
from .models import Alquiler
from django.urls import reverse
from django.conf import settings
import json

# Configuración de MercadoPago
sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_payment_preference(request):
    """
    Crea una preferencia de pago en Mercado Pago
    """
    try:
        print("Recibiendo solicitud de preferencia de pago")
        alquiler_id = request.data.get('alquiler_id')
        if not alquiler_id:
            return Response({"error": "ID de alquiler no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        print(f"Buscando alquiler con ID: {alquiler_id}")
        try:
            alquiler = Alquiler.objects.get(id=alquiler_id)
        except Alquiler.DoesNotExist:
            return Response({"error": "Alquiler no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        print(f"Alquiler encontrado: {alquiler}")
        
        # URLs de retorno
        success_url = f"{settings.FRONTEND_URL}/pagos/success?alquiler_id={alquiler_id}"
        failure_url = f"{settings.FRONTEND_URL}/pagos/failure?alquiler_id={alquiler_id}"
        pending_url = f"{settings.FRONTEND_URL}/pagos/pending?alquiler_id={alquiler_id}"
        
        # Crear preferencia en Mercado Pago
        preference_data = {
            "items": [
                {
                    "id": str(alquiler.id),
                    "title": f"Alquiler de vehículo - {alquiler.vehiculo.modelo.nombre}",
                    "currency_id": "ARS",
                    "picture_url": "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
                    "description": f"Alquiler desde {alquiler.fecha_inicio} hasta {alquiler.fecha_fin}",
                    "category_id": "car_rentals",
                    "quantity": 1,
                    "unit_price": float(alquiler.monto_total)
                }
            ],
            "payer": {
                "name": "Test",
                "surname": "User",
                "email": "test_user_511659300@testuser.com",  # Email del comprador de prueba
                "phone": {
                    "area_code": "11",
                    "number": "22223333"
                },
                "identification": {
                    "type": "DNI",
                    "number": "12345678"
                },
                "address": {
                    "street_name": "Calle Falsa",
                    "street_number": 123,
                    "zip_code": "1111"
                }
            },
            "back_urls": {
                "success": success_url,
                "failure": failure_url,
                "pending": pending_url
            },
            "notification_url": f"{settings.BACKEND_URL}/api/pagos/webhook/",
            "payment_methods": {
                "excluded_payment_types": [{"id": "ticket"}],
                "installments": 1
            },
            "statement_descriptor": "4WARD CAR RENTAL",
            "external_reference": str(alquiler.id)
        }

        print("Creando preferencia en Mercado Pago con datos:", json.dumps(preference_data, indent=2))
        
        try:
            # Crear preferencia usando el SDK de Mercado Pago
            preference_response = sdk.preference().create(preference_data)
            print("Respuesta completa de Mercado Pago:", json.dumps(preference_response, indent=2))

            if not preference_response:
                raise Exception("No se recibió respuesta de Mercado Pago")

            if "response" not in preference_response:
                print("Error: Respuesta de Mercado Pago no tiene el campo 'response'")
                print("Contenido de la respuesta:", preference_response)
                raise Exception("Respuesta inválida de Mercado Pago")

            mp_response = preference_response["response"]
            print("Datos de la preferencia:", json.dumps(mp_response, indent=2))

            # En modo sandbox, usamos sandbox_init_point
            init_point = mp_response.get("sandbox_init_point") or mp_response.get("init_point")
            
            if not init_point:
                print("Error: No se encontró punto de inicio")
                print("Campos disponibles en la respuesta:", list(mp_response.keys()))
                raise Exception("No se pudo obtener el punto de inicio de pago")

            # Solo devolvemos el init_point y el alquiler_id
            response_data = {
                "init_point": init_point,
                "alquiler_id": alquiler_id
            }
            print("Enviando respuesta final:", response_data)
            return Response(response_data)

        except Exception as mp_error:
            print(f"Error al crear preferencia en Mercado Pago: {str(mp_error)}")
            if hasattr(mp_error, 'response'):
                print("Detalles del error de MP:", mp_error.response)
            raise

    except Exception as e:
        print(f"Error al crear preferencia de pago: {str(e)}")
        return Response({
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def payment_webhook(request):
    """
    Webhook para recibir notificaciones de pagos de Mercado Pago
    """
    try:
        print("Webhook de Mercado Pago recibido:", request.data)
        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error en webhook: {str(e)}")
        return Response({
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 