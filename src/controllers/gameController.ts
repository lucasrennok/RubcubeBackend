import { Request, Response } from 'express';
import {
  getStats,
  getStatsById,
  getGameStatistics,
} from '../services/gameService';
import { getRanking } from '../services/rankingService';

// História 1
// Retorna estatísticas detalhadas de mortes do jogo
export const getGameDetailedStats = async (req: Request, res: Response) => {
  const gameId = req.params.id;
  const stats = await getGameStatistics(gameId);

  if (!stats) {
    return res.status(404).json({ error: 'Jogo não encontrado' });
  }

  res.json(stats);
};

// História 2
// Retorna ranking de um jogo específico
export const getGameRanking = async (req: Request, res: Response) => {
  const gameId = req.params.id;
  const ranking = await getRanking(gameId);
  res.json(ranking);
};

// História 3
// Retorna estatísticas gerais de todos os jogos
export const getAllGameStats = async (req: Request, res: Response) => {
  const stats = await getStats();
  res.json(stats);
};

// História 3
// Retorna estatísticas gerais de um jogo específico
export const getGameStatsById = async (req: Request, res: Response) => {
  const gameId = req.params.id;
  const stats = await getStatsById(gameId);
  res.json(stats);
};
