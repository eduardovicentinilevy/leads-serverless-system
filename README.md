# Sistema de Captura de Leads (Serverless & Event-Driven)

Um sistema completo de captura de leads focado em Alta Performance, Integridade de Dados e Experiência do Usuário (UX). 

Este projeto vai além de um simples formulário CRUD. Ele demonstra a aplicação prática de uma Arquitetura Orientada a Eventos (EDA). Quando o usuário realiza o cadastro, a API principal responde imediatamente (assincronismo) enquanto um "Worker" em segundo plano processa as tarefas mais pesadas (como disparo de e-mails), garantindo que a interface do usuário nunca fique bloqueada.

## Principais Funcionalidades e Diferenciais

* Processamento em Background: O backend valida e salva os dados iniciais, liberando o usuário em milissegundos. Uma função assíncrona assume o trabalho pesado logo em seguida, simulando o comportamento de filas (Pub/Sub) e Serverless Functions.
* Banco de Dados Transacional: Construído com SQLite, garantindo que as inserções de usuários e logs de eventos aconteçam dentro de transações (`BEGIN TRANSACTION` e `COMMIT`). Possui chaves estrangeiras e constraints de unicidade (CPF e E-mail únicos).
* UX Dinâmica com React: Interface reativa que consome a API pública do ViaCEP. O usuário digita o CEP e, ao sair do campo, o endereço completo (Rua, Bairro, Cidade, UF) é preenchido e salvo automaticamente.
* Design System Exclusivo: Interface estilizada do zero com uma paleta de cores personalizada (tons amadeirados e detalhes em dourado), tipografia Montserrat e componentes visuais do react-icons.

## Tecnologias Utilizadas

Frontend:
* React + Vite
* React Icons
* Fetch API (Integração ViaCEP e Backend próprio)
* CSS Vanilla (Design responsivo e customizado)

Backend:
* Node.js + Express
* SQLite3 (Relacional)
* Event-Driven Worker (Simulação nativa)
* CORS & Middleware JSON

## Como Rodar o Projeto na Sua Máquina

A aplicação é dividida em duas camadas (Servidor e Interface). Você precisará de dois terminais rodando simultaneamente.

### 1. Preparando o Ambiente
Clone este repositório e instale as dependências tanto da raiz (Backend) quanto da pasta do Frontend:
\`\`\`bash
# Na pasta raiz (Backend)
npm install

# Entre na pasta do frontend e instale as dependências
cd frontend
npm install
\`\`\`

### 2. Iniciando o Servidor (Backend)
Volte para a pasta raiz do projeto e inicie a API. O banco de dados SQLite (`leads.db`) será criado automaticamente na primeira execução com todas as tabelas necessárias.
\`\`\`bash
npm run dev
\`\`\`
*(O servidor ficará rodando na porta 3000)*

### 3. Iniciando a Interface (Frontend)
Abra um segundo terminal (mantendo o primeiro ativo), entre na pasta do frontend e inicie o servidor de desenvolvimento do Vite:
\`\`\`bash
cd frontend
npm run dev
\`\`\`
*(O terminal mostrará um link local, geralmente `http://localhost:5173`. Clique nele para acessar a aplicação no navegador.)*

---
Desenvolvido com foco em código limpo, escalabilidade e design centrado no usuário.