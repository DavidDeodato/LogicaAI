# arquitetura_studio.md — Arquitetura do Studio

Visão geral
- Monolito Next.js (App Router) na Vercel
- Cliente rico (React) para edição de páginas/blocos
- API Routes para IA e persistência
- Persistência local (MVP) e Postgres/Neon + Prisma (pós‑MVP)

Camadas
- UI/Client: `/studio` (React), Zustand store, react‑rnd (drag/resize), Inspector, Chat
- Server/API: `/api/studio/ai`, `/api/studio/projects`, `/api/studio/pages`, `/api/auth/*` (simples)
- Infra: Vercel (deploy), Neon (Postgres), Resend (e‑mail)

Fluxo primário
1) Usuário cria/mexe em blocos (estado em memória) → autosave localStorage
2) Usuário conversa com IA → `POST /api/studio/ai` com `{message, projectState}`
3) Backend chama Gemini, retorna `{actions}` (JSON) → client valida (zod) e aplica
4) “Enviar para equipe” → `POST /api/send-report` com HTML (resumo) + JSON + chat

Persistência
- MVP: localStorage; Export/Import JSON
- DB: 
  - `users`, `sessions`
  - `projects` (owner_id)
  - `pages` (project_id, data jsonb ← elements)
  - `elements` (opcional; no MVP é embutido em `pages.data`)
  - `actions_log` (jsonb; histórico)
  - `chat_messages` (project_id, role, content, created_at)

Autenticação simples (e‑mail/senha)
- Rota `/signup` e `/login` (form simples)
- Bcrypt para hash de senha
- Session cookie assinado (iron‑session) ou JWT curto + httpOnly cookie
- Guard em `/studio`: se sem session → `?guest=true` com autosave local; se logado → salva em DB

API contracts (pós‑MVP)
- `POST /api/auth/signup {email, password}` → 200 {userId}; erros comuns
- `POST /api/auth/login {email, password}` → 200 {session}; set cookie
- `POST /api/studio/projects {name}` → cria projeto
- `GET /api/studio/projects/:id` → retorna ProjectState
- `PUT /api/studio/projects/:id` → atualiza ProjectState (serverTimestamp)
- `POST /api/studio/ai` → retorna `{actions, summary}`

Decisões
- Layout Influence: Canva/Lovable, porém apenas wireframe (velocidade > fidelidade visual)
- Segurança: validação estrita de actions (zod), sanitização de texto, limites de tamanho (payload < 200KB)
- Rate limit simples (IA): por IP/usuário, 10 req/min
- Observabilidade: logs de actions/erros no server + console client em dev

Diagrama (texto)
- Browser (/studio) ⇄ API `/api/studio/ai` (actions JSON via Gemini)
- Browser → `/api/send-report` (HTML + JSON)
- [pós‑MVP] Browser ⇄ `/api/studio/projects` (persistência Neon via Prisma)

Restrições da IA
- Nunca retorna HTML/JS; somente `actions: Action[]` + `summary`
- Deve ler o estado enviado e evitar duplicidade; propor reutilização quando aplicável
- Em ambiguidades, retornar `ask: string` ao invés de aplicar
