import { getGameDetailedStats } from '../controllers/gameController';
import { getGameRanking } from '../controllers/gameController';
import { Request, Response } from 'express';

// Mock das funções para não precisar do log real
jest.mock('../services/gameService', () => ({
  getGameStatistics: jest.fn(async (gameId: string) => {
    if (gameId === 'game_1') {
      return { id: 'game_1', totalKills: 0, killsByCause: {}, worldKills: 0 };
    } else if (gameId === 'game_2') {
      return {
        id: 'game_2',
        totalKills: 11,
        killsByCause: {
          MOD_TRIGGER_HURT: 7,
          MOD_ROCKET_SPLASH: 3,
          MOD_FALLING: 1,
        },
        worldKills: 8,
      };
    }
    return null;
  }),
}));

jest.mock('../services/rankingService', () => ({
  getRanking: jest.fn(async (gameId: string) => {
    if (gameId === 'game_1') {
      return [{ name: 'Isgalamido', score: 0 }];
    } else if (gameId === 'game_2') {
      return [
        {
          name: 'Mocinha',
          score: -1,
        },
        {
          name: 'Isgalamido',
          score: -7,
        },
      ];
    }
    return [];
  }),
}));

describe('Game Service Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  // Teste para `getGameDetailedStats` - game_1
  it('should return detailed stats for game_1', async () => {
    req.params = { id: 'game_1' };
    await getGameDetailedStats(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      id: 'game_1',
      totalKills: 0,
      killsByCause: {},
      worldKills: 0,
    });
  });

  // Teste para `getGameDetailedStats` - game_2
  it('should return detailed stats for game_2', async () => {
    req.params = { id: 'game_2' };
    await getGameDetailedStats(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      id: 'game_2',
      totalKills: 11,
      killsByCause: {
        MOD_TRIGGER_HURT: 7,
        MOD_ROCKET_SPLASH: 3,
        MOD_FALLING: 1,
      },
      worldKills: 8,
    });
  });

  // Teste para `getGameRanking` - game_1
  it('should return ranking for game_1', async () => {
    req.params = { id: 'game_1' };
    await getGameRanking(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith([{ name: 'Isgalamido', score: 0 }]);
  });

  // Teste para `getGameRanking` - game_2
  it('should return ranking for game_2', async () => {
    req.params = { id: 'game_2' };
    await getGameRanking(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith([
      {
        name: 'Mocinha',
        score: -1,
      },
      {
        name: 'Isgalamido',
        score: -7,
      },
    ]);
  });
});
