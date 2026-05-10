import express from 'express';
import cors from 'cors';
import resenasRouter from './resenas.router.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', servicio: 'microservicio-resenas' });
});

// Rutas del dominio
app.use('/resenas', resenasRouter);

export default app;
