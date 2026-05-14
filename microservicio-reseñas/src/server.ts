
import app from './app.js';
import pool from './database/db.js';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __sourcedirName = path.dirname(path.dirname( __filename));

dotenv.config({
  path: path.resolve(__sourcedirName, ".env"),
});

const variablesEntorno = {
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  SERVICE_PORT: process.env.PORT
}
console.log("Variables de entorno cargadas:", variablesEntorno);

const PORT = process.env.PORT || 3003;

async function main() {
  // Verificar conexión a MySQL antes de levantar el servidor
  try {
    const conn = await pool.getConnection();
    console.log('Conexión a MySQL establecida.');
    conn.release();
  } catch (err) {
    console.error(' No se pudo conectar a MySQL:', err);
    process.exit(1);
  }

  
}

//main();

app.listen(PORT, () => {
    console.log(` Microservicio de reseñas corriendo en http://localhost:${PORT}`);
  });