import { Router } from "express";
import * as PropiedadController from "../controllers/propiedadesController.js";

const router = Router();

router.get("/", PropiedadController.getAll);
router.get("/:id", PropiedadController.getById);
router.post("/", PropiedadController.create);
router.patch("/:id", PropiedadController.update);
router.delete("/:id", PropiedadController.remove);

export default router;