import connection from "../config/database.js";

export async function getAll() {
  const [rows] = await connection.query(
    "SELECT * FROM propiedades"
  );

  return rows;
}

export async function getById(id: number) {
  const [rows] = await connection.query(
    "SELECT * FROM propiedades WHERE id = ?",
    [id]
  );

  return rows;
}

export async function create(
  titulo: string,
  descripcion: string,
  precio: number,
  direccion: string
) {
  const [result] = await connection.query(
    `
    INSERT INTO propiedades
    (titulo, descripcion, precio, direccion)
    VALUES (?, ?, ?, ?)
    `,
    [titulo, descripcion, precio, direccion]
  );

  return result;
}

export async function update(
  id: number,
  data: any
) {
  const [result] = await connection.query(
    `
    UPDATE propiedades
    SET titulo = ?,
        descripcion = ?,
        precio = ?,
        direccion = ?
    WHERE id = ?
    `,
    [
      data.titulo,
      data.descripcion,
      data.precio,
      data.direccion,
      id,
    ]
  );

  return result;
}

export async function remove(id: number) {
  const [result] = await connection.query(
    "DELETE FROM propiedades WHERE id = ?",
    [id]
  );

  return result;
}
