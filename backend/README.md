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
- Modificar Usuario: `PUT /api/usuarios/{id}/modificar/`
- Baja de Usuario: `DELETE /api/usuarios/{id}/baja/`

### Vehículos

- Listar vehículos: `GET /api/vehiculos/`
- Crear vehículo: `POST /api/vehiculos/create/`
- Obtener vehículo: `GET /api/vehiculos/{id}/`
- Modificar vehículo: `PUT /api/vehiculos/{id}/modificar/`
- Baja de vehículo: `DELETE /api/vehiculos/{id}/baja/`

### Publicaciones

- Listar publicaciones: `GET /api/publicaciones/`
- Crear publicación: `POST /api/publicaciones/`
- Obtener publicación: `GET /api/publicaciones/{id}/`
- Modificar publicación: `PUT /api/publicaciones/{id}/`
- Eliminar publicación: `DELETE /api/publicaciones/{id}/`

### Categorías

- Listar categorías: `GET /api/categorias/`
- Crear categoría: `POST /api/categorias/`
- Obtener categoría: `GET /api/categorias/{id}/`
- Modificar categoría: `PUT /api/categorias/{id}/modificar/`

### Sucursales

- Listar sucursales: `GET /api/sucursales/`
- Crear sucursal: `POST /api/sucursales/`
- Obtener sucursal: `GET /api/sucursales/{id}/`
- Modificar sucursal: `PUT /api/sucursales/{id}/modificar/`
- Baja de sucursal: `DELETE /api/sucursales/{id}/baja/`

### Calificaciones

- Listar calificaciones: `GET /api/calificaciones/`
- Crear calificación: `POST /api/calificaciones/`
- Obtener calificación: `GET /api/calificaciones/{id}/`
- Baja de calificación: `DELETE /api/calificaciones/{id}/baja/

### Marcas

- Listar marcas: `GET /api/marcas/`
- Crear marca: `POST /api/marcas/`
- Obtener marca: `GET /api/marcas/{id}/`
- Baja de marca: `DELETE /api/marcas/{id}/baja/

### Modelos

- Listar modelos: `GET /api/modelos/`
- Crear modelo: `POST /api/modelos/`
- Obtener modelo: `GET /api/modelos/{id}/`
- Baja de modelo: `DELETE /api/modelos/{id}/baja/

### Localidades

- Listar localidades: `GET /api/localidades/`
- Crear localidad: `POST /api/localidades/`
- Obtener localidad: `GET /api/localidades/{id}/`
- Baja de localidad: `DELETE /api/localidades/{id}/baja/

### Preguntas

