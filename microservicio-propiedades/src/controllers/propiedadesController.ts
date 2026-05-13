import type {
  Request,
  Response,
} from "express";

import * as PropiedadModel from "../models/propiedadesModel.js";

export const getAll = async (
  req: Request,
  res: Response
) => {
  const propiedades =
    await PropiedadModel.getAll();

  res.json(propiedades);
};

export const getById = async (
  req: Request,
  res: Response
) => {
  const propiedad =
    await PropiedadModel.getById(
      Number(req.params.id)
    );

  res.json(propiedad);
};

export const create = async (
  req: Request,
  res: Response
) => {
  const {
    titulo,
    descripcion,
    direccion,
    multimedia,
    arrendador_id,
    precio,
  } = req.body;

  await PropiedadModel.create(
    titulo,
    descripcion,
    direccion,
    multimedia,
    arrendador_id,
    precio
  );

  res.json({
    message:
      "Propiedad creada",
  });
};

export const update = async (
  req: Request,
  res: Response
) => {
  await PropiedadModel.update(
    Number(req.params.id),
    req.body
  );

  res.json({
    message:
      "Propiedad actualizada",
  });
};

export const remove = async (
  req: Request,
  res: Response
) => {
  await PropiedadModel.remove(
    Number(req.params.id)
  );

  res.json({
    message:
      "Propiedad eliminada",
  });
};

export const filtrar = async (
  req: Request,
  res: Response
) => {
  const propiedades =
    await PropiedadModel.filtrar(
      String(req.query.titulo)
    );

  res.json(propiedades);
};
