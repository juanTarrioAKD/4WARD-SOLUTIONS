#!/usr/bin/env python
"""
Script para crear 5 reservas de prueba en la base de datos.
Ejecutar con: python create_test_reservations.py
"""

import os
import sys
import django
from datetime import datetime, timedelta
from decimal import Decimal

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import *
from django.contrib.auth.hashers import make_password

def create_test_reservations():
    print("🚗 Creando 5 reservas de prueba...")
    
    # Verificar si ya existen reservas
    if Alquiler.objects.exists():
        print("⚠️  Ya existen reservas en la base de datos.")
        return
    
    # Obtener el cliente existente
    try:
        cliente = Usuario.objects.get(email='juantarrio@gmail.com')
        print(f"✅ Usando cliente existente: {cliente.first_name} {cliente.last_name}")
    except Usuario.DoesNotExist:
        print("❌ Error: No existe el usuario juantarrio@gmail.com")
        print("Por favor, crea el usuario primero o modifica el email en el script.")
        return
    
    # Obtener o crear datos necesarios
    localidad = Localidad.objects.get_or_create(nombre='La Plata')[0]
    sucursal = Sucursal.objects.get_or_create(
        nombre='Sucursal Central',
        defaults={'telefono': '1234567890', 'localidad': localidad, 'direccion': 'Av. Principal 123'}
    )[0]
    
    # Crear vehículos de prueba
    categoria = Categoria.objects.get_or_create(nombre='Mediano', defaults={'precio': Decimal('12000.00')})[0]
    marca = Marca.objects.get_or_create(nombre='Toyota')[0]
    modelo = Modelo.objects.get_or_create(nombre='Corolla')[0]
    politica = PoliticaDeCancelacion.objects.get_or_create(
        nombre='Política 20%', 
        defaults={'descripcion': 'Devolución del 20%', 'porcentaje': Decimal('20.00')}
    )[0]
    estado_vehiculo = EstadoVehiculo.objects.get_or_create(nombre='Disponible')[0]
    
    vehiculos = []
    for i in range(1, 6):
        vehiculo, created = Vehiculo.objects.get_or_create(
            patente=f'ABC12{i}',
            defaults={
                'marca': marca,
                'modelo': modelo,
                'categoria': categoria,
                'politica': politica,
                'estado': estado_vehiculo,
                'sucursal': sucursal,
                'capacidad': 5,
                'año_fabricacion': 2020
            }
        )
        if created:
            print(f"✅ Vehículo creado: {vehiculo.patente}")
        vehiculos.append(vehiculo)
    
    # Crear estados de alquiler
    estados = {
        'confirmado': EstadoAlquiler.objects.get_or_create(nombre='Confirmado')[0],
        'cancelado': EstadoAlquiler.objects.get_or_create(nombre='Cancelado')[0],
        'finalizado': EstadoAlquiler.objects.get_or_create(nombre='Finalizado')[0]
    }
    
    # Crear 5 reservas usando el mismo cliente
    reservas_data = [
        {
            'vehiculo': vehiculos[0],
            'fecha_inicio': datetime.now() + timedelta(days=1),
            'fecha_fin': datetime.now() + timedelta(days=3),
            'estado': estados['confirmado'],
            'descripcion': 'Reserva confirmada para mañana'
        },
        {
            'vehiculo': vehiculos[1],
            'fecha_inicio': datetime.now() + timedelta(days=5),
            'fecha_fin': datetime.now() + timedelta(days=7),
            'estado': estados['confirmado'],
            'descripcion': 'Reserva confirmada para la próxima semana'
        },
        {
            'vehiculo': vehiculos[2],
            'fecha_inicio': datetime.now() - timedelta(days=2),
            'fecha_fin': datetime.now() - timedelta(days=1),
            'estado': estados['finalizado'],
            'descripcion': 'Reserva finalizada (ya se devolvió)'
        },
        {
            'vehiculo': vehiculos[3],
            'fecha_inicio': datetime.now() + timedelta(days=10),
            'fecha_fin': datetime.now() + timedelta(days=12),
            'estado': estados['cancelado'],
            'descripcion': 'Reserva cancelada por el cliente'
        },
        {
            'vehiculo': vehiculos[4],
            'fecha_inicio': datetime.now() + timedelta(days=15),
            'fecha_fin': datetime.now() + timedelta(days=18),
            'estado': estados['confirmado'],
            'descripcion': 'Reserva confirmada para dentro de 2 semanas'
        }
    ]
    
    for i, res_data in enumerate(reservas_data, 1):
        dias = (res_data['fecha_fin'] - res_data['fecha_inicio']).days
        monto_total = categoria.precio * dias
        
        reserva = Alquiler.objects.create(
            cliente=cliente,
            vehiculo=res_data['vehiculo'],
            fecha_inicio=res_data['fecha_inicio'],
            fecha_fin=res_data['fecha_fin'],
            monto_total=monto_total,
            estado=res_data['estado'],
            sucursal_devolucion=sucursal
        )
        
        print(f"✅ Reserva {i} creada: {cliente.first_name} - {res_data['vehiculo'].patente} - {res_data['estado'].nombre} - ${monto_total} - {res_data['descripcion']}")
    
    print(f"🎉 ¡5 reservas creadas! Total: {Alquiler.objects.count()}")
    
    # Mostrar resumen
    print("\n📋 Resumen de estados:")
    for estado in EstadoAlquiler.objects.all():
        count = Alquiler.objects.filter(estado=estado).count()
        print(f"   - {estado.nombre}: {count} reservas")

if __name__ == '__main__':
    create_test_reservations() 