import type { Request, Response } from "express";

import * as PropiedadModel from "../models/propiedadesModel.js";

export async function getAll(
  req: Request,
  res: Response
) {
  const propiedades =
    await PropiedadModel.getAll();

  res.json(propiedades);
}

export async function getById(
  req: Request,
  res: Response
) {
  const { id } = req.params;

  const propiedad =
    await PropiedadModel.getById(Number(id));

  res.json(propiedad);
}

export async function create(
  req: Request,
  res: Response
) {
  const {
    titulo,
    descripcion,
    precio,
    direccion,
  } = req.body;

  await PropiedadModel.create(
    titulo,
    descripcion,
    precio,
    direccion
  );

  res.json({
    message: "Propiedad creada",
  });
}

export async function update(
  req: Request,
  res: Response
) {
  const { id } = req.params;

  await PropiedadModel.update(
    Number(id),
    req.body
  );

  res.json({
    message: "Propiedad actualizada",
  });
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params;

  await PropiedadModel.remove(Number(id));

  res.json({
    message: "Propiedad eliminada",
  });
}
