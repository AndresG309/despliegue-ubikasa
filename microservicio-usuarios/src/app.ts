import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuarioRoutes.js';

const app: Express = express();

// Deshabilitador el header X-Powered-By
app.disable('x-powered-by');

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/usuarios', usuarioRoutes);

// Ruta de prueba
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Microservicio de usuarios - OK',
  });
});

export default app;
