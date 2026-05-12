import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { testConnection } from "./db/connection.js";

const PORT = Number(process.env.PORT) || 3003;



app.listen(PORT, () => {
  console.log(`Microservicio de visitas corriendo en http://localhost:${PORT}`);
  console.log(`Endpoints disponibles en http://localhost:${PORT}/visitas`);
});
