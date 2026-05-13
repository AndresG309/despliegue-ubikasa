import pool from "../database/database.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { ResultSetHeader } from "mysql2/promise";
import { Usuario } from "../interfaces/Usuario.js";

class UsuarioModel {
  // Obtener usuario por ID
  async getUsuarioById(id: string): Promise<Usuario | null> {
    const [rows] = await pool.query(
      "SELECT id, nombre_completo, correo_electronico, foto_perfil, cedula, numero_celular, enlace_whatsapp FROM usuarios WHERE id = ?",
      [id],
    );
    const result = rows as Usuario[];
    return result.length > 0 ? result[0] : null;
  }

  // Obtener usuario por correo
  async getUsuarioByEmail(correo: string): Promise<Usuario | null> {
    const [rows] = await pool.query(
      "SELECT id, nombre_completo, correo_electronico, contrasena, foto_perfil, cedula, numero_celular, enlace_whatsapp FROM usuarios WHERE correo_electronico = ?",
      [correo],
    );
    const result = rows as Usuario[];
    return result.length > 0 ? result[0] : null;
  }

  // Crear nuevo usuario
  async createUsuario(usuario: Usuario): Promise<string> {
    const usuarioId = uuidv4();
    const contrasenaEncriptada = await bcrypt.hash(usuario.contrasena, 10);

    await pool.query(
      "INSERT INTO usuarios (id, nombre_completo, correo_electronico, contrasena, foto_perfil, cedula, numero_celular, enlace_whatsapp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        usuarioId,
        usuario.nombre_completo,
        usuario.correo_electronico,
        contrasenaEncriptada,
        usuario.foto_perfil || null,
        usuario.cedula,
        usuario.numero_celular,
        usuario.enlace_whatsapp || null,
      ],
    );

    return usuarioId;
  }

  // Actualizar usuario
  async updateUsuario(id: string, usuario: Partial<Usuario>): Promise<boolean> {
    const updates: string[] = [];
    const values: (string | null)[] = [];

    if (usuario.nombre_completo) {
      updates.push("nombre_completo = ?");
      values.push(usuario.nombre_completo);
    }
    if (usuario.foto_perfil !== undefined) {
      updates.push("foto_perfil = ?");
      values.push(usuario.foto_perfil || null);
    }
    if (usuario.numero_celular) {
      updates.push("numero_celular = ?");
      values.push(usuario.numero_celular);
    }
    if (usuario.enlace_whatsapp !== undefined) {
      updates.push("enlace_whatsapp = ?");
      values.push(usuario.enlace_whatsapp || null);
    }
    if (usuario.contrasena) {
      const contrasenaEncriptada = await bcrypt.hash(usuario.contrasena, 10);
      updates.push("contrasena = ?");
      values.push(contrasenaEncriptada);
    }

    if (updates.length === 0) {
      return false;
    }

    values.push(id);

    const query = `UPDATE usuarios SET ${updates.join(", ")} WHERE id = ?`;
    const [result] = await pool.query(query, values);

    return (result as ResultSetHeader).affectedRows > 0;
  }

  // Eliminar usuario
  async deleteUsuario(id: string): Promise<boolean> {
    const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);

    return (result as ResultSetHeader).affectedRows > 0;
  }

  // Verificar contraseña
  async verifyPassword(contrasenaPlana: string, contrasenaEncriptada: string): Promise<boolean> {
    return await bcrypt.compare(contrasenaPlana, contrasenaEncriptada);
  }

  // Verificar si correo existe
  async emailExists(correo: string, excludeId?: string): Promise<boolean> {
    let query = "SELECT COUNT(*) as count FROM usuarios WHERE correo_electronico = ?";
    const params: string[] = [correo];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await pool.query(query, params);
    const result = rows as any[];
    return result[0].count > 0;
  }

  // Verificar si cédula existe
  async cedulaExists(cedula: string, excludeId?: string): Promise<boolean> {
    let query = "SELECT COUNT(*) as count FROM usuarios WHERE cedula = ?";
    const params: string[] = [cedula];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await pool.query(query, params);
    const result = rows as any[];
    return result[0].count > 0;
  }
}

export default new UsuarioModel();
