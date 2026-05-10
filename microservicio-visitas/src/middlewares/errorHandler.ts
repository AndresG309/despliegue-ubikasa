import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError.js";
import { sendError } from "../utils/responseHelper.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("❌ Error:", err.message);

  if (err instanceof HttpError) {
    sendError(res, err.statusCode, err.message);
    return;
  }

  sendError(res, 500, "Error interno del servidor");
};
