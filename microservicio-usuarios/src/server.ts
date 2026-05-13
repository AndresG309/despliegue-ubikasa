import app from "./app.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, ".env")
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Microservicio de usuarios escuchando en puerto ${PORT}`);
});
