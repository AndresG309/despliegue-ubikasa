import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import pool from "../db/connection.js";
import type { Visita, CrearVisitaDTO } from "../interfaces/visita.interface.js";

const DURACION_MINUTOS = 60;

export const findAll = async (): Promise<Visita[]> => {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM visitas ORDER BY fecha ASC, hora ASC");
  return rows as Visita[];
};

export const findById = async (id: number): Promise<Visita | null> => {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM visitas WHERE id = ?", [id]);
  return (rows[0] as Visita) || null;
};

export const findByPropiedadId = async (propiedadId: number): Promise<Visita[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM visitas WHERE propiedadId = ? ORDER BY fecha ASC, hora ASC",
    [propiedadId]
  );
  return rows as Visita[];
};

export const findDisponiblesByPropiedadId = async (propiedadId: number): Promise<Visita[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM visitas WHERE propiedadId = ? AND visitanteId IS NULL AND completada = false ORDER BY fecha ASC, hora ASC",
    [propiedadId]
  );
  return rows as Visita[];
};

export const findByVisitanteId = async (visitanteId: number): Promise<Visita[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM visitas WHERE visitanteId = ? ORDER BY fecha ASC, hora ASC",
    [visitanteId]
  );
  return rows as Visita[];
};

export const findByArrendadorId = async (arrendadorId: number): Promise<Visita[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM visitas WHERE arrendadorId = ? ORDER BY fecha ASC, hora ASC",
    [arrendadorId]
  );
  return rows as Visita[];
};

export const existsByPropiedadFechaHora = async (
  propiedadId: number,
  fecha: string,
  hora: string
): Promise<boolean> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM visitas WHERE propiedadId = ? AND fecha = ? AND hora = ?",
    [propiedadId, fecha, hora]
  );
  return rows.length > 0;
};

export const create = async (data: CrearVisitaDTO): Promise<Visita> => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO visitas (propiedadId, arrendadorId, fecha, hora, completada) VALUES (?, ?, ?, ?, false)",
    [data.propiedadId, data.arrendadorId, data.fecha, data.hora]
  );
  const visita = await findById(result.insertId);
  return visita!;
};

export const agendar = async (id: number, visitanteId: number): Promise<Visita | null> => {
  await pool.query<ResultSetHeader>(
    "UPDATE visitas SET visitanteId = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
    [visitanteId, id]
  );
  return findById(id);
};

export const cancelar = async (id: number): Promise<Visita | null> => {
  await pool.query<ResultSetHeader>(
    "UPDATE visitas SET visitanteId = NULL, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
    [id]
  );
  return findById(id);
};

export const completar = async (id: number): Promise<Visita | null> => {
  await pool.query<ResultSetHeader>(
    "UPDATE visitas SET completada = true, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
    [id]
  );
  return findById(id);
};

export const remove = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM visitas WHERE id = ?", [id]);
  return result.affectedRows > 0;
};
