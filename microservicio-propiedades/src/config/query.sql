CREATE DATABASE IF NOT EXISTS ubikasa_propiedades;

USE ubikasa_propiedades;

CREATE TABLE IF NOT EXISTS propiedades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    multimedia TEXT,
    arrendador_id VARCHAR(36),
    precio DECIMAL(10,2) NOT NULL,
    interacciones INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;