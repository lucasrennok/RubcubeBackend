import { Request, Response } from 'express';
import {
  getStats,
  getStatsById,
  getGameStatistics,
} from '../services/gameService';
import { getRanking } from '../services/rankingService';

type GameParams = { id: string };

const notFound = (res: Response) =>
  res.status(404).json({ error: 'Jogo não encontrado' });

// História 1: estatísticas detalhadas de mortes do jogo
export const getGameDetailedStats = async (
  req: Request<GameParams>,
  res: Response,
) => {
  const stats = await getGameStatistics(req.params.id);
  if (!stats) return notFound(res);
  res.json(stats);
};

// História 2: ranking de um jogo específico
export const getGameRanking = async (
  req: Request<GameParams>,
  res: Response,
) => {
  const ranking = await getRanking(req.params.id);
  if (!ranking) return notFound(res);
  res.json(ranking);
};

// História 3: estatísticas gerais de todos os jogos
export const getAllGameStats = async (_req: Request, res: Response) => {
  res.json(await getStats());
};

// História 3: estatísticas gerais de um jogo específico
export const getGameStatsById = async (
  req: Request<GameParams>,
  res: Response,
) => {
  const stats = await getStatsById(req.params.id);
  if (!stats) return notFound(res);
  res.json(stats);
};
