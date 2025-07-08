#!/usr/bin/env python
"""
Script para crear 10 reservas de prueba en la base de datos.
Ejecutar con: python create_test_reservations.py
"""

import os
import sys
import django
from datetime import datetime, timedelta
from decimal import Decimal
import random

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import *
from django.contrib.auth.hashers import make_password

def create_test_reservations():
    print("🚗 Creando 10 reservas de prueba...")
    
    # Obtener o crear clientes
    clientes = []
    
    # Intentar usar clientes existentes
    clientes_existentes = list(Usuario.objects.filter(rol__nombre='Cliente')[:5])
    if clientes_existentes:
        clientes.extend(clientes_existentes)
        print(f"✅ Usando {len(clientes_existentes)} clientes existentes")
    
    # Si no hay suficientes clientes, crear algunos nuevos
    if len(clientes) < 5:
        cliente_rol = Rol.objects.get_or_create(nombre='Cliente')[0]
        for i in range(len(clientes), 5):
            email = f'cliente_nuevo_{i}@test.com'
            if not Usuario.objects.filter(email=email).exists():
                cliente = Usuario.objects.create(
                    email=email,
                    first_name=f'Cliente{i}',
                    last_name=f'Nuevo{i}',
                    telefono=f'123456789{i}',
                    fecha_nacimiento='1990-01-01',
                    rol=cliente_rol
                )
                cliente.set_password('Cliente123')
                cliente.save()
                clientes.append(cliente)
                print(f"✅ Cliente creado: {cliente.first_name} {cliente.last_name}")
    
    if not clientes:
        print("❌ Error: No hay clientes disponibles")
        return
    
    # Obtener o crear datos necesarios
    localidad = Localidad.objects.get_or_create(nombre='La Plata')[0]
    sucursal = Sucursal.objects.get_or_create(
        nombre='Sucursal Central',
        defaults={'telefono': '1234567890', 'localidad': localidad, 'direccion': 'Av. Principal 123'}
    )[0]
    
    # Obtener categorías existentes
    categorias = list(Categoria.objects.all())
    if not categorias:
        print("❌ Error: No hay categorías disponibles")
        return
    
    # Obtener marcas y modelos existentes
    marcas = list(Marca.objects.all())
    modelos = list(Modelo.objects.all())
    
    if not marcas or not modelos:
        print("❌ Error: No hay marcas o modelos disponibles")
        return
    
    # Obtener vehículos existentes o crear nuevos
    vehiculos = list(Vehiculo.objects.all())
    
    if len(vehiculos) < 10:
        # Crear vehículos adicionales si no hay suficientes
        politica = PoliticaDeCancelacion.objects.get_or_create(
            nombre='Política 20%', 
            defaults={'descripcion': 'Devolución del 20%', 'porcentaje': Decimal('20.00')}
        )[0]
        estado_vehiculo = EstadoVehiculo.objects.get_or_create(nombre='Disponible')[0]
        
        for i in range(len(vehiculos), 10):
            categoria = random.choice(categorias)
            marca = random.choice(marcas)
            modelo = random.choice(modelos)  # Los modelos no están relacionados directamente con marcas
            
            vehiculo = Vehiculo.objects.create(
                patente=f'NUE{i:03d}',
                marca=marca,
                modelo=modelo,
                categoria=categoria,
                politica=politica,
                estado=estado_vehiculo,
                sucursal=sucursal,
                capacidad=random.randint(4, 8),
                año_fabricacion=random.randint(2018, 2023)
            )
            vehiculos.append(vehiculo)
            print(f"✅ Vehículo creado: {vehiculo.patente} ({vehiculo.marca.nombre} {vehiculo.modelo.nombre})")
    
    # Crear estados de alquiler
    estados = {
        'confirmado': EstadoAlquiler.objects.get_or_create(nombre='Confirmado')[0],
        'cancelado': EstadoAlquiler.objects.get_or_create(nombre='Cancelado')[0],
        'finalizado': EstadoAlquiler.objects.get_or_create(nombre='Finalizado')[0]
    }
    
    # Crear 10 reservas nuevas
    reservas_creadas = 0
    for i in range(10):
        # Seleccionar cliente y vehículo aleatorios
        cliente = random.choice(clientes)
        vehiculo = random.choice(vehiculos)
        
        # Generar fechas aleatorias
        dias_desde_hoy = random.randint(-30, 60)  # Entre 30 días atrás y 60 días adelante
        duracion = random.randint(1, 7)  # Entre 1 y 7 días
        
        fecha_inicio = datetime.now() + timedelta(days=dias_desde_hoy)
        fecha_fin = fecha_inicio + timedelta(days=duracion)
        
        # Seleccionar estado aleatorio
        estado = random.choice(list(estados.values()))
        
        # Calcular monto total
        dias = (fecha_fin - fecha_inicio).days
        monto_total = vehiculo.categoria.precio * dias
        
        # Crear la reserva
        reserva = Alquiler.objects.create(
            cliente=cliente,
            vehiculo=vehiculo,
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin,
            monto_total=monto_total,
            estado=estado,
            sucursal_devolucion=sucursal
        )
        
        reservas_creadas += 1
        print(f"✅ Reserva {reservas_creadas} creada: {cliente.first_name} - {vehiculo.patente} - {estado.nombre} - ${monto_total} - {dias} días")
    
    print(f"🎉 ¡{reservas_creadas} reservas creadas! Total en BD: {Alquiler.objects.count()}")
    
    # Mostrar resumen
    print("\n📋 Resumen de estados:")
    for estado in EstadoAlquiler.objects.all():
        count = Alquiler.objects.filter(estado=estado).count()
        print(f"   - {estado.nombre}: {count} reservas")

if __name__ == '__main__':
    create_test_reservations() 