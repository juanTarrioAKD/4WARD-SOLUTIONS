#!/usr/bin/env python
import os
import sys
import django
from datetime import date

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Usuario, Rol
from django.contrib.auth.hashers import make_password

def create_employee():
    # Verificar que existe el rol empleado (ID = 2)
    try:
        empleado_rol = Rol.objects.get(id=2)
    except Rol.DoesNotExist:
        print("Error: No existe el rol empleado (ID = 2)")
        return
    
    # Datos del empleado
    employee_data = {
        'email': 'empleado@alquilapp.com',
        'first_name': 'Juan',
        'last_name': 'Pérez',
        'telefono': '9112345678',
        'fecha_nacimiento': date(1990, 1, 1),
        'rol': empleado_rol,
        'puesto': 'Empleado de Sucursal',
        'localidad': None  # Puedes asignar una localidad si existe
    }
    
    # Verificar si el email ya existe
    if Usuario.objects.filter(email=employee_data['email']).exists():
        print(f"Error: Ya existe un usuario con el email {employee_data['email']}")
        return
    
    # Crear el usuario empleado
    try:
        empleado = Usuario.objects.create(
            username=employee_data['email'],  # Usar email como username
            email=employee_data['email'],
            first_name=employee_data['first_name'],
            last_name=employee_data['last_name'],
            telefono=employee_data['telefono'],
            fecha_nacimiento=employee_data['fecha_nacimiento'],
            rol=employee_data['rol'],
            puesto=employee_data['puesto'],
            localidad=employee_data['localidad'],
            password=make_password('Empleado123!')  # Contraseña por defecto
        )
        
        print(f"✅ Empleado creado exitosamente:")
        print(f"   Email: {empleado.email}")
        print(f"   Nombre: {empleado.first_name} {empleado.last_name}")
        print(f"   Rol: {empleado.rol}")
        print(f"   Contraseña: Empleado123!")
        
    except Exception as e:
        print(f"Error al crear el empleado: {e}")

if __name__ == '__main__':
    create_employee() 