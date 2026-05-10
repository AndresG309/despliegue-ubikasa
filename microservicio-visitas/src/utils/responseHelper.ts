import { Response } from "express";
import type { ApiResponse } from "../interfaces/visita.interface.js";

export const sendSuccess = <T>(res: Response, statusCode: number, message: string, data?: T): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };
  res.status(statusCode).json(response);
};

export const sendError = (res: Response, statusCode: number, message: string): void => {
  const response: ApiResponse = {
    success: false,
    message,
  };
  res.status(statusCode).json(response);
};
