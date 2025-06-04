Usuarios

Ver datos de usuario:

Endpoint: GET /api/usuarios/perfil/

Request: sin body

Respuesta:
{
    "id": 4,
    "email": "dante2@cliente.com",
    "nombre": "Probando2",
    "apellido": "Si",
    "telefono": "1234567890",
    "fecha_nacimiento": "2004-06-30",
    "rol": "Cliente",
    "puesto": null,
    "localidad": null
}

Error:
{
    "detail": "Las credenciales de autenticación no se proveyeron."
}

Modificar Datos de usuario:

Endpoint: PUT /api/usuarios/modificar/

Request: (Todos los campos son opcionales, se pueden poner y sacar)
{
    "nombre": "Probando2",
    "apellido": "Si",
    "telefono": "1234567890",
    "contraseña": "Cliente12345"
}

Respuesta:
{
    "id": 4,
    "email": "dante2@cliente.com",
    "nombre": "Probando2",
    "apellido": "Si",
    "telefono": "1234567890",
    "fecha_nacimiento": "2004-06-30",
    "rol": 1,
    "puesto": null,
    "localidad": null
}

Error 1:
{
    "error": "La contraseña debe tener al menos 8 caracteres"
}

Error 2:
{
    "error": "La contraseña debe contener al menos una letra mayúscula"
}

Error 3:
{
    "error": "La contraseña debe contener al menos una letra minúscula"
}

Error 4:
{
    "error": "La contraseña debe contener al menos un número"
}

Login de usuario:

Endpoint: POST /api/usuarios/login/

Request:
{
    "email": "dante2@cliente.com",
    "password": "Cliente1234"
}

Respuesta:
{
    "refresh": "token",
    "access": "token",
    "user": {
        "id": 3,
        "email": "dante@cliente.com",
        "nombre": "Dante",
        "apellido": "Puddu",
        "telefono": "1234567890",
        "fecha_nacimiento": "2004-06-30",
        "rol": "Cliente",
        "puesto": null,
        "localidad": null
    }
}

Error:
{
    "error": "Credenciales inválidas"
}

Login de Admin (Reconoce al admin PASO 1):

Endpoint: POST /api/usuarios/login/

Request:
{
    "email": "admin@admin.com",
    "password": "Admin1234"
}

Respuesta / Error:
{
    "error": "Se requiere código de administrador",
    "require_admin_code": true
}

Login de Admin (PASO 2):

Endpoint: POST /api/usuarios/login/

Request:
{
    "email": "admin2@admin.com",
    "password": "Admin1234",
    "codigo_admin": "123a45"
}

Respuesta:
{
    "refresh": "token",
    "access": "token",
    "user": {
        "id": 2,
        "email": "admin2@admin.com",
        "nombre": "admin2",
        "apellido": "Maria",
        "telefono": "1234567890",
        "fecha_nacimiento": "1990-01-01",
        "rol": "Admin",
        "puesto": null,
        "localidad": null
    }
}

Error:
{
    "error": "La clave ingresada es incorrecta"
}