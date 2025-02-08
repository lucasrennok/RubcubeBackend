import express from 'express';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configurações do servidor
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', gameRoutes);

// Porta do servidor (padrão: 3000)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server port: ${PORT}`);
});
