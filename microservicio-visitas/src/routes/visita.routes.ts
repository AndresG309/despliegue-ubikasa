import { Router } from "express";
import * as VisitaController from "../controllers/visita.controller.js";

const router = Router();

router.get("/", VisitaController.getAll);
router.get("/:id", VisitaController.getById);
router.get("/propiedad/:propiedadId", VisitaController.getByPropiedadId);
router.get("/propiedad/:propiedadId/disponibles", VisitaController.getDisponiblesByPropiedadId);
router.get("/visitante/:visitanteId", VisitaController.getByVisitanteId);
router.get("/arrendador/:arrendadorId", VisitaController.getByArrendadorId);

router.post("/", VisitaController.create);

router.patch("/:id/agendar", VisitaController.agendar);
router.patch("/:id/cancelar", VisitaController.cancelar);
router.patch("/:id/completar", VisitaController.completar);

router.delete("/:id", VisitaController.remove);

export default router;
