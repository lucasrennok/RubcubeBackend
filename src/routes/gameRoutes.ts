import express from 'express';
import {
  getAllGameStats,
  getGameStatsById,
  getGameRanking,
  getGameDetailedStats,
} from '../controllers/gameController';

const router = express.Router();

// Endpoint para obter as estatísticas de mortes por jogo
// História 1
router.get('/games/:id/stats', async (req, res) => {
  await getGameDetailedStats(req, res);
});

// Endpoint para obter o ranking de um jogo específico
// História 2
router.get('/games/:id/ranking', getGameRanking);

// Endpoint para obter todas as estatísticas de todos os jogos
// História 3
router.get('/games', getAllGameStats);

// Endpoint para obter estatísticas de um jogo específico
// História 3
router.get('/games/:id', getGameStatsById);

export default router;
