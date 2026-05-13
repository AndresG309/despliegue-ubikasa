import 'dotenv/config';
import app from './app.js';
import pool from './database/db.js';

const PORT = process.env.PORT ?? 3003;

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

  app.listen(PORT, () => {
    console.log(` Microservicio de reseñas corriendo en http://localhost:${PORT}`);
  });
}

main();
