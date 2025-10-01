# Memory Bank — Studio (Mockup + IA)

Objetivo: centralizar a documentação para implementar rapidamente o Studio — um workspace tipo Canva/Lovable‑lite onde o usuário monta páginas com blocos (drag/resize), conversa com a IA que entende o estado do projeto e executa ações, e ao final envia tudo para a equipe.

Arquivos
- implementation_studio.md: plano de implementação, UI/UX, libs e milestones
- arquitetura_studio.md: visão de arquitetura (Next.js monolito, fluxos, APIs)
- banco_studio.md: modelagem de dados (Neon/Postgres + Prisma)
- agent_studio.md: design do StudioAgent (prompt, actions JSON, validações)

Stack alvo
- Next.js 14 (App Router) + React
- Zustand (estado do Studio no client)
- react-rnd (drag/resize) e snapping
- Zod (validação de actions)
- Prisma ORM + Neon Postgres
- Resend (envio do projeto + chat para equipe)
- Vercel (deploy)

Notas
- MVP em 2 horas focando em: /studio, drag/resize, autosave localStorage, IA que emite actions JSON, envio para equipe.
- Persistência em DB vem em seguida (mesmo schema aqui).
