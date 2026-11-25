import request from 'supertest';
import { createApp } from '../app';
import { clearLogCache } from '../utils/logParser';

// Testes de integração usando o logs/games.log real do repositório
const app = createApp();

beforeEach(() => clearLogCache());

describe('GET /api/games', () => {
  it('lista as 21 partidas do log', async () => {
    const res = await request(app).get('/api/games').expect(200);
    expect(res.body).toHaveLength(21);
    expect(res.body[0]).toEqual({
      id: 'game_1',
      players: [{ id: '2', name: 'Isgalamido' }],
      kills: [],
    });
    // campos internos não vazam na API
    expect(res.body[1].kills[0]).toEqual({
      killer: '<world>',
      victim: 'Isgalamido',
      cause: 'MOD_TRIGGER_HURT',
    });
  });

  it('retorna uma partida pelo id', async () => {
    const res = await request(app).get('/api/games/game_3').expect(200);
    expect(res.body.id).toBe('game_3');
  });

  it('retorna 404 para partida inexistente', async () => {
    await request(app).get('/api/games/game_999').expect(404);
  });
});

describe('GET /api/games/:id/stats (história 1)', () => {
  it('resume as mortes da partida', async () => {
    const res = await request(app).get('/api/games/game_2/stats').expect(200);
    expect(res.body).toEqual({
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

  it('retorna 404 para partida inexistente', async () => {
    const res = await request(app).get('/api/games/nada/stats').expect(404);
    expect(res.body).toEqual({ error: 'Jogo não encontrado' });
  });
});

describe('GET /api/games/:id/ranking (história 2)', () => {
  it('ordena os jogadores pela pontuação', async () => {
    const res = await request(app).get('/api/games/game_2/ranking').expect(200);
    expect(res.body).toEqual([
      { name: 'Mocinha', score: -1 },
      { name: 'Isgalamido', score: -7 },
    ]);
  });

  it('retorna 404 para partida inexistente', async () => {
    await request(app).get('/api/games/game_0/ranking').expect(404);
  });
});

describe('infraestrutura', () => {
  it('responde ao health check', async () => {
    await request(app).get('/health').expect(200, { status: 'ok' });
  });

  it('retorna 404 em JSON para rotas desconhecidas', async () => {
    const res = await request(app).get('/nao-existe').expect(404);
    expect(res.body.error).toBeDefined();
  });

  it('envia cabeçalhos de segurança e não expõe o Express', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('retorna 500 quando o log não pode ser lido', async () => {
    const original = process.env.LOG_PATH;
    process.env.LOG_PATH = '/caminho/que/nao/existe.log';
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const res = await request(app).get('/api/games').expect(500);
    expect(res.body).toEqual({ error: 'Erro interno' });
    spy.mockRestore();
    if (original === undefined) delete process.env.LOG_PATH;
    else process.env.LOG_PATH = original;
  });
});
