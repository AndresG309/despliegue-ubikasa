import { pool } from "../config/database.js";

export const getAll = async () => {
  const [rows] =
    await pool.query(
      "SELECT * FROM propiedades"
    );

  return rows;
};

export const getById = async (
  id: number
) => {
  const [rows]: any =
    await pool.query(
      "SELECT * FROM propiedades WHERE id = ?",
      [id]
    );

  return rows[0];
};

export const create = async (
  titulo: string,
  descripcion: string,
  direccion: string,
  multimedia: string,
  arrendador_id: number,
  precio: number
) => {
  await pool.query(
    `
    INSERT INTO propiedades
    (
      titulo,
      descripcion,
      direccion,
      multimedia,
      arrendador_id,
      precio
    )

    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      titulo,
      descripcion,
      direccion,
      multimedia,
      arrendador_id,
      precio,
    ]
  );
};

export const update = async (
  id: number,
  data: any
) => {
  await pool.query(
    `
    UPDATE propiedades
    SET ?
    WHERE id = ?
    `,
    [data, id]
  );
};

export const remove = async (
  id: number
) => {
  await pool.query(
    `
    DELETE FROM propiedades
    WHERE id = ?
    `,
    [id]
  );
};

export const filtrar = async (
  titulo: string
) => {
  const [rows] =
    await pool.query(
      `
      SELECT * FROM propiedades
      WHERE titulo LIKE ?
      `,
      [`%${titulo}%`]
    );

  return rows;
};