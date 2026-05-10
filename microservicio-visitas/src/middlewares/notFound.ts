import { Request, Response } from "express";
import { sendError } from "../utils/responseHelper.js";

export const notFound = (_req: Request, res: Response): void => {
  sendError(res, 404, "Ruta no encontrada");
};
