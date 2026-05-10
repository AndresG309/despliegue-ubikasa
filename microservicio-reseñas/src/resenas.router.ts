import { Router } from 'express';
import type { Request, Response } from 'express';
import * as repo from './resenas.repository.js';

const router = Router();

// ── POST /resenas ─────────────────────────────────────────────
// Crear una nueva reseña (la escribe el arrendatario)
router.post('/', async (req: Request, res: Response) => {
  const { propiedad_id, arrendatario_id, arrendador_id, puntuacion, comentario, fecha_visita } = req.body;

  if (!propiedad_id || !arrendatario_id || !arrendador_id || !puntuacion) {
    res.status(400).json({ error: 'Los campos propiedad_id, arrendatario_id, arrendador_id y puntuacion son obligatorios.' });
    return;
  }

  if (typeof puntuacion !== 'number' || puntuacion < 1 || puntuacion > 5) {
    res.status(400).json({ error: 'La puntuación debe ser un número entre 1 y 5.' });
    return;
  }

  const nueva = await repo.crearResena({ propiedad_id, arrendatario_id, arrendador_id, puntuacion, comentario, fecha_visita });
  res.status(201).json(nueva);
});

// ── GET /resenas/:id ──────────────────────────────────────────
// Obtener una reseña específica
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: 'ID inválido.' }); return; }

  const resena = await repo.obtenerResenaPorId(id);
  if (!resena) { res.status(404).json({ error: 'Reseña no encontrada.' }); return; }

  res.json(resena);
});

// ── GET /resenas/propiedad/:propiedadId ───────────────────────
// Todas las reseñas de una propiedad (público, para arrendatarios que buscan)
router.get('/propiedad/:propiedadId', async (req: Request, res: Response) => {
  const propiedadId = Number(req.params.propiedadId);
  if (isNaN(propiedadId)) { res.status(400).json({ error: 'ID de propiedad inválido.' }); return; }

  const resenas = await repo.listarResenasPorPropiedad(propiedadId);
  res.json(resenas);
});

// ── GET /resenas/propiedad/:propiedadId/resumen ───────────────
// Resumen de calificaciones de una propiedad (promedio + distribución)
router.get('/propiedad/:propiedadId/resumen', async (req: Request, res: Response) => {
  const propiedadId = Number(req.params.propiedadId);
  if (isNaN(propiedadId)) { res.status(400).json({ error: 'ID de propiedad inválido.' }); return; }

  const resumen = await repo.resumenCalificaciones(propiedadId);
  res.json(resumen);
});

// ── GET /resenas/arrendador/:arrendadorId ─────────────────────
// Historial completo de reseñas recibidas por el arrendador
// (Paso 6: el arrendador consulta sus calificaciones)
router.get('/arrendador/:arrendadorId', async (req: Request, res: Response) => {
  const arrendadorId = Number(req.params.arrendadorId);
  if (isNaN(arrendadorId)) { res.status(400).json({ error: 'ID de arrendador inválido.' }); return; }

  const resenas = await repo.historialPorArrendador(arrendadorId);
  res.json(resenas);
});

// ── GET /resenas/arrendatario/:arrendatarioId ─────────────────
// Reseñas escritas por un arrendatario
router.get('/arrendatario/:arrendatarioId', async (req: Request, res: Response) => {
  const arrendatarioId = Number(req.params.arrendatarioId);
  if (isNaN(arrendatarioId)) { res.status(400).json({ error: 'ID de arrendatario inválido.' }); return; }

  const resenas = await repo.resenasPorArrendatario(arrendatarioId);
  res.json(resenas);
});

// ── PATCH /resenas/:id ────────────────────────────────────────
// Actualizar puntuación o comentario de una reseña
router.patch('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: 'ID inválido.' }); return; }

  const existe = await repo.obtenerResenaPorId(id);
  if (!existe) { res.status(404).json({ error: 'Reseña no encontrada.' }); return; }

  const { puntuacion, comentario } = req.body;
  if (puntuacion !== undefined && (typeof puntuacion !== 'number' || puntuacion < 1 || puntuacion > 5)) {
    res.status(400).json({ error: 'La puntuación debe ser un número entre 1 y 5.' });
    return;
  }

  const actualizada = await repo.actualizarResena(id, { puntuacion, comentario });
  res.json(actualizada);
});

// ── DELETE /resenas/:id ───────────────────────────────────────
// Eliminar una reseña
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: 'ID inválido.' }); return; }

  const eliminada = await repo.eliminarResena(id);
  if (!eliminada) { res.status(404).json({ error: 'Reseña no encontrada.' }); return; }

  res.status(204).send();
});

export default router;
