#!/usr/bin/env python
import os
import sys
import django
from datetime import date

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Usuario, Rol, Localidad
from django.contrib.auth.hashers import make_password

def create_users():
    print("=== Creando usuarios de prueba ===")
    
    # Crear roles si no existen
    cliente_rol, _ = Rol.objects.get_or_create(
        id=1,
        defaults={'nombre': 'Cliente'}
    )
    empleado_rol, _ = Rol.objects.get_or_create(
        id=2,
        defaults={'nombre': 'Empleado'}
    )
    admin_rol, _ = Rol.objects.get_or_create(
        id=3,
        defaults={'nombre': 'Administrador'}
    )
    
    print("✅ Roles creados/verificados")
    
    # Crear localidad por defecto si no existe
    localidad_default, _ = Localidad.objects.get_or_create(
        id=1,
        defaults={'nombre': 'Buenos Aires', 'provincia': 'Buenos Aires'}
    )
    
    # Crear admin1
    admin1, created = Usuario.objects.get_or_create(
        email='admin1@admin.com',
        defaults={
            'username': 'admin1@admin.com',
            'first_name': 'Mario',
            'last_name': 'admin1',
            'telefono': '1234567890',
            'fecha_nacimiento': date(1990, 1, 1),
            'rol': admin_rol,
            'localidad': localidad_default,
            'password': make_password('Admin1234'),
            'is_active': True,
            'is_staff': True,
            'is_superuser': True
        }
    )
    
    if created:
        print("✅ Usuario admin1 creado")
    else:
        print("ℹ️ Usuario admin1 ya existe")
    
    # Crear admin2
    admin2, created = Usuario.objects.get_or_create(
        email='admin2@admin.com',
        defaults={
            'username': 'admin2@admin.com',
            'first_name': 'Maria',
            'last_name': 'admin2',
            'telefono': '1234567890',
            'fecha_nacimiento': date(1990, 1, 1),
            'rol': admin_rol,
            'localidad': localidad_default,
            'password': make_password('Admin1234'),
            'is_active': True,
            'is_staff': True,
            'is_superuser': True
        }
    )
    
    if created:
        print("✅ Usuario admin2 creado")
    else:
        print("ℹ️ Usuario admin2 ya existe")
    
    # Crear usuario cliente de prueba
    cliente, created = Usuario.objects.get_or_create(
        email='cliente@test.com',
        defaults={
            'username': 'cliente@test.com',
            'first_name': 'Juan',
            'last_name': 'Pérez',
            'telefono': '1234567890',
            'fecha_nacimiento': date(1990, 1, 1),
            'rol': cliente_rol,
            'localidad': localidad_default,
            'password': make_password('Cliente1234'),
            'is_active': True
        }
    )
    
    if created:
        print("✅ Usuario cliente creado")
    else:
        print("ℹ️ Usuario cliente ya existe")
    
    print("\n=== Usuarios disponibles ===")
    print("Admin 1: admin1@admin.com / Admin1234")
    print("Admin 2: admin2@admin.com / Admin1234")
    print("Cliente: cliente@test.com / Cliente1234")

if __name__ == '__main__':
    create_users() 