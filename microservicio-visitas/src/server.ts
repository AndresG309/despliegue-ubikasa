import dotenv from "dotenv";
import path from "path";
import app from "./app.js";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __sourcedirName = path.dirname(path.dirname( __filename));

dotenv.config({
  path: path.resolve(__sourcedirName, ".env"),
});



const PORT = Number(process.env.PORT) || 3003;



app.listen(PORT, () => {
  console.log(`Microservicio de visitas corriendo en http://localhost:${PORT}`);
  console.log(`Endpoints disponibles en http://localhost:${PORT}/visitas`);
});
