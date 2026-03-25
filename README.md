# Planix API

API REST para gerenciamento de tarefas construida com NestJS, Prisma, PostgreSQL e AWS S3.

REST API for task management built with NestJS, Prisma, PostgreSQL and AWS S3.

---

## Producao / Production

A aplicacao esta rodando em uma instancia EC2 com NGINX como reverse proxy e HTTPS habilitado via Let's Encrypt.

The application is running on an EC2 instance with NGINX as a reverse proxy and HTTPS enabled via Let's Encrypt.

**Base URL:** https://planix-api.purpleco.online

---

## Tecnologias / Tech Stack

- Node.js 24
- NestJS 11
- Prisma 7 (PostgreSQL)
- Passport (JWT + Google OAuth)
- AWS S3 (upload de imagens)
- Docker + Docker Compose

---

## Rotas da API / API Routes

### Auth

| Metodo | Rota | Descricao / Description | Auth |
|--------|------|------------------------|------|
| POST | /auth/register | Registrar usuario / Register user | Nao / No |
| POST | /auth/login | Login com email e senha / Login with email and password | Nao / No |
| POST | /auth/refresh | Renovar tokens / Refresh tokens | Nao / No |
| POST | /auth/logout | Logout (invalida refresh token) / Logout (invalidates refresh token) | Sim / Yes |
| GET | /auth/google | Iniciar login com Google / Start Google login | Nao / No |
| GET | /auth/google/callback | Callback do Google OAuth / Google OAuth callback | Nao / No |

### Tasks

| Metodo | Rota | Descricao / Description | Auth |
|--------|------|------------------------|------|
| POST | /tasks | Criar tarefa / Create task | Sim / Yes |
| GET | /tasks | Listar tarefas / List tasks | Sim / Yes |
| PATCH | /tasks/:id | Atualizar tarefa / Update task | Sim / Yes |
| PATCH | /tasks/:id/archive | Arquivar tarefa / Archive task | Sim / Yes |
| DELETE | /tasks/:id | Remover tarefa (soft delete) / Remove task (soft delete) | Sim / Yes |

### User

| Metodo | Rota | Descricao / Description | Auth |
|--------|------|------------------------|------|
| GET | /user/me | Dados do usuario autenticado / Authenticated user data | Sim / Yes |

### Profile

| Metodo | Rota | Descricao / Description | Auth |
|--------|------|------------------------|------|
| POST | /profile/profile-image | Upload de foto de perfil / Upload profile image | Sim / Yes |

---

## Variaveis de ambiente / Environment Variables

Copie o arquivo `.env.example` para `.env` e preencha os valores.

Copy `.env.example` to `.env` and fill in the values.

```
DATABASE_URL="postgresql://user:password@localhost:5432/planix"
ACCESS_SECRET="your_access_secret"
REFRESH_SECRET="your_refresh_secret"
GOOGLE_AUTH_CLIENT_ID="your_google_client_id"
GOOGLE_AUTH_SECRET_KEY="your_google_secret_key"
HOST_URL="http://localhost:3000"
AWS_ACCESS_KEY_ID="your_aws_access_key_id"
AWS_SECRET_ACCESS_KEY="your_aws_secret_access_key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your_s3_bucket_name"
```

---

## Rodando com Docker / Running with Docker

### Pre-requisitos / Prerequisites

- Docker
- Docker Compose

### Subir o projeto / Start the project

```bash
docker compose up --build
```

Isso vai:
1. Criar um container PostgreSQL na porta 5432
2. Buildar a API
3. Rodar as migrations do Prisma automaticamente
4. Iniciar a API na porta 3000

This will:
1. Create a PostgreSQL container on port 5432
2. Build the API
3. Run Prisma migrations automatically
4. Start the API on port 3000

### Parar o projeto / Stop the project

```bash
docker compose down
```

### Resetar o banco de dados / Reset the database

```bash
docker compose down -v
docker compose up --build
```

O flag `-v` remove o volume do PostgreSQL, apagando todos os dados.

The `-v` flag removes the PostgreSQL volume, deleting all data.

---

## Rodando localmente (sem Docker) / Running locally (without Docker)

```bash
npm install
npx prisma migrate dev
npm run start:dev
```

---

## Testes / Tests

```bash
# testes unitarios / unit tests
npm test

# testes e2e
npm run test:e2e
```

---

## Estrutura do projeto / Project Structure

```
src/
  common/          -- Guards e utilitarios compartilhados / Shared guards and utilities
  infra/
    prisma/        -- Prisma client e service / Prisma client and service
    s3/            -- Servico de upload S3 / S3 upload service
  modules/
    auth/          -- Registro, login, JWT, Google OAuth
    profile/       -- Upload de foto de perfil / Profile image upload
    task/          -- CRUD de tarefas com historico / Task CRUD with history
    user/          -- Dados do usuario / User data
```
