# Microservicio de Visitas — Ubikasa

Microservicio backend para la gestión de visitas a propiedades en la plataforma Ubikasa.

## Tecnologías

- **Runtime:** Node.js
- **Framework:** Express 5
- **Lenguaje:** TypeScript
- **Base de datos:** MySQL
- **Módulos:** ESModules

## Estructura del proyecto

```
src/
├── controllers/       # Lógica de negocio de los endpoints
├── db/                # Conexión MySQL y scripts SQL
├── interfaces/        # Tipos e interfaces TypeScript
├── middlewares/        # Manejo de errores y 404
├── models/            # Consultas SQL parametrizadas
├── routes/            # Definición de rutas Express
├── utils/             # Helpers y validadores
├── app.ts             # Configuración de Express
└── server.ts          # Punto de entrada
```

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MySQL

# 3. Crear la base de datos y tabla
# Ejecutar los scripts SQL en tu cliente MySQL:
#   src/db/create_database.sql
#   src/db/create_table.sql

# 4. Iniciar en modo desarrollo
npm run dev
```

## Scripts

| Comando           | Descripción                             |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Inicia el servidor con hot-reload (tsx) |
| `npm run build`   | Compila TypeScript a JavaScript         |
| `npm start`       | Ejecuta la versión compilada            |
| `npm run lint`    | Ejecuta ESLint                          |
| `npm run format`  | Formatea con Prettier                   |

## Variables de entorno

| Variable      | Descripción                  | Default           |
| ------------- | ---------------------------- | ----------------- |
| `PORT`        | Puerto del servidor          | `3003`            |
| `DB_HOST`     | Host de MySQL                | `localhost`       |
| `DB_PORT`     | Puerto de MySQL              | `3306`            |
| `DB_USER`     | Usuario de MySQL             | `root`            |
| `DB_PASSWORD` | Contraseña de MySQL          | (vacío)           |
| `DB_NAME`     | Nombre de la base de datos   | `ubikasa_visitas` |

## Endpoints

### Health Check

```
GET /health
```

### Visitas

| Método   | Ruta                                        | Descripción                          |
| -------- | ------------------------------------------- | ------------------------------------ |
| `GET`    | `/visitas`                                  | Obtener todas las visitas            |
| `GET`    | `/visitas/:id`                              | Obtener una visita por ID            |
| `GET`    | `/visitas/propiedad/:propiedadId`           | Visitas de una propiedad             |
| `GET`    | `/visitas/propiedad/:propiedadId/disponibles` | Horarios disponibles de una propiedad |
| `GET`    | `/visitas/visitante/:visitanteId`           | Historial de visitas de un visitante |
| `GET`    | `/visitas/arrendador/:arrendadorId`         | Visitas creadas por un arrendador    |
| `POST`   | `/visitas`                                  | Crear nuevo cupo de visita           |
| `PATCH`  | `/visitas/:id/agendar`                      | Reservar una visita libre            |
| `PATCH`  | `/visitas/:id/cancelar`                     | Cancelar reserva                     |
| `PATCH`  | `/visitas/:id/completar`                    | Marcar como completada               |
| `DELETE` | `/visitas/:id`                              | Eliminar una visita                  |

### Ejemplos de requests

#### Crear cupo de visita

```bash
curl -X POST http://localhost:3003/visitas \
  -H "Content-Type: application/json" \
  -d '{
    "propiedadId": 1,
    "arrendadorId": 1,
    "fecha": "2026-06-15",
    "hora": "10:00"
  }'
```

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Visita creada correctamente",
  "data": {
    "id": 1,
    "propiedadId": 1,
    "arrendadorId": 1,
    "visitanteId": null,
    "fecha": "2026-06-15",
    "hora": "10:00",
    "completada": false,
    "createdAt": "2026-06-01T12:00:00.000Z",
    "updatedAt": "2026-06-01T12:00:00.000Z"
  }
}
```

#### Agendar visita

```bash
curl -X PATCH http://localhost:3003/visitas/1/agendar \
  -H "Content-Type: application/json" \
  -d '{ "visitanteId": 5 }'
```

#### Cancelar reserva

```bash
curl -X PATCH http://localhost:3003/visitas/1/cancelar
```

#### Completar visita

```bash
curl -X PATCH http://localhost:3003/visitas/1/completar
```

#### Respuesta de error

```json
{
  "success": false,
  "message": "La visita ya está reservada"
}
```

## Reglas de negocio

1. `visitanteId = null` → horario libre
2. `visitanteId != null` → horario reservado
3. No se permiten visitas duplicadas (misma propiedad + fecha + hora)
4. Solo se puede agendar si `visitanteId` es `null`
5. Una visita completada no puede cancelarse
6. La duración de cada visita es fija: 60 minutos (constante en el código, no almacenada en BD)
7. `completada` inicia en `false`

## Integración con otros microservicios

El **microservicio de reseñas** depende de este servicio. Solo se pueden crear reseñas si existe una visita con `completada = true`.
