import { Router } from 'express';
import * as controller from '../controllers/resenas.controller.js';

const router = Router();

// ── POST /resenas ─────────────────────────────────────────────
router.post('/', controller.crear);

// ── GET /resenas/:id ──────────────────────────────────────────
router.get('/:id', controller.obtenerPorId);

// ── GET /resenas/arrendador/:arrendadorId ─────────────────────
router.get('/arrendador/:arrendadorId', controller.obtenerPorArrendador);

// ── GET /resenas/arrendador/:arrendadorId/resumen ─────────────
router.get('/arrendador/:arrendadorId/resumen', controller.obtenerResumenArrendador);

// ── GET /resenas/arrendatario/:arrendatarioId ─────────────────
router.get('/arrendatario/:arrendatarioId', controller.obtenerPorArrendatario);

// ── PATCH /resenas/:id ────────────────────────────────────────
router.patch('/:id', controller.actualizar);

// ── DELETE /resenas/:id ───────────────────────────────────────
router.delete('/:id', controller.eliminar);

export default router;
