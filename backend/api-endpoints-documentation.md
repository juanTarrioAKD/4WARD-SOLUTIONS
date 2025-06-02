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
- Nota: El campo `username` se genera automáticamente usando el email proporcionado.
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

### Crear Alquiler
- Endpoint: `GET /api/alquileres/`
- Request:
```json
{
    "fecha_inicio": "2024-03-20T10:00:00Z",
    "fecha_fin": "2024-03-25T10:00:00Z",
    "fecha_reserva": "2024-03-19T10:00:00Z",
    "modelo_id": 1,
    "cliente_id": 1
}
```
- Respuesta Exitosa (200):
```json
{
    "id": 3,
    "fecha_inicio": "2024-03-20T07:00:00-03:00",
    "fecha_fin": "2024-03-25T07:00:00-03:00",
    "fecha_reserva": "2024-03-19T07:00:00-03:00",
    "monto_total": "50000.00",
    "estado": "EstadoAlquiler object (1)",
    "cliente": {
        "id": 1,
        "email": "dante@ejemplo.com",
        "nombre": "Dante",
        "apellido": "Zorzoli",
        "telefono": "1234567890",
        "fecha_nacimiento": "1990-01-01",
        "rol": "cliente",
        "puesto": null,
        "localidad": null
    },
    "vehiculo": {
        "id": 2,
        "marca": {
            "id": 1,
            "nombre": "Toyota"
        },
        "estado": {
            "id": 1,
            "nombre": "Disponible"
        },
        "sucursal": {
            "id": 1,
            "nombre": "Sucursal Central",
            "telefono": "1234567890",
            "localidad": {
                "id": 1,
                "nombre": "La Plata"
            },
            "direccion": "Av. Principal 123"
        },
        "categoria": {
            "id": 1,
            "precio": "10000.00"
        },
        "politica": {
            "id": 1,
            "nombre": "Política Estándar",
            "descripcion": "Cancelación con 24 horas de anticipación",
            "porcentaje": "80.00"
        },
        "patente": "asdadasdas",
        "capacidad": 5,
        "año_fabricacion": 2015
    }
}
```


- Respuesta Error (400):
```json
{
    "modelo_id": [
        "Clave primaria \"1\" inválida - objeto no existe."
    ],
    "cliente_id": [
        "Clave primaria \"1\" inválida - objeto no existe."
    ]
}
```


- Respuesta Error (400):
```json
[
    "No hay vehículos disponibles del modelo seleccionado para las fechas especificadas"
]
```













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

You can also:
Modify a rental using PUT/PATCH to /api/alquileres/{id}/modificar/
Delete a rental using DELETE to /api/alquileres/{id}/baja/
List all rentals using GET to /api/alquileres/
Get a specific rental using GET to /api/alquileres/{id}/