# banco_studio.md — Modelagem de dados (Neon + Prisma)

Objetivo
- Persistir projetos do Studio com o mínimo de complexidade, mantendo flexibilidade via JSONB.

Stack
- Postgres (Neon)
- Prisma ORM

Prisma schema (base)
```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hash
  projects  Project[]
  sessions  Session[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model Project {
  id        String   @id @default(cuid())
  ownerId   String
  owner     User     @relation(fields: [ownerId], references: [id])
  name      String
  data      Json     // ProjectState serializado (com pages/elements)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  pages     Page[]
}

model Page {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  name      String
  data      Json     // elementos desta página (opcional; redundante com Project.data)
  index     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ActionLog {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  actor     String   // 'user' | 'ai'
  action    Json
  createdAt DateTime @default(now())
}

model ChatMessage {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  role      String   // 'user' | 'assistant' | 'system'
  content   String
  createdAt DateTime @default(now())
}
```

Observações
- `Project.data` guarda o `ProjectState` completo (pages + elements). `Page.data` é opcional e pode ser removido se duplicação não for desejada.
- Se volume crescer, separar `elements` em tabela própria; para MVP, JSONB é mais ágil.

Índices sugeridos
- `@@index([ownerId])` em `Project`
- `@@index([projectId, index])` em `Page`
- `@@index([projectId, createdAt])` em `ActionLog`, `ChatMessage`

Rotas API (pós‑MVP)
- `POST /api/auth/signup` → cria `User` (hash com bcrypt)
- `POST /api/auth/login` → cria `Session` (JWT/iron-session) e cookie httpOnly
- `POST /api/studio/projects` → cria `Project` com `data` inicial
- `GET /api/studio/projects/:id` → retorna `Project`
- `PUT /api/studio/projects/:id` → atualiza `Project.data`
- `POST /api/studio/projects/:id/pages` → opcional (quando usar `Page` explicitamente)

Migração
- `npx prisma init` → configurar `DATABASE_URL`
- `npx prisma migrate dev -n init_studio`
- `npx prisma generate`

Segurança e limites
- Sanitizar textos do usuário (no client antes de enviar para IA)
- Limitar tamanho de `data` (< 1MB) por projeto
- Auditar ações da IA (ActionLog)