- Listar preguntas: `GET /api/preguntas/`
- Crear pregunta: `POST /api/preguntas/`
- Obtener pregunta: `GET /api/preguntas/{id}/`
- Baja de pregunta: `DELETE /api/preguntas/{id}/baja/

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

### Modificar Usuario
```json
PUT /api/usuarios/{id}/modificar/
{
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "1234567890",
    "fecha_nacimiento": "1990-01-01"
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
```json
{
    "error": "Datos inválidos"
}
```

### Baja de Usuario
```json
DELETE /api/usuarios/{id}/baja/
```
**Respuesta de éxito (204):** Sin contenido
**Error (404):**
```json
{
    "error": "Usuario no encontrado"
}
```

### Modificar Vehículo
```json
PUT /api/vehiculos/{id}/modificar/
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
- Si los datos son inválidos:
```json
{
    "error": "Datos inválidos"
}
```

### Baja de Vehículo
```json
DELETE /api/vehiculos/{id}/baja/
```
**Respuesta de éxito (204):** Sin contenido
**Error (404):**
```json
{
    "error": "Vehículo no encontrado"
}
```

### Modificar Categoría
```json
PUT /api/categorias/{id}/modificar/
{
    "precio": 1000.00
}
```
**Respuesta de éxito (200):**
```json
{
    "id": 1,
    "precio": 1000.00
}
```
**Error (400):**
```json
{
    "error": "Datos inválidos"
}
```

### Crear Calificación
```json
POST /api/calificaciones/
Content-Type: application/json

{
    "puntaje": 5,
    "publicacion": 1,
    "usuario": 1
}
```
**Respuesta de éxito (201):**
```json
{
    "id": 1,
    "puntaje": 5,
    "publicacion": 1,
    "usuario": 1
}
```
**Error (400):**
- Si los datos no están en formato JSON:
```json
{
    "error": "Los datos deben estar en formato JSON"
}
```
- Si el usuario ya calificó la publicación:
```json
{
    "error": "El usuario ya ha calificado esta publicación"
}
```
- Si los datos son inválidos:
```json
{
    "error": "Datos inválidos"
}
```

### Baja de Calificación
```json
DELETE /api/calificaciones/{id}/baja/
```
**Respuesta de éxito (204):** Sin contenido
**Error (404):**
```json
{
    "error": "Calificación no encontrada"
}
```

### Crear Localidad
```json
POST /api/localidades/
Content-Type: application/json

{
    "nombre": "Ciudad Ejemplo"
}
```
**Respuesta de éxito (201):**
```json
{
    "id": 1,
    "nombre": "Ciudad Ejemplo"
}
```
**Error (400):**
- Si ya existe una localidad con ese nombre:
```json
{
    "error": "Ya existe una localidad con ese nombre"
}
```
- Si los datos son inválidos:
```json
{
    "error": "Datos inválidos"
}
```

### Baja de Localidad
```json
DELETE /api/localidades/{id}/baja/
```
**Respuesta de éxito (204):** Sin contenido
**Error (404):**
```json
{
    "error": "Localidad no encontrada"
}
```

### Crear Pregunta
```json
POST /api/preguntas/
Content-Type: application/json

{
    "publicacion": 1,
    "comentario": "¿El vehículo está disponible?",
    "usuario": 1
}
```
**Respuesta de éxito (201):**
```json
{
    "id": 1,
    "publicacion": 1,
    "comentario": "¿El vehículo está disponible?",
    "usuario": 1
}
```
**Error (400):**
```json
{
    "error": "Datos inválidos"
}
```

### Baja de Pregunta
```json
DELETE /api/preguntas/{id}/baja/
```
**Respuesta de éxito (204):** Sin contenido
**Error (404):**
```json
{
    "error": "Pregunta no encontrada"
}
```

### Baja de Marca
```json
DELETE /api/marcas/{id}/baja/
```
**Respuesta de éxito (204):** Sin contenido
**Error (404):**
```json
{
    "error": "Marca no encontrada"
}
```

### Baja de Modelo
```json
DELETE /api/modelos/{id}/baja/
```
**Respuesta de éxito (204):** Sin contenido
**Error (404):**
```json
{
    "error": "Modelo no encontrado"
}
```

### Baja de Categoría
```json
DELETE /api/categorias/{id}/baja/
```
**Respuesta de éxito (204):** Sin contenido
**Error (404):**
```json
{
    "error": "Categoría no encontrada"
}
```

### Crear Sucursal
```json
POST /api/sucursales/
Content-Type: application/json

{
    "nombre": "Sucursal Centro",
    "telefono": "1234567890",
    "localidad_id": 1,
    "direccion": "Calle Principal 123"
}
```
**Respuesta de éxito (201):**
```json
{
    "id": 1,
    "nombre": "Sucursal Centro",
    "telefono": "1234567890",
    "localidad": {
        "id": 1,
        "nombre": "Ciudad Ejemplo"
    },
    "direccion": "Calle Principal 123"
}
```
**Error (400):**
```json
{
    "error": "Datos inválidos"
}
```

### Modificar Sucursal
```json
PUT /api/sucursales/{id}/modificar/
Content-Type: application/json

{
    "nombre": "Sucursal Centro",
    "telefono": "1234567890",
    "localidad_id": 1,
    "direccion": "Calle Principal 123"
}
```
**Respuesta de éxito (200):**
```json
{
    "id": 1,
    "nombre": "Sucursal Centro",
    "telefono": "1234567890",
    "localidad": {
        "id": 1,
        "nombre": "Ciudad Ejemplo"
    },
    "direccion": "Calle Principal 123"
}
```
**Error (400):**
```json
{
    "error": "Datos inválidos"
}
```

### Baja de Sucursal
```json
DELETE /api/sucursales/{id}/baja/
```
**Respuesta de éxito (204):** Sin contenido
**Error (404):**
```json
{
    "error": "Sucursal no encontrada"
}
``` 