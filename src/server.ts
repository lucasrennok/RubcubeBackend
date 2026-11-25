import dotenv from 'dotenv';
import { createApp } from './app';

dotenv.config({ quiet: true });

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = createApp().listen(PORT, HOST, () => {
  console.log(`API rodando em http://${HOST}:${PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} recebido, encerrando...`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
