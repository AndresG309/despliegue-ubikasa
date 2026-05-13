import pool from '../database/db.js';
import type { Resena, CrearResenaDTO, ActualizarResenaDTO, ResumenArrendador } from '../types.js';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// ── Crear reseña ─────────────────────────────────────────────
export async function crearResena(dto: CrearResenaDTO): Promise<Resena> {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO resenas (arrendatario_id, arrendador_id, puntuacion, comentario)
     VALUES (?, ?, ?, ?)`,
    [dto.arrendatario_id, dto.arrendador_id, dto.puntuacion, dto.comentario ?? null]
  );
  const resena = await obtenerResenaPorId(result.insertId);
  if (!resena) throw new Error('Error al recuperar la reseña creada');
  return resena;
}

// ── Obtener una reseña por ID ────────────────────────────────
export async function obtenerResenaPorId(id: number): Promise<Resena | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM resenas WHERE id = ?', [id]
  );
  return (rows[0] as Resena) ?? null;
}

// ── Historial de reseñas recibidas por un arrendador ────────
export async function resenasPorArrendador(arrendadorId: number): Promise<Resena[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM resenas WHERE arrendador_id = ? ORDER BY created_at DESC',
    [arrendadorId]
  );
  return rows as Resena[];
}

// ── Reseñas escritas por un arrendatario ────────────────────
export async function resenasPorArrendatario(arrendatarioId: number): Promise<Resena[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM resenas WHERE arrendatario_id = ? ORDER BY created_at DESC',
    [arrendatarioId]
  );
  return rows as Resena[];
}

// ── Resumen / promedio de calificaciones de un arrendador ───
export async function resumenArrendador(arrendadorId: number): Promise<ResumenArrendador> {
  const [stats] = await pool.execute<RowDataPacket[]>(
    `SELECT COUNT(*) AS total_resenas, AVG(puntuacion) AS promedio
     FROM resenas WHERE arrendador_id = ?`,
    [arrendadorId]
  );

  const [dist] = await pool.execute<RowDataPacket[]>(
    `SELECT puntuacion AS estrellas, COUNT(*) AS cantidad
     FROM resenas WHERE arrendador_id = ?
     GROUP BY puntuacion ORDER BY puntuacion DESC`,
    [arrendadorId]
  );

  const { total_resenas, promedio } = stats[0] as { total_resenas: number; promedio: number | null };

  return {
    arrendador_id:  arrendadorId,
    total_resenas:  Number(total_resenas),
    promedio:       promedio != null ? Math.round(Number(promedio) * 10) / 10 : 0,
    distribucion:   (dist as { estrellas: number; cantidad: number }[]).map(r => ({
      estrellas: Number(r.estrellas),
      cantidad:  Number(r.cantidad),
    })),
  };
}

// ── Actualizar reseña ────────────────────────────────────────
export async function actualizarResena(id: number, dto: ActualizarResenaDTO): Promise<Resena | null> {
  const campos: string[] = [];
  const valores: any[] = [];

  if (dto.puntuacion !== undefined) { campos.push('puntuacion = ?'); valores.push(dto.puntuacion); }
  if (dto.comentario !== undefined) { campos.push('comentario = ?'); valores.push(dto.comentario); }

  if (campos.length === 0) return obtenerResenaPorId(id);

  valores.push(id);
  await pool.execute(`UPDATE resenas SET ${campos.join(', ')} WHERE id = ?`, valores);
  return obtenerResenaPorId(id);
}

// ── Eliminar reseña ──────────────────────────────────────────
export async function eliminarResena(id: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM resenas WHERE id = ?', [id]
  );
  return result.affectedRows > 0;
}
