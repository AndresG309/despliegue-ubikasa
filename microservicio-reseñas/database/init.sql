-- ============================================================
-- Microservicio de Reseñas - Ubikasa
-- Script de inicialización de base de datos
-- ============================================================

CREATE DATABASE IF NOT EXISTS ubikasa_resenas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ubikasa_resenas;

CREATE TABLE IF NOT EXISTS resenas (
  id            INT          NOT NULL AUTO_INCREMENT,
  propiedad_id  INT          NOT NULL COMMENT 'ID de la propiedad en el microservicio de propiedades',
  arrendatario_id INT        NOT NULL COMMENT 'ID del arrendatario que escribe la reseña',
  arrendador_id INT          NOT NULL COMMENT 'ID del arrendador dueño de la propiedad',
  puntuacion    TINYINT      NOT NULL COMMENT 'Calificación del 1 al 5',
  comentario    TEXT                  COMMENT 'Comentario sobre la experiencia',
  fecha_visita  DATE                  COMMENT 'Fecha aproximada de la visita o estancia',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_propiedad  (propiedad_id),
  INDEX idx_arrendador (arrendador_id),
  INDEX idx_arrendatario (arrendatario_id),

  CONSTRAINT chk_puntuacion CHECK (puntuacion BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Datos de prueba
-- ============================================================

INSERT INTO resenas (propiedad_id, arrendatario_id, arrendador_id, puntuacion, comentario, fecha_visita) VALUES
  (1, 10, 5, 5, 'Excelente propiedad, muy bien ubicada y el arrendador muy atento.', '2025-03-15'),
  (1, 11, 5, 4, 'Muy buena experiencia, el apartamento estaba limpio y cómodo.', '2025-04-02'),
  (2, 12, 5, 3, 'Regular, algunos detalles pendientes de mantenimiento.', '2025-02-20'),
  (3, 10, 7, 5, 'Increíble, todo perfecto. Lo recomiendo totalmente.', '2025-01-10'),
  (1, 13, 5, 4, 'Buena experiencia en general, el barrio muy tranquilo.', '2025-04-28');
