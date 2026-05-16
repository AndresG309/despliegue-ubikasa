-- ============================================================
-- Microservicio de Reseñas - Ubikasa
-- Reseñas de arrendatario → arrendador
-- ============================================================
CREATE DATABASE IF NOT EXISTS microservicio_resenas;
 
USE `microservicio_resenas`;
 
DROP TABLE IF EXISTS resenas;
 
CREATE TABLE resenas (
  id               INT       NOT NULL AUTO_INCREMENT,
  arrendatario_id  INT       NOT NULL COMMENT 'ID del arrendatario que escribe la reseña',
  arrendador_id    INT       NOT NULL COMMENT 'ID del arrendador que recibe la reseña',
  puntuacion       TINYINT   NOT NULL COMMENT 'Calificación del 1 al 5',
  comentario       TEXT               COMMENT 'Comentario opcional sobre la experiencia',
  created_at       DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 
  PRIMARY KEY (id),
  INDEX idx_arrendador   (arrendador_id),
  INDEX idx_arrendatario (arrendatario_id),
 
  CONSTRAINT chk_puntuacion CHECK (puntuacion BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
-- Datos de prueba
INSERT INTO resenas (arrendatario_id, arrendador_id, puntuacion, comentario) VALUES
  (10, 5, 5, 'Excelente arrendador, muy atento y resolvió todo rápido.'),
  (11, 5, 4, 'Buena experiencia, muy puntual y amable en todo momento.'),
  (12, 5, 3, 'Regular, tardó en responder algunos mensajes importantes.'),
  (10, 7, 5, 'Increíble trato, totalmente recomendado como arrendador.'),
  (13, 5, 4, 'Buen arrendador, el proceso fue claro y sin inconvenientes.');