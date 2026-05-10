// ============================================================
// Tipos del dominio - Microservicio de Reseñas
// ============================================================

export interface Resena {
  id: number;
  propiedad_id: number;
  arrendatario_id: number;
  arrendador_id: number;
  puntuacion: number;        // 1–5
  comentario: string | null;
  fecha_visita: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrearResenaDTO {
  propiedad_id: number;
  arrendatario_id: number;
  arrendador_id: number;
  puntuacion: number;
  comentario?: string;
  fecha_visita?: string;    // formato YYYY-MM-DD
}

export interface ActualizarResenaDTO {
  puntuacion?: number;
  comentario?: string;
}

export interface ResumenCalificaciones {
  propiedad_id: number;
  total_resenas: number;
  promedio: number;
  distribucion: {
    estrellas: number;
    cantidad: number;
  }[];
}
