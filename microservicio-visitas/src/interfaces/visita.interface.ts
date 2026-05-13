export interface Visita {
  id: number;
  propiedadId: number;
  arrendadorId: number;
  visitanteId: number | null;
  fecha: string;
  hora: string;
  completada: boolean;
  createdAt: Date;
  updatedAt: Date;
  propiedadDetalles?: any;
  arrendadorDetalles?: any;
  visitanteDetalles?: any;
}

export interface CrearVisitaDTO {
  propiedadId: number;
  arrendadorId: number;
  fecha: string;
  hora: string;
}

export interface AgendarVisitaDTO {
  visitanteId: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
