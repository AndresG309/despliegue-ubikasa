CREATE DATABASE IF NOT EXISTS ubikasa_usuarios;
USE ubikasa_usuarios;
-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id VARCHAR(36) PRIMARY KEY,
  nombre_completo VARCHAR(255) NOT NULL,
  correo_electronico VARCHAR(255) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  foto_perfil VARCHAR(255),
  cedula VARCHAR(20) NOT NULL UNIQUE,
  numero_celular VARCHAR(20) NOT NULL,
  enlace_whatsapp VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
