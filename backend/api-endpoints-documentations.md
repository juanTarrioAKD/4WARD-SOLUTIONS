# Documentación de Endpoints de la API

## Autenticación

### Registro de Usuario
- Endpoint: `POST /api/usuarios/register/`
- Request:
```json
{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "1234567890",
    "fecha_nacimiento": "1990-01-01",
    "rol": "cliente"
}
```
- Respuesta Exitosa (200):
```json
{
    "id": 1,
    "email": "usuario@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "1234567890",
    "fecha_nacimiento": "1990-01-01",
    "rol": "cliente"
}
```
- Respuesta Error (400):
```json
{
    "error": "El email ya está registrado"
}
```

### Login de Usuario
- Endpoint: `POST /api/usuarios/login/`
- Request:
```json
{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
}
```
- Respuesta Exitosa (200):
```json
{
    "refresh": "token_refresh",
    "access": "token_access",
    "user": {
        "id": 1,
        "email": "usuario@ejemplo.com",
        "nombre": "Juan",
        "apellido": "Pérez",
        "telefono": "1234567890",
        "fecha_nacimiento": "1990-01-01",
        "rol": "cliente"
    }
}
```
- Respuesta Error (401):
```json
{
    "error": "Credenciales inválidas"
}
```

### Logout
- Endpoint: `POST /api/usuarios/logout/`
- Request:
```json
{
    "refresh": "token_refresh"
}
```
- Respuesta Exitosa (205): Sin contenido
- Respuesta Error (400): Sin contenido

### Listar Usuarios
- Endpoint: `GET /api/usuarios/`
- Respuesta Exitosa (200):
```json
[
    {
        "id": 1,
        "email": "usuario1@ejemplo.com",
        "nombre": "Juan",
        "apellido": "Pérez",
        "telefono": "1234567890",
        "fecha_nacimiento": "1990-01-01",
        "rol": "cliente"
    },
    {
        "id": 2,
        "email": "usuario2@ejemplo.com",
        "nombre": "María",
        "apellido": "González",
        "telefono": "0987654321",
        "fecha_nacimiento": "1992-05-15",
        "rol": "cliente"
    }
]
```

## Vehículos

### Listar vehículos
- Endpoint: `GET /api/vehiculos/`
- Respuesta Exitosa (200):
```json
[
    {
        "id": 1,
        "patente": "ABC123",
        "marca": {
            "id": 1,
            "nombre": "Toyota"
        },
        "modelo": "Corolla",
        "año": 2020,
        "categoria": {
            "id": 1,
            "nombre": "Sedán"
        },
        "estado": {
            "id": 1,
            "nombre": "Disponible"
        },
        "sucursal": {
            "id": 1,
            "nombre": "Sucursal Central"
        },
        "politica": {
            "id": 1,
            "nombre": "Política Estándar"
        }
    }
]
```

### Crear vehículo
- Endpoint: `POST /api/vehiculos/`
- Request:
```json
{
    "patente": "ABC123",
    "marca": 1,
    "modelo": "Corolla",
    "año": 2020,
    "categoria": 1,
    "estado": 1,
    "sucursal": 1,
    "politica": 1
}
```
- Respuesta Exitosa (200):
```json
{
    "id": 1,
    "patente": "ABC123",
    "marca": {
        "id": 1,
        "nombre": "Toyota"
    },
    "modelo": "Corolla",
    "año": 2020,
    "categoria": {
        "id": 1,
        "nombre": "Sedán"
    },
    "estado": {
        "id": 1,
        "nombre": "Disponible"
    },
    "sucursal": {
        "id": 1,
        "nombre": "Sucursal Central"
    },
    "politica": {
        "id": 1,
        "nombre": "Política Estándar"
    }
}
```
- Respuesta Error (400):
```json
{
    "error": "La patente ya está registrada"
}
```

## Sucursales

### Listar sucursales
- Endpoint: `GET /api/sucursales/`
- Respuesta Exitosa (200):
```json
[
    {
        "id": 1,
        "nombre": "Sucursal Central",
        "direccion": "Av. Principal 123",
        "telefono": "1234567890"
    }
]
```

