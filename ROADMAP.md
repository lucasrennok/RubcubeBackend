# Rubcube Backend API

Aqui serão tratados os seguintes pontos:

- as histórias que você atendeu e a descrição de como;
- o que você adicionaria se tivesse mais tempo;
- o que você faria diferente se tivesse mais tempo.

---

## **História 1**

O entendimento da primeira história foi que fossem retornados na rota de API todas as informações relacionadas a mortes na partida, em uma partida específica. Por isso, seria necessário um id para o game e o retorno das mortes detalhadas para aquela partida em específico.

Exemplo:

```json
{
  "id": "game_1",
  "totalKills": 0,
  "killsByCause": {},
  "worldKills": 0
}
```

## **História 2**

Para a história 2 era necessário retornar o ranking dos jogadores e seus pontos, então foi organizado em um vetor de retorno para o jogo onde mostra o nome de cada um e seus scores.

Exemplo:

```json
[
  {
    "name": "Mocinha",
    "score": -1
  },
  {
    "name": "Isgalamido",
    "score": -7
  }
]
```

## **História 3**

Para a história 3 precisava retornar informações gerais da partida, mortes, jogadores e etc. Então foram colocadas todas elas em um vetor de informações. Além disso, 2 rotas foram criadas, uma pega as informações gerais de todos os jogos e outra é usado o id do jogo para puxar apenas do jogo especificado.

Exemplo:

```json
{
  "id": "game_2",
  "kills": [
    {
      "killer": "<world>",
      "victim": "Isgalamido",
      "cause": "MOD_TRIGGER_HURT"
    },
    {
      "killer": "<world>",
      "victim": "Isgalamido",
      "cause": "MOD_TRIGGER_HURT"
    },
    {
      "killer": "<world>",
      "victim": "Isgalamido",
      "cause": "MOD_TRIGGER_HURT"
    },
    {
      "killer": "Isgalamido",
      "victim": "Mocinha",
      "cause": "MOD_ROCKET_SPLASH"
    },
    {
      "killer": "Isgalamido",
      "victim": "Isgalamido",
      "cause": "MOD_ROCKET_SPLASH"
    },
    {
      "killer": "Isgalamido",
      "victim": "Isgalamido",
      "cause": "MOD_ROCKET_SPLASH"
    },
    {
      "killer": "<world>",
      "victim": "Isgalamido",
      "cause": "MOD_TRIGGER_HURT"
    },
    {
      "killer": "<world>",
      "victim": "Isgalamido",
      "cause": "MOD_TRIGGER_HURT"
    },
    {
      "killer": "<world>",
      "victim": "Isgalamido",
      "cause": "MOD_TRIGGER_HURT"
    },
    {
      "killer": "<world>",
      "victim": "Isgalamido",
      "cause": "MOD_FALLING"
    },
    {
      "killer": "<world>",
      "victim": "Isgalamido",
      "cause": "MOD_TRIGGER_HURT"
    }
  ],
  "players": [
    {
      "id": "2",
      "name": "Isgalamido"
    },
    {
      "id": "3",
      "name": "Mocinha"
    }
  ]
}
```

## **Adições**

Algumas adições que faria com mais tempo:

- Melhorar a documentação
- Aumentar a quantidade de testes para ter um coverage melhor
- Adição do docker para criação de conteiners
- Separação de ambientes de prod e dev adaptando melhor .env e ci (usando uma branch de dev)
- Adição de banco de dados para não precisar usar o .log a todo momento
- Adicionar um token para segurança de cada rota

## **Mudanças**

O que eu faria diferente se tivesse mais tempo:

- Mais rotas para a história 3, fiquei um pouco confuso com o entendimento e acredito que deveria puxar o ranking geral de todas as partidas também
