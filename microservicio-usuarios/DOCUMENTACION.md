# Microservicio de Usuarios

## Descripción
Microservicio responsable de la gestión de usuarios en la plataforma Ubikasa.

## URL Base
```
http://localhost:3001/usuarios
```

---

## Endpoints

### 1. Obtener Usuario por ID
**GET** `/:id`

| Parámetro | Tipo | Ubicación | Obligatorio |
|-----------|------|-----------|------------|
| id | UUID | Path | Sí |

**Ejemplo**: `GET /550e8400-e29b-41d4-a716-446655440000`

---

### 2. Crear Usuario
**POST** `/`

| Parámetro | Tipo | Obligatorio | Descripción |
|-----------|------|------------|-------------|
| nombre_completo | string | Sí | Nombre completo del usuario |
| correo_electronico | string | Sí | Email único |
| contrasena | string | Sí | Contraseña (será encriptada) |
| cedula | string | Sí | Cédula única |
| numero_celular | string | Sí | Número de celular |
| foto_perfil | string | No | URL de foto |
| enlace_whatsapp | string | No | Link de WhatsApp |

---

### 3. Actualizar Usuario
**PUT** `/:id`

| Parámetro | Tipo | Ubicación | Obligatorio |
|-----------|------|-----------|------------|
| id | UUID | Path | Sí |

**Body** (todos opcionales):
- nombre_completo
- numero_celular
- foto_perfil
- enlace_whatsapp
- contrasena
- correo_electronico

---

### 4. Eliminar Usuario
**DELETE** `/:id`

| Parámetro | Tipo | Ubicación | Obligatorio |
|-----------|------|-----------|------------|
| id | UUID | Path | Sí |

---

### 5. Login
**POST** `/auth/login`

| Parámetro | Tipo | Obligatorio |
|-----------|------|------------|
| correo_electronico | string | Sí |
| contrasena | string | Sí |

---

## Validaciones

- **Email único**: No se pueden registrar dos usuarios con el mismo email
- **Cédula única**: No se pueden registrar dos usuarios con la misma cédula
- **Contraseña**: Se encripta automáticamente con bcrypt
- **IDs**: Se generan automáticamente como UUIDs v4

## Códigos de Error

| Código | Significado |
|--------|------------|
| 200 | OK |
| 201 | Creado |
| 400 | Error de validación |
| 404 | No encontrado |
| 500 | Error del servidor |


