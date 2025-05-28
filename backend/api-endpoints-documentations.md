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
  "email": "ejemplo@correo.com",
  "password": "Password1",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "12345678",
  "fecha_nacimiento": "2000-01-01"
}
```

**RESPUESTA 201:**
```json
{
  "id": 1,
  "email": "ejemplo@correo.com"
}
```

**RESPUESTA 400:**  
- Contraseña insegura  
- Email ya registrado

---

### 🟢 Login  
**URL:** `POST /api/usuarios/login/`  
**QUERY:**
```json
{
  "email": "ejemplo@correo.com",
  "password": "Password1"
}
```

**RESPUESTA 200:**
```json
{
  "access": "token",
  "refresh": "token",
  "user": {...}
}
```

**RESPUESTA 401 o 403:**  
- Credenciales inválidas  
- Cuenta bloqueada

---

### 🔴 Logout  
**URL:** `POST /api/usuarios/logout/`  
**QUERY:**
```json
{
  "refresh": "token"
}
```

**RESPUESTA 205:** Logout exitoso  
**RESPUESTA 400:** Token inválido

---

## 👤 USUARIOS

### 🔍 Ver perfil  
**URL:** `GET /api/usuarios/<id>/perfil/`

### 🛠 Modificar usuario  
**URL:** `PUT /api/usuarios/<id>/modificar/`

### 🛑 Dar de baja  
**URL:** `DELETE /api/usuarios/<id>/baja/`

### 🔁 Cambiar rol y puesto  
**URL:** `PUT /api/usuarios/<id>/cambiar_rol/`  
**QUERY:**
```json
{
  "rol": "empleado",
  "puesto": "Atención",
  "localidad": 2
}
```

### 🧾 Ver historial de alquileres del usuario autenticado  
**URL:** `GET /api/usuarios/mis-alquileres/`

---

## 🚗 VEHÍCULOS

### 🔍 Listar vehículos  
**URL:** `GET /api/vehiculos/`

### ➕ Crear vehículo  
**URL:** `POST /api/vehiculos/`

### 🧾 Buscar por patente  
**URL:** `GET /api/vehiculos/buscar_por_patente/?patente=ABC123`

### 🛠 Modificar vehículo  
**URL:** `PUT/PATCH /api/vehiculos/<id>/modificar/`

### 🗑 Baja lógica  
**URL:** `DELETE /api/vehiculos/<id>/baja/`

---

## 📅 ALQUILERES

### ➕ Crear alquiler  
**URL:** `POST /api/alquileres/`  
**QUERY:**
```json
{
  "fecha_inicio": "...",
  "fecha_fin": "...",
  "fecha_reserva": "...",
  "categoria_id": 2
}
```

### 🛠 Modificar alquiler  
**URL:** `PUT/PATCH /api/alquileres/<id>/modificar/`

### 🗑 Baja lógica  
**URL:** `DELETE /api/alquileres/<id>/baja/`

### 🚫 Cancelar alquiler  
**URL:** `POST /api/alquileres/<id>/cancelar/`

---

## 📰 PUBLICACIONES

- `GET /api/publicaciones/`
- `POST /api/publicaciones/`

---

## ⭐ CALIFICACIONES

- `POST /api/calificaciones/`
- `DELETE /api/calificaciones/<id>/baja/`

---

## ❓ PREGUNTAS

- `POST /api/preguntas/`
- `DELETE /api/preguntas/<id>/baja/`

---

## 🏬 SUCURSALES

- `GET /api/sucursales/`
- `POST /api/sucursales/`
- `PUT /api/sucursales/<id>/modificar/`
- `DELETE /api/sucursales/<id>/baja/`

---

## 🏷️ CATEGORÍAS / MARCAS / MODELOS / POLÍTICAS / ESTADOS

- `/api/categorias/`
- `/api/marcas/`
- `/api/modelos/`
- `/api/politicas/`
- `/api/estados-vehiculo/`
- `/api/estados-alquiler/`

---

## 📈 ESTADÍSTICAS (TODO)

- `/api/estadisticas/mejor_calificado/`
- `/api/estadisticas/mas_alquilado/`
- `/api/estadisticas/registros_periodo/`
