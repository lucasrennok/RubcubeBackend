import { server } from '../server';

test('Soma 2 + 3 e retorna 5', () => {
  expect(server(2, 3)).toBe(5);
});
