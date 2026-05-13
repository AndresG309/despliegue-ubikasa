import app from "./app.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, ".env")
});

const variablesEntorno = {
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  SERVICE_PORT: process.env.PORT
}
console.log("Variables de entorno cargadas:", variablesEntorno);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Microservicio de usuarios escuchando en puerto ${PORT}`);
});
