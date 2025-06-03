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

Endpoint: 

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