# Super Pica-Pau

## Descrição
O **Super Pica-Pau** é um sistema de triagem que utiliza a regra de negócio "pica-pau" para analisar processos judiciais obtidos via a API "Visão", que por sua vez se comunica com o sistema **SAPIENS** da Advocacia Geral da União (AGU). O foco do pica-pau é identificar impedimentos para a concessão de benefícios previdenciários, como **Salário-Maternidade**, **Aposentadoria Rural** e **LOAS**. Ele também retorna etiquetas específicas para processos "limpos" ou com pendências de documentos.
Se comunica com o **Controle de Usuário** e o **Frontend**.

## Tecnologias Utilizadas
- **Node.js** com **TypeScript**
- **Python** (para uma requisição de login no SAPIENS)
- **Docker** e **Docker Compose** (para containerização)

## Instalação
1. Clone o repositório:

   ```bash
   git clone https://github.com/Pace-pfpa/SuperPicau-api.git
2. Instale as dependências:

    ```bash
   npm install
## Configuração

1. Copie o arquivo .env-example e renomeie para .env:

    ```bash
   cp .env-example .env
2. Preencha as variáveis de ambiente necessárias no arquivo .env.

## Rodando o Projeto
### Com npm:
* Inicie o servidor localmente: 
    ```bash
    npm run serve
### Com Docker Compose
* Suba o ambiente usando Docker Compose:
    ```bash
    docker-compose up -d --build

## Endpoints
As rotas e endpoints estão definidos no arquivo *index.ts* localizado em *src/routes*.

## Contribuição
Atualmente, a contribuição é restrita a membros da equipe pica-pau na organização Nutec-PFPA no GitHub.


Seu Afonso é daora.