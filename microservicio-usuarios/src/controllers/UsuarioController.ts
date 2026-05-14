import { Request, Response } from "express";
import UsuarioModel from "../models/UsuarioModel.js";
import { Usuario } from "../interfaces/Usuario.js";

export const getUsuarioById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const usuario = await UsuarioModel.getUsuarioById(id);

    if (!usuario) {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
      return;
    }

    res.json({
      success: true,
      data: usuario,
      message: "Usuario obtenido correctamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuario",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

export const createUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      nombre_completo,
      correo_electronico,
      contrasena,
      cedula,
      numero_celular,
      foto_perfil,
      enlace_whatsapp,
    } = req.body;

    // Validaciones
    if (!nombre_completo || !correo_electronico || !contrasena || !cedula || !numero_celular) {
      res.status(400).json({
        success: false,
        message:
          "Los campos nombre_completo, correo_electronico, contrasena, cedula y numero_celular son requeridos",
      });
      return;
    }

    // Verificar si el correo ya existe
    const emailExists = await UsuarioModel.emailExists(correo_electronico);
    if (emailExists) {
      res.status(400).json({
        success: false,
        message: "El correo electrónico ya está registrado",
      });
      return;
    }

    // Verificar si la cédula ya existe
    const cedulaExists = await UsuarioModel.cedulaExists(cedula);
    if (cedulaExists) {
      res.status(400).json({
        success: false,
        message: "La cédula ya está registrada",
      });
      return;
    }

    const nuevoUsuario: Usuario = {
      nombre_completo,
      correo_electronico,
      contrasena,
      cedula,
      numero_celular,
      foto_perfil,
      enlace_whatsapp,
    };

    const usuarioId = await UsuarioModel.createUsuario(nuevoUsuario);

    res.status(201).json({
      success: true,
      data: { id: usuarioId },
      message: "Usuario creado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear usuario",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

export const updateUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const { nombre_completo, numero_celular, foto_perfil, enlace_whatsapp, contrasena } = req.body;

    // Verificar que el usuario existe
    const usuario = await UsuarioModel.getUsuarioById(id);
    if (!usuario) {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
      return;
    }

    // Si se intenta cambiar el correo, verificar que no esté en uso
    if (req.body.correo_electronico && req.body.correo_electronico !== usuario.correo_electronico) {
      const emailExists = await UsuarioModel.emailExists(req.body.correo_electronico, id);
      if (emailExists) {
        res.status(400).json({
          success: false,
          message: "El correo electrónico ya está registrado",
        });
        return;
      }
    }

    const actualizaciones: Partial<Usuario> = {
      nombre_completo,
      numero_celular,
      foto_perfil,
      enlace_whatsapp,
      contrasena,
    };

    const updated = await UsuarioModel.updateUsuario(id, actualizaciones);

    if (!updated) {
      res.status(400).json({
        success: false,
        message: "No hay campos para actualizar",
      });
      return;
    }

    res.json({
      success: true,
      message: "Usuario actualizado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar usuario",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

export const deleteUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };

    // Verificar que el usuario existe
    const usuario = await UsuarioModel.getUsuarioById(id);
    if (!usuario) {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
      return;
    }

    const deleted = await UsuarioModel.deleteUsuario(id);

    if (!deleted) {
      res.status(400).json({
        success: false,
        message: "No se pudo eliminar el usuario",
      });
      return;
    }

    res.json({
      success: true,
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar usuario",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

export const loginUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correo_electronico, contrasena } = req.body;

    // Validaciones
    if (!correo_electronico || !contrasena) {
      res.status(400).json({
        success: false,
        message: "Correo electrónico y contraseña son requeridos",
      });
      return;
    }

    // Buscar usuario por correo
    const usuario = await UsuarioModel.getUsuarioByEmail(correo_electronico);
    if (!usuario) {
      res.status(401).json({
        success: false,
        message: "Correo o contraseña incorrectos",
      });
      return;
    }

    // Verificar contraseña
    const passwordValid = await UsuarioModel.verifyPassword(contrasena, usuario.contrasena);
    if (!passwordValid) {
      res.status(401).json({
        success: false,
        message: "Correo o contraseña incorrectos",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: usuario.id,
        nombre_completo: usuario.nombre_completo,
        correo_electronico: usuario.correo_electronico,
        foto_perfil: usuario.foto_perfil,
      },
      message: "Login exitoso",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al hacer login",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};
