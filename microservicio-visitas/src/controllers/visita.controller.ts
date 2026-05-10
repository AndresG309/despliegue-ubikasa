import { Request, Response, NextFunction } from "express";
import * as VisitaModel from "../models/visita.model.js";
import { sendSuccess, sendError } from "../utils/responseHelper.js";
import { HttpError } from "../utils/httpError.js";
import { isValidDate, isValidTime, isPositiveInteger } from "../utils/validators.js";

export const getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const visitas = await VisitaModel.findAll();
    sendSuccess(res, 200, "Visitas obtenidas correctamente", visitas);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!isPositiveInteger(id)) {
      sendError(res, 400, "El ID debe ser un número entero positivo");
      return;
    }

    const visita = await VisitaModel.findById(id);
    if (!visita) {
      sendError(res, 404, "Visita no encontrada");
      return;
    }

    sendSuccess(res, 200, "Visita obtenida correctamente", visita);
  } catch (error) {
    next(error);
  }
};

export const getByPropiedadId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const propiedadId = Number(req.params.propiedadId);
    if (!isPositiveInteger(propiedadId)) {
      sendError(res, 400, "El propiedadId debe ser un número entero positivo");
      return;
    }

    const visitas = await VisitaModel.findByPropiedadId(propiedadId);
    sendSuccess(res, 200, "Visitas de la propiedad obtenidas correctamente", visitas);
  } catch (error) {
    next(error);
  }
};

export const getDisponiblesByPropiedadId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const propiedadId = Number(req.params.propiedadId);
    if (!isPositiveInteger(propiedadId)) {
      sendError(res, 400, "El propiedadId debe ser un número entero positivo");
      return;
    }

    const visitas = await VisitaModel.findDisponiblesByPropiedadId(propiedadId);
    sendSuccess(res, 200, "Horarios disponibles obtenidos correctamente", visitas);
  } catch (error) {
    next(error);
  }
};

export const getByVisitanteId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const visitanteId = Number(req.params.visitanteId);
    if (!isPositiveInteger(visitanteId)) {
      sendError(res, 400, "El visitanteId debe ser un número entero positivo");
      return;
    }

    const visitas = await VisitaModel.findByVisitanteId(visitanteId);
    sendSuccess(res, 200, "Historial de visitas obtenido correctamente", visitas);
  } catch (error) {
    next(error);
  }
};

export const getByArrendadorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const arrendadorId = Number(req.params.arrendadorId);
    if (!isPositiveInteger(arrendadorId)) {
      sendError(res, 400, "El arrendadorId debe ser un número entero positivo");
      return;
    }

    const visitas = await VisitaModel.findByArrendadorId(arrendadorId);
    sendSuccess(res, 200, "Visitas del arrendador obtenidas correctamente", visitas);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { propiedadId, arrendadorId, fecha, hora } = req.body;

    if (!propiedadId || !arrendadorId || !fecha || !hora) {
      sendError(res, 400, "Los campos propiedadId, arrendadorId, fecha y hora son obligatorios");
      return;
    }

    if (!isPositiveInteger(Number(propiedadId))) {
      sendError(res, 400, "El propiedadId debe ser un número entero positivo");
      return;
    }

    if (!isPositiveInteger(Number(arrendadorId))) {
      sendError(res, 400, "El arrendadorId debe ser un número entero positivo");
      return;
    }

    if (!isValidDate(fecha)) {
      sendError(res, 400, "La fecha debe tener el formato YYYY-MM-DD");
      return;
    }

    if (!isValidTime(hora)) {
      sendError(res, 400, "La hora debe tener el formato HH:MM (24 horas)");
      return;
    }

    const existe = await VisitaModel.existsByPropiedadFechaHora(Number(propiedadId), fecha, hora);
    if (existe) {
      sendError(res, 409, "Ya existe una visita para esta propiedad en la misma fecha y hora");
      return;
    }

    const visita = await VisitaModel.create({
      propiedadId: Number(propiedadId),
      arrendadorId: Number(arrendadorId),
      fecha,
      hora,
    });

    sendSuccess(res, 201, "Visita creada correctamente", visita);
  } catch (error) {
    next(error);
  }
};

export const agendar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!isPositiveInteger(id)) {
      sendError(res, 400, "El ID debe ser un número entero positivo");
      return;
    }

    const { visitanteId } = req.body;
    if (!visitanteId || !isPositiveInteger(Number(visitanteId))) {
      sendError(res, 400, "El visitanteId es obligatorio y debe ser un número entero positivo");
      return;
    }

    const visita = await VisitaModel.findById(id);
    if (!visita) {
      sendError(res, 404, "Visita no encontrada");
      return;
    }

    if (visita.visitanteId !== null) {
      sendError(res, 409, "La visita ya está reservada");
      return;
    }

    const visitaAgendada = await VisitaModel.agendar(id, Number(visitanteId));
    sendSuccess(res, 200, "Visita agendada correctamente", visitaAgendada);
  } catch (error) {
    next(error);
  }
};

export const cancelar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!isPositiveInteger(id)) {
      sendError(res, 400, "El ID debe ser un número entero positivo");
      return;
    }

    const visita = await VisitaModel.findById(id);
    if (!visita) {
      sendError(res, 404, "Visita no encontrada");
      return;
    }

    if (visita.visitanteId === null) {
      sendError(res, 400, "La visita no tiene reserva para cancelar");
      return;
    }

    if (visita.completada) {
      sendError(res, 400, "No se puede cancelar una visita completada");
      return;
    }

    const visitaCancelada = await VisitaModel.cancelar(id);
    sendSuccess(res, 200, "Reserva cancelada correctamente", visitaCancelada);
  } catch (error) {
    next(error);
  }
};

export const completar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!isPositiveInteger(id)) {
      sendError(res, 400, "El ID debe ser un número entero positivo");
      return;
    }

    const visita = await VisitaModel.findById(id);
    if (!visita) {
      sendError(res, 404, "Visita no encontrada");
      return;
    }

    if (visita.visitanteId === null) {
      sendError(res, 400, "No se puede completar una visita sin visitante");
      return;
    }

    if (visita.completada) {
      sendError(res, 400, "La visita ya está completada");
      return;
    }

    const visitaCompletada = await VisitaModel.completar(id);
    sendSuccess(res, 200, "Visita marcada como completada", visitaCompletada);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!isPositiveInteger(id)) {
      sendError(res, 400, "El ID debe ser un número entero positivo");
      return;
    }

    const visita = await VisitaModel.findById(id);
    if (!visita) {
      sendError(res, 404, "Visita no encontrada");
      return;
    }

    await VisitaModel.remove(id);
    sendSuccess(res, 200, "Visita eliminada correctamente");
  } catch (error) {
    next(error);
  }
};
