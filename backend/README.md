# Backend API para Sistema de Alquiler de Vehículos

Este es el backend del sistema de alquiler de vehículos desarrollado con Django y Django REST Framework.

## Requisitos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)

## Instalación

1. Crear un entorno virtual:
```bash
python -m venv venv
```

2. Activar el entorno virtual:
- Windows:
```bash
.\venv\Scripts\activate
```
- Linux/Mac:
```bash
source venv/bin/activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Realizar migraciones:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Crear superusuario (opcional):
```bash
python manage.py createsuperuser
```

6. Iniciar el servidor:
```bash
python manage.py runserver
```

## Endpoints de la API

### Autenticación

- Registro de Usuario: `POST /api/usuarios/register/` 
- Login de Usuario: `POST /api/usuarios/login/`
- Logout: `POST /api/usuarios/logout/`

### Vehículos

- Listar vehículos: `GET /api/vehiculos/`
- Crear vehículo: `POST /api/vehiculos/create/`
- Obtener vehículo: `GET /api/vehiculos/{id}/`
- Actualizar vehículo: `PUT /api/vehiculos/{id}/`
- Eliminar vehículo: `DELETE /api/vehiculos/{id}/`

### Publicaciones

- Listar publicaciones: `GET /api/publicaciones/`
- Crear publicación: `POST /api/publicaciones/`
- Obtener publicación: `GET /api/publicaciones/{id}/`
- Actualizar publicación: `PUT /api/publicaciones/{id}/`
- Eliminar publicación: `DELETE /api/publicaciones/{id}/`

## Ejemplos de Uso

### Registro de Usuario
```json
POST /api/usuarios/register/
{
    "email": "cliente@ejemplo.com",
    "password": "contraseña123",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "1234567890",
    "fecha_nacimiento": "1990-01-01",
    "tipo": "cliente"
}
```
**Respuesta de éxito (200):**
```json
{
    "id": 1,
    "email": "cliente@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "1234567890",
    "fecha_nacimiento": "1990-01-01",
    "tipo": "cliente"
}
```
**Error (400):**
- Si el email ya existe:
```json
{
    "error": "El email ya está registrado"
}
```
- Si falta algún campo obligatorio:
```json
{
    "error": "Faltan campos obligatorios"
}
```

### Login
```json
POST /api/usuarios/login/
{
    "email": "cliente@ejemplo.com",
    "password": "contraseña123"
}
```
**Respuesta de éxito (200):**
```json
{
    "refresh": "token_refresh",
    "access": "token_access",
    "user": {
        "id": 1,
        "email": "cliente@ejemplo.com",
        "nombre": "Juan",
        "apellido": "Pérez",
        "telefono": "1234567890",
        "fecha_nacimiento": "1990-01-01",
        "tipo": "cliente"
    }
}
```
**Error (401):**
```json
{
    "error": "Credenciales inválidas"
}
```

### Crear Vehículo
```json
POST /api/vehiculos/
{
    "patente": "ABC123",
    "capacidad": 5,
    "año_fabricacion": 2020,
    "sucursal": 1,
    "politica": 1,
    "marca": 1,
    "estado": 1,
    "categoria": 1
}
```
**Respuesta de éxito (200):**
```json
{
    "id": 1,
    "patente": "ABC123",
    "capacidad": 5,
    "año_fabricacion": 2020,
    "sucursal": 1,
    "politica": 1,
    "marca": 1,
    "estado": 1,
    "categoria": 1
}
```
**Error (400):**
- Si la patente ya existe:
```json
{
    "error": "La patente ya está registrada"
}
```
- Si falta algún campo obligatorio:
```json
{
    "error": "Faltan campos obligatorios"
}
```

### Crear Publicación
```json
POST /api/publicaciones/
{
    "categoria": 1
}
```
**Respuesta de éxito (200):**
```json
{
    "id": 1,
    "categoria": 1,
    "fecha_creacion": "2023-01-01T00:00:00Z"
}
```
**Error (400):**
- Si falta algún campo obligatorio:
```json
{
    "error": "Faltan campos obligatorios"
}
``` 