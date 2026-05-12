import express from "express";
import cors from "cors";
import morgan from "morgan";
import visitaRoutes from "./routes/visita.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Microservicio de visitas activo" });
});

app.use("/visitas", visitaRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
