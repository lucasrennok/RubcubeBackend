# Rubcube Backend API

Este repositório apresenta uma solução do exercício propost do Quake log parser. O exercício era para o desenvolvimento do backend.

Foi utilizado NodeJS, express, jest, eslint, prettier, husky, lint staged, commitlint (para conventional commits) e estrutura de Service Layer Pattern para a API.

---

## **Executar**

### **Pré-requisitos**

Antes de rodar o projeto, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 20)
- [npm](https://www.npmjs.com/)

### **Como executar o código**

Primeiro é preciso clonar o repositório:

```sh
git clone https://github.com/lucasrennok/RubcubeBackend.git
```

Na pasta do repositório execute o comando `npm install` para instalar as dependências necessárias.

Depois é preciso executar o `npm run dev` para testar a API localmente.

### **Endpoints**

- BaseURL: localhost:3000

## **Endpoints**

| Método  | Rota                     | Descrição                                          |
| ------- | ------------------------ | -------------------------------------------------- |
| **GET** | `/api/games`             | Retorna estatísticas gerais de todos os jogos.     |
| **GET** | `/api/games/:id`         | Retorna estatísticas gerais de um jogo específico. |
| **GET** | `/api/games/:id/stats`   | Retorna mortes detalhadas de um jogo específico.   |
| **GET** | `/api/games/:id/ranking` | Retorna o ranking de um jogo específico.           |

### **Testar**

É possível testar os retornos importando a collection criada do Postman, o arquivo está no repositório e se chama: `Rubcube Backend API.postman_collection.json`

## Dificuldades

- Entendimento do arquivo de log
- Necessidade de banco de dados ou não
- Configuração inicial do ambiente foi demorada
- Entendimento do que deveria ser retornado na História 3
- Tempo
- Frustrante na execução dos testes por familiaridade

## Sobre o processo

Foi interessante, acabei colocando em prática algumas tecnologias e organização inicial de código que eu havia esquecido e acabei relembrando. Foi complicado o entendimento do log e como eu iria filtrar as informações, pensei em colocar em um banco de dados mas eu não teria tempo para isso então preferi deixar só o log mesmo por enquanto.

Aprendi mais sobre criação de testes e isso foi uma parte um pouco demorada, eu desejava ter feito um coverage de 100% do código mas não daria tempo, então deixei apenas das funções que consegui realizar no tempo.

Tentei organizar da melhor forma o código e parte dele em pastas para esse projeto. Acredito que tenha sido o melhor para o backend.
Eu gostaria de ter mais tempo também para documentar melhor as rotas e o readme.
