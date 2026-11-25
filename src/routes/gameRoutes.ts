import { Router } from 'express';
import {
  getAllGameStats,
  getGameStatsById,
  getGameRanking,
  getGameDetailedStats,
} from '../controllers/gameController';

// No Express 5, erros em handlers async vão direto para o middleware de erro.
const router = Router();

// História 1: estatísticas de mortes por jogo
router.get('/games/:id/stats', getGameDetailedStats);

// História 2: ranking de um jogo
router.get('/games/:id/ranking', getGameRanking);

// História 3: estatísticas de todos os jogos / de um jogo
router.get('/games', getAllGameStats);
router.get('/games/:id', getGameStatsById);

export default router;
