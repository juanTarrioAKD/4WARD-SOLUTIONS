# scripts/crear_usuarios.py

from django.contrib.auth.hashers import make_password
from api.models import Usuario, Rol
from datetime import date

# Primero creamos los roles si no existen
Rol.objects.get_or_create(nombre='cliente')
Rol.objects.get_or_create(nombre='empleado')
Rol.objects.get_or_create(nombre='admin')

# Crear primer admin
admin1, created = Usuario.objects.get_or_create(
    email='admin1@gmail.com',
    defaults={
        'username': 'admin1@gmail.com',  # Usamos el email como username
        'password': make_password('Contraseña1'),
        'nombre': 'AdminUno',
        'apellido': 'ApellidoUno',
        'telefono': '1111111111',
        'fecha_nacimiento': date(1985, 5, 1),
        'rol': Rol.objects.get(nombre='admin'),
        'is_staff': True,
        'is_superuser': True
    }
)

# Crear segundo admin
admin2, created = Usuario.objects.get_or_create(
    email='admin2@gmail.com',
    defaults={
        'username': 'admin2@gmail.com',  # Usamos el email como username
        'password': make_password('Contraseña2'),
        'nombre': 'AdminDos',
        'apellido': 'ApellidoDos',
        'telefono': '2222222222',
        'fecha_nacimiento': date(1980, 8, 8),
        'rol': Rol.objects.get(nombre='admin'),
        'is_staff': True,
        'is_superuser': True
    }
)

print("Roles y usuarios creados correctamente.")