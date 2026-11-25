import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import gameRoutes from './routes/gameRoutes';

/** Origens liberadas no CORS: lista separada por vírgula em CORS_ORIGIN, ou * */
const corsOrigin = () => {
  const raw = process.env.CORS_ORIGIN?.trim();
  if (!raw || raw === '*') return '*';
  return raw.split(',').map((o) => o.trim());
};

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: corsOrigin(), methods: ['GET'] }));
  app.use(express.json({ limit: '10kb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', gameRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  });

  return app;
};

export default createApp;
