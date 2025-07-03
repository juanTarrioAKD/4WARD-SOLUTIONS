# Endpoint de Registro de Clientes por Empleados

## Descripción

Este endpoint permite a empleados (rol 2) y administradores (rol 3) registrar nuevos clientes en el sistema con contraseñas generadas automáticamente. Es especialmente útil para casos donde un cliente llega presencialmente y necesita una cuenta para realizar un alquiler.

## URL del Endpoint

```
POST /api/usuarios/registrar-cliente/
```

## Autenticación

Se requiere autenticación con token JWT. Solo usuarios con rol 2 (empleado) o 3 (admin) pueden acceder.

## Parámetros de Entrada

### Campos Requeridos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `email` | string | Email único del cliente |
| `nombre` | string | Nombre del cliente |
| `apellido` | string | Apellido del cliente |
| `telefono` | string | Número de teléfono |
| `fecha_nacimiento` | date | Fecha de nacimiento (YYYY-MM-DD) |

### Campos Opcionales

| Campo | Tipo | Descripción | Valor por defecto |
|-------|------|-------------|-------------------|
| `rol` | integer | ID del rol del usuario | 1 (cliente) |
| `puesto` | string | Puesto del empleado | null |
| `localidad` | integer | ID de la localidad | null |

## Ejemplo de Request

```bash
curl -X POST "http://localhost:8000/api/usuarios/registrar-cliente/" \
  -H "Authorization: Bearer <tu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "123456789",
    "fecha_nacimiento": "1990-01-01",
    "rol": 1,
    "localidad": 1
  }'
```

## Respuesta Exitosa

**Status Code:** 201 Created

```json
{
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": 123,
    "email": "cliente@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "123456789",
    "fecha_nacimiento": "1990-01-01",
    "rol": 1,
    "puesto": null,
    "localidad": 1
  },
  "password_generada": "Kj9#mN2$pL5"
}
```

## Respuestas de Error

### 400 Bad Request - Email ya registrado
```json
{
  "error": "El email ya está registrado"
}
```

### 400 Bad Request - Datos inválidos
```json
{
  "email": ["Este campo es requerido."],
  "nombre": ["Este campo es requerido."]
}
```

### 403 Forbidden - Sin permisos
```json
{
  "detail": "No tienes permiso para realizar esta acción"
}
```

### 401 Unauthorized - Token inválido
```json
{
  "detail": "Las credenciales de autenticación no se proveyeron."
}
```

## Características de la Contraseña Generada

La contraseña generada automáticamente cumple con los siguientes requisitos de seguridad:

- **Longitud:** 12 caracteres
- **Mayúsculas:** Al menos 1 letra mayúscula
- **Minúsculas:** Al menos 1 letra minúscula
- **Números:** Al menos 1 número
- **Caracteres especiales:** Al menos 1 carácter especial (!@#$%^&*)

## Flujo de Uso Típico

1. **Cliente llega presencialmente** a la sucursal
2. **Empleado verifica** que el cliente no tenga cuenta
3. **Empleado usa este endpoint** para crear la cuenta
4. **Sistema genera contraseña** automáticamente
5. **Empleado proporciona** al cliente:
   - Su email
   - La contraseña generada
6. **Cliente puede iniciar sesión** inmediatamente

## Notas Importantes

- La contraseña generada se devuelve **solo una vez** en la respuesta
- El empleado debe **anotar y entregar** la contraseña al cliente
- Se recomienda que el cliente **cambie su contraseña** después del primer login
- El usuario creado tendrá **rol de cliente (1)** por defecto
- Solo **empleados y administradores** pueden usar este endpoint

## Pruebas

Para probar el endpoint, puedes usar el script incluido:

```bash
cd backend
python test_registro_cliente.py
```

**Nota:** Asegúrate de modificar las credenciales en el script antes de ejecutarlo.

## Seguridad

- ✅ Validación de permisos por rol
- ✅ Generación segura de contraseñas
- ✅ Validación de datos de entrada
- ✅ Verificación de email único
- ✅ Autenticación requerida 