// ============================================================
// Tipos del dominio - Microservicio de Reseñas
// ============================================================

export interface Resena {
  id: number;
  arrendatario_id: number;
  arrendador_id: number;
  puntuacion: number;
  comentario: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrearResenaDTO {
  arrendatario_id: number;
  arrendador_id: number;
  puntuacion: number;
  comentario?: string;
}

export interface ActualizarResenaDTO {
  puntuacion?: number;
  comentario?: string;
}

export interface ResumenArrendador {
  arrendador_id: number;
  total_resenas: number;
  promedio: number;
  distribucion: {
    estrellas: number;
    cantidad: number;
  }[];
}