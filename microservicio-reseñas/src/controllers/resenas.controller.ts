import type { Request, Response } from 'express';
import * as model from '../models/resenas.model.js';

// ── POST /resenas ─────────────────────────────────────────────
// Crear una nueva reseña
export async function crear(req: Request, res: Response): Promise<void> {
  const { arrendatario_id, arrendador_id, puntuacion, comentario } = req.body;

  if (!arrendatario_id || !arrendador_id || !puntuacion) {
    res.status(400).json({ error: 'Los campos arrendatario_id, arrendador_id y puntuacion son obligatorios.' });
    return;
  }
  if (typeof puntuacion !== 'number' || puntuacion < 1 || puntuacion > 5) {
    res.status(400).json({ error: 'La puntuación debe ser un número entre 1 y 5.' });
    return;
  }

  const nueva = await model.crearResena({ arrendatario_id, arrendador_id, puntuacion, comentario });
  res.status(201).json(nueva);
}

// ── GET /resenas/:id ──────────────────────────────────────────
// Obtener una reseña por ID
export async function obtenerPorId(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: 'ID inválido.' }); return; }

  const resena = await model.obtenerResenaPorId(id);
  if (!resena) { res.status(404).json({ error: 'Reseña no encontrada.' }); return; }
  res.json(resena);
}

// ── GET /resenas/arrendador/:arrendadorId ─────────────────────
// Historial de reseñas recibidas por un arrendador
export async function obtenerPorArrendador(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.arrendadorId);
  if (isNaN(id)) { res.status(400).json({ error: 'ID de arrendador inválido.' }); return; }

  const resenas = await model.resenasPorArrendador(id);
  res.json(resenas);
}

// ── GET /resenas/arrendador/:arrendadorId/resumen ─────────────
// Promedio y distribución de calificaciones de un arrendador
export async function obtenerResumenArrendador(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.arrendadorId);
  if (isNaN(id)) { res.status(400).json({ error: 'ID de arrendador inválido.' }); return; }

  const resumen = await model.resumenArrendador(id);
  res.json(resumen);
}

// ── GET /resenas/arrendatario/:arrendatarioId ─────────────────
// Reseñas escritas por un arrendatario
export async function obtenerPorArrendatario(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.arrendatarioId);
  if (isNaN(id)) { res.status(400).json({ error: 'ID de arrendatario inválido.' }); return; }

  const resenas = await model.resenasPorArrendatario(id);
  res.json(resenas);
}

// ── PATCH /resenas/:id ────────────────────────────────────────
// Actualizar puntuación o comentario
export async function actualizar(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: 'ID inválido.' }); return; }

  const existe = await model.obtenerResenaPorId(id);
  if (!existe) { res.status(404).json({ error: 'Reseña no encontrada.' }); return; }

  const { puntuacion, comentario } = req.body;
  if (puntuacion !== undefined && (typeof puntuacion !== 'number' || puntuacion < 1 || puntuacion > 5)) {
    res.status(400).json({ error: 'La puntuación debe ser un número entre 1 y 5.' });
    return;
  }

  const actualizada = await model.actualizarResena(id, { puntuacion, comentario });
  res.json(actualizada);
}

// ── DELETE /resenas/:id ───────────────────────────────────────
// Eliminar una reseña
export async function eliminar(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: 'ID inválido.' }); return; }

  const eliminada = await model.eliminarResena(id);
  if (!eliminada) { res.status(404).json({ error: 'Reseña no encontrada.' }); return; }
  res.status(204).send();
}
