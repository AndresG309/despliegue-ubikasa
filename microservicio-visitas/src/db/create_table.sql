-- ================================================
-- Tabla: visitas
-- Microservicio de Visitas - Plataforma Ubikasa
-- ================================================

USE microservicio_visitas;

CREATE TABLE IF NOT EXISTS visitas (
  id              INT             NOT NULL AUTO_INCREMENT,
  propiedadId     INT             NOT NULL,
  arrendadorId    VARCHAR(36)     NOT NULL,
  visitanteId     VARCHAR(36)     NULL DEFAULT NULL,
  fecha           DATE            NOT NULL,
  hora            TIME            NOT NULL,
  completada      BOOLEAN         NOT NULL DEFAULT FALSE,
  createdAt       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  -- Restricción: no duplicar visitas para la misma propiedad, fecha y hora
  UNIQUE KEY uq_propiedad_fecha_hora (propiedadId, fecha, hora),

  -- Índices para consultas frecuentes
  INDEX idx_propiedadId (propiedadId),
  INDEX idx_arrendadorId (arrendadorId),
  INDEX idx_visitanteId (visitanteId),
  INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
