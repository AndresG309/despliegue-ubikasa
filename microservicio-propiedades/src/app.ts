import express, { Express, Request, Response } from 'express';
import cors from "cors";

import morgan from 'morgan'; 

import propiedadesRoutes from "./routes/propiedadesRoutes.js";

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());

app.use("/propiedades", propiedadesRoutes);

// Ruta de prueba
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Microservicio de propiedades - OK',
  });
});

export default app;