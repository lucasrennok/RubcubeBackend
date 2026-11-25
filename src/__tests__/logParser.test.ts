import { parseLog } from '../utils/logParser';
import { getRanking } from '../services/rankingService';
import * as parser from '../utils/logParser';

const FIXTURE = [
  '  0:00 InitGame: \\sv_hostname\\Teste\\',
  '  0:01 ClientUserinfoChanged: 2 n\\Alice\\t\\0\\model\\x',
  '  0:01 ClientBegin: 2',
  '  0:02 ClientUserinfoChanged: 3 n\\Bob\\t\\0\\model\\x',
  '  0:02 ClientBegin: 3',
  '  0:03 Kill: 2 3 7: Alice killed Bob by MOD_ROCKET_SPLASH',
  '  0:04 Kill: 1022 2 22: <world> killed Alice by MOD_TRIGGER_HURT',
  '  0:05 Kill: 3 3 7: Bob killed Bob by MOD_ROCKET_SPLASH',
  '  0:06 ClientUserinfoChanged: 3 n\\Roberto\\t\\0\\model\\x',
  '  0:07 Kill: 3 2 10: Roberto killed Alice by MOD_RAILGUN',
  '  0:08 say: Alice: Kill: isso não é uma morte',
  '  1:00 ShutdownGame:',
  '  1:01 InitGame: \\sv_hostname\\Teste\\',
  '  1:02 ClientUserinfoChanged: 4 n\\Carol\\t\\0',
  '  1:02 ClientBegin: 4',
].join('\r\n');

describe('parseLog', () => {
  const games = parseLog(FIXTURE);

  it('separa as partidas a cada InitGame', () => {
    expect(games.map((g) => g.id)).toEqual(['game_1', 'game_2']);
  });

  it('registra jogadores com o último nome usado', () => {
    expect(games[0].players).toEqual([
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Roberto' },
    ]);
  });

  it('lê as mortes e ignora linhas de chat que contêm "Kill:"', () => {
    expect(games[0].kills).toHaveLength(4);
    expect(games[0].kills[1]).toMatchObject({
      killerId: '1022',
      killer: '<world>',
      victim: 'Alice',
      cause: 'MOD_TRIGGER_HURT',
    });
  });

  it('lida com log vazio ou sem InitGame', () => {
    expect(parseLog('')).toEqual([]);
    expect(parseLog('  0:01 Kill: 2 3 7: A killed B by X')).toEqual([]);
  });
});

describe('getRanking', () => {
  beforeEach(() => {
    jest.spyOn(parser, 'parseLogFile').mockResolvedValue(parseLog(FIXTURE));
  });
  afterEach(() => jest.restoreAllMocks());

  it('pontua por ID mesmo quando o jogador troca de nome', async () => {
    // Alice: +1 (matou Bob) -1 (world) -1 (morta por Roberto) = -1
    // Bob/Roberto: -1 (morto por Alice), suicídio não conta, +1 (matou Alice) = 0
    expect(await getRanking('game_1')).toEqual([
      { name: 'Roberto', score: 0 },
      { name: 'Alice', score: -1 },
    ]);
  });

  it('inclui jogadores sem mortes com pontuação zero', async () => {
    expect(await getRanking('game_2')).toEqual([{ name: 'Carol', score: 0 }]);
  });

  it('retorna null para jogo inexistente', async () => {
    expect(await getRanking('game_99')).toBeNull();
  });
});