### Crear sucursal
- Endpoint: `POST /api/sucursales/`
- Request:
```json
{
    "nombre": "Sucursal Central",
    "direccion": "Av. Principal 123",
    "telefono": "1234567890",
    "localidad": "La Plata"
}
```
- Respuesta Exitosa (200):
```json
{
    "id": 1,
    "nombre": "Sucursal Central",
    "direccion": "Av. Principal 123",
    "telefono": "1234567890"
}
```
- Respuesta Error (400):
```json
{
    "nombre": ["Este campo es requerido"]
}
```

## Políticas de Cancelación

### Listar políticas
- Endpoint: `GET /api/politicas/`
- Respuesta Exitosa (200):
```json
[
    {
        "id": 1,
        "nombre": "Política Estándar",
        "descripcion": "Cancelación con 24 horas de anticipación",
        "porcentaje_devolucion": 80
    }
]
```

### Crear política
- Endpoint: `POST /api/politicas/`
- Request:
```json
{
    "nombre": "Política Estándar",
    "descripcion": "Cancelación con 24 horas de anticipación",
    "porcentaje_devolucion": 80
}
```
- Respuesta Exitosa (200):
```json
{
    "id": 1,
    "nombre": "Política Estándar",
    "descripcion": "Cancelación con 24 horas de anticipación",
    "porcentaje_devolucion": 80
}
```
- Respuesta Error (400):
```json
{
    "nombre": ["Este campo es requerido"],
    "porcentaje_devolucion": ["Este campo es requerido"]
}
```

## Marcas

### Listar marcas
- Endpoint: `GET /api/marcas/`
- Respuesta Exitosa (200):
```json
[
    {
        "id": 1,
        "nombre": "Toyota"
    }
]
```

### Crear marca
- Endpoint: `POST /api/marcas/`
- Request:
```json
{
    "nombre": "Toyota"
}
```
- Respuesta Exitosa (200):
```json
{
    "id": 1,
    "nombre": "Toyota"
}
```
- Respuesta Error (400):
```json
{
    "nombre": ["Este campo es requerido"]
}
```

## Estados de Vehículo

### Listar estados
- Endpoint: `GET /api/estados/`
- Respuesta Exitosa (200):
```json
[
    {
        "id": 1,
        "nombre": "Disponible"
    }
]
```

### Crear estado
- Endpoint: `POST /api/estados/`
- Request:
```json
{
    "nombre": "Disponible"
}
```
- Respuesta Exitosa (200):
```json
{
    "id": 1,
    "nombre": "Disponible"
}
```
- Respuesta Error (400):
```json
{
    "nombre": ["Este campo es requerido"]
}
```

## Categorías

### Listar categorías
- Endpoint: `GET /api/categorias/`
- Respuesta Exitosa (200):
```json
[
    {
        "id": 1,
        "nombre": "Sedán",
        "descripcion": "Vehículos de 4 puertas"
    }
]
```

### Crear categoría
- Endpoint: `POST /api/categorias/`
- Request:
```json
{
    "nombre": "Sedán",
    "descripcion": "Vehículos de 4 puertas"
}
```
- Respuesta Exitosa (200):
```json
{
    "id": 1,
    "nombre": "Sedán",
    "descripcion": "Vehículos de 4 puertas"
}
```
- Respuesta Error (400):
```json
{
    "nombre": ["Este campo es requerido"]
}
```

## Ejemplos de Uso

### Crear Sucursal
```json
POST /api/sucursales/
{
    "nombre": "Sucursal Central",
    "direccion": "Av. Principal 123",
    "telefono": "1234567890"
}
```

### Crear Política de Cancelación
```json
POST /api/politicas/
{
    "nombre": "Política Estándar",
    "descripcion": "Cancelación con 24 horas de anticipación",
    "porcentaje_devolucion": 80
}
```

### Crear Marca
```json
POST /api/marcas/
{
    "nombre": "Toyota"
}
```

### Crear Estado de Vehículo
```json
POST /api/estados/
{
    "nombre": "Disponible"
}
```

### Crear Categoría
```json
POST /api/categorias/
{
    "nombre": "Sedán",
    "descripcion": "Vehículos de 4 puertas"
}
```

### Crear Vehículo
```json
POST /api/vehiculos/
{
    "patente": "ABC123",
    "marca": 1,
    "modelo": "Corolla",
    "año": 2020,
    "categoria": 1,
    "estado": 1,
    "sucursal": 1,
    "politica": 1
}
``` 