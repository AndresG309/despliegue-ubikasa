import express from "express";
import cors from "cors";

import propiedadesRoutes from "./routes/propiedadesRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/propiedades", propiedadesRoutes);

export default app;