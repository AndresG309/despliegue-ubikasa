import { Router } from "express";
import {
  //getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  loginUsuario,
} from "../controllers/UsuarioController.js";

const router = Router();

// Rutas de usuarios
//router.get('/', getAllUsuarios);
router.get("/:id", getUsuarioById);
router.post("/", createUsuario);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);

// Ruta de autenticación
router.post("/auth/login", loginUsuario);

export default router;
