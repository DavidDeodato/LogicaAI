# implementation_studio.md — Implementação do Studio (Plano prático)

Escopo do MVP (<= 2 horas)
- Rota `/studio` com layout 3 colunas (Chat IA • Canvas • Propriedades)
- Canvas com blocos básicos: `text`, `button`, `input`, `box`, `image`
- Drag/resize via `react-rnd` com snapping (8px)
- Estado client com Zustand + autosave localStorage (debounce 500ms)
- Chat IA (“StudioAgent”) chamando `/api/studio/ai`, retornando **actions JSON** validadas por `zod`
- Aplicador de actions → atualiza estado e re‑renderiza
- Export/Import JSON (arquivo `.studio.json`)
- Envio para equipe: POST para `/api/send-report` anexando `projectState` + transcrição do chat

Layout (Next.js /studio)
- Coluna esquerda (w: 340px): Chat IA + botões rápidos
- Coluna central: Canvas (viewport com grid leve, fundo #111, linhas discretas)
- Coluna direita (w: 320px): Propriedades do projeto/página/elemento

Componentes React
- `StudioPage` (route): carrega/instancia store (zustand), provê layout
- `ChatPanel` (client): input, histórico, botão “Sugerir”, chama `/api/studio/ai`
- `Canvas` (client): renderiza elementos da página selecionada com `react-rnd`
- `Toolbar` (client): botões “Adicionar Texto/Botão/Input/Caixa/Imagem”, “Nova página”, “Export/Import”
- `Inspector` (client): edita props (nome da página, texto do elemento, link, x/y/w/h)
- `MiniNavigator` (opcional): tabs de páginas

Zustand store (client)
- `projectState: { pages: Page[], currentPageId: string, createdAt, updatedAt }`
- actions locais: `addPage`, `renamePage`, `selectPage`, `addElement`, `updateElement`, `moveElement`, `resizeElement`, `deleteElement`, `linkPages`
- `hydrateFromLocalStorage()` e `persistToLocalStorage()` (debounce 500ms)

Types (base)
```ts
export type Rect = { x: number; y: number; w: number; h: number }
export type ElementType = 'text' | 'button' | 'input' | 'box' | 'image'
export type Element = {
  id: string
  type: ElementType
  rect: Rect
  text?: string
  props?: Record<string, unknown>
  linkToPageId?: string
}
export type Page = { id: string; name: string; elements: Element[] }
export type ProjectState = { pages: Page[]; currentPageId: string; createdAt: string; updatedAt: string }
```

Actions JSON (zod schema)
- Tipos: `add_page`, `select_page`, `rename_page`, `delete_page`, `add_block`, `update_block_text`, `move_block`, `resize_block`, `delete_block`, `link_pages`
- Cada payload possui shape explícito; validação antes de aplicar

Autosave e recuperação
- Chave localStorage: `studio:project`
- Botões: “Exportar (.studio.json)” e “Importar” (merge ou replace)

IA — contrato de API (MVP)
- `POST /api/studio/ai` body: `{ message: string, projectState: ProjectState }`
- Resposta: `{ actions: Action[], summary: string }` (ou `{ actions: [], ask: string }` quando precisa confirmar)

Envio para equipe
- Reusar `/api/send-report` adicionando no HTML: resumo + JSON (formatado) + transcrição do chat

Pacotes a instalar
- `zustand`, `react-rnd`, `zod`, `nanoid`
- (se usar Prisma imediatamente: `prisma`, `@prisma/client`)

Milestones (checklist)
- [ ] `/studio` route + layout
- [ ] Zustand store + autosave
- [ ] Canvas com drag/resize e snapping
- [ ] Toolbar + Inspector
- [ ] API `/api/studio/ai` + zod validations + aplicador de actions
- [ ] Export/Import + enviar para equipe

Pós‑MVP (rápido)
- Persistência em DB (Neon) + Prisma (ver banco_studio.md)
- Autenticação simples (e‑mail/senha) → session cookie (ver arquitetura)
- Fluxo entre páginas (reactflow)
- Logs de actions (undo/redo)

---

# TASKS — Sequência, prioridades, dependências e testes

Referências base que devem ser consultadas durante a execução:
- Arquitetura: `@studio_mds/arquitetura_studio.md`
- Banco/Prisma: `@studio_mds/banco_studio.md`
- Agente/IA: `@studio_mds/agent_studio.md`
- Frontend/UX: `@studio_mds/frontend_studio.md`

Legenda de prioridade: P0 (crítico), P1 (alto), P2 (médio)

## Task 1 — Criar rota /studio com layout base (P0)
- Dependências: nenhuma
- Motivo: É a casca onde tudo será acoplado (Canvas, Chat, Inspector). Sem isso não há ponto de integração.
- Passos
  1. Criar page client `/app/studio/page.tsx` com layout 3 colunas (Chat | Canvas | Inspector) conforme `frontend_studio.md`.
  2. Adicionar `StudioHeader` (nome do projeto, botões Import/Export/Enviar para equipe).
  3. Rodar e validar render sem lógica ainda.
- Teste/Validação
  - Acessar `/studio` e ver o layout renderizado com os 3 painéis e header. Sem erros no console.

## Task 2 — Tipos e store (Zustand) + autosave localStorage (P0)
- Dependências: Task 1
- Motivo: Estado canônico (`ProjectState`) dirige render e integração com IA; autosave garante persistência imediata (MVP).
- Passos
  1. Criar tipos `Rect`, `Element`, `Page`, `ProjectState` conforme seção “Types (base)” deste arquivo.
  2. Implementar store Zustand com ações locais (`addPage`, `renamePage`, `selectPage`, `addElement`, `updateElement`, `moveElement`, `resizeElement`, `deleteElement`, `linkPages`).
  3. Implementar `hydrateFromLocalStorage` (ler chave `studio:project`) e `persistToLocalStorage` (debounce 500ms).
  4. Integrar no `StudioPage` (Task 1) carregando/hidratando antes de render.
- Teste/Validação
  - Criar uma página e um elemento via ações locais (temporário, botão de debug) e recarregar a página; dados devem persistir.

## Task 3 — Canvas com drag/resize (react-rnd) e snapping (P0)
- Dependências: Task 2
- Motivo: Interação visual é o core da UX (ver `frontend_studio.md`).
- Passos
  1. Instalar `react-rnd` e implementar `Canvas` que recebe a `currentPage` do store e renderiza `elements`.
  2. Implementar snap 8px em `onDragStop`/`onResizeStop` (util `snap(n, 8)`).
  3. Seleção de elemento (borda highlight no selecionado) e atualização via store.
- Teste/Validação
  - Adicionar elementos, arrastar, redimensionar, ver snapping e seleção.

## Task 4 — Toolbar (+Texto/+Botão/+Input/+Caixa/+Imagem) e Inspector (P0)
- Dependências: Task 3
- Motivo: Ferramentas para editar sem IA; Inspector garante controle fino.
- Passos
  1. Toolbar com handlers que chamam `addElement(type)` usando presets de `rect` e `text`.
  2. Inspector lê elemento selecionado e permite editar `text`, `linkToPageId`, `x/y/w/h` (inputs numéricos com snap).
  3. Inspector em contexto de página: renomear página, definir como `entry` (campo em `ProjectState`).
- Teste/Validação
  - Conseguir criar/editar elementos e renomear página. Reload mantém tudo (autosave).

## Task 5 — Export/Import JSON (P1)
- Dependências: Task 4
- Motivo: Portabilidade e backup; também serve de teste rápido do estado canônico.
- Passos
  1. Implementar botão Export (download `.studio.json`).
  2. Implementar Import (input file). Opção: replace total ou merge simples por página.
- Teste/Validação
  - Exportar, apagar localStorage, importar e recuperar o projeto idêntico.

## Task 6 — Schema Zod de actions + aplicador (P0)
- Dependências: Task 2
- Motivo: Segurança/robustez ao aplicar instruções da IA (ver `agent_studio.md`).
- Passos
  1. Definir schema Zod para cada action (`add_page`, `add_block`, `move_block`, …) e um `ActionUnion`.
  2. Criar `applyActions(actions: Action[])` que valida cada payload e chama as ações da store; se inválida, rejeita com mensagem.
  3. Logar summaries de aplicação (para toast e para o chat).
- Teste/Validação
  - Chamar `applyActions` manualmente com um conjunto de ações e verificar estado/Canvas.

## Task 7 — API /api/studio/ai (Gemini) (P0)
- Dependências: Task 6
- Motivo: IA lateral operacional. Usar modelo validado `models/gemini-2.5-flash-lite-preview-09-2025`.
- Passos
  1. Implementar route handler `POST /api/studio/ai` que recebe `{message, projectState}`.
  2. Compor prompt de sistema conforme `agent_studio.md` (proibir HTML, exigir `actions` JSON). 
  3. Chamar Gemini com a chave `GOOGLE_GENERATIVE_AI_API_KEY` (env já configurado) e retornar `{actions, summary}`.
  4. Hard‑limit: truncar `projectState` (ex.: 150KB) e histórico do chat (10 mensagens) antes do envio.
- Teste/Validação
  - Enviar mensagem simples do client e ver retorno com `actions`. Aplicar e renderizar.

## Task 8 — ChatPanel e integração IA → applyActions (P0)
- Dependências: Tasks 6 e 7
- Motivo: Fechar o loop humano‑IA.
- Passos
  1. Implementar `ChatPanel`: histórico (user/assistant), input, botão enviar, loading.
  2. Ao enviar: `POST /api/studio/ai` com o `projectState` atual → `applyActions` → exibir `summary` e toasts.
  3. Tratar `{ask}` (pergunta) com UI de confirmação.
- Teste/Validação
  - Fluxo: “crie página login” → ver ações, Canvas atualizado, resumo no chat.

## Task 9 — Enviar para equipe (email com Resend) (P1)
- Dependências: Task 8
- Motivo: Fechamento comercial do fluxo (lead qualificado com mockup + chat).
- Passos
  1. Reutilizar `/api/send-report` incluindo `projectState` (JSON formatado) e transcrição do chat.
  2. Template HTML simples listando páginas e quantidade de elementos.
- Teste/Validação
  - Enviar e checar recebimento (usar email permitido pela conta Resend).

## Task 10 — Autenticação simples (email/senha) + sessões (P1)
- Dependências: nenhuma direta do frontend; integrar depois com Task 11.
- Motivo: Permitir salvar projetos no DB por usuário sem fricção (ver `arquitetura_studio.md`).
- Passos
  1. Adicionar Prisma ao projeto (`npx prisma init`), garantir `DATABASE_URL` (já presente no `.env`).
  2. Criar models `User` e `Session` conforme `banco_studio.md` e rodar `prisma migrate dev`.
  3. Implementar routes: `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout` (bcrypt + cookie httpOnly via iron‑session ou JWT + cookie).
  4. Guard opcional em `/studio`: se não logado, operar como convidado (localStorage); se logado, habilitar salvar em DB.
- Teste/Validação
  - Criar user, logar, ver cookie; logout limpa sessão.

## Task 11 — Persistência em DB (Neon) do ProjectState (P1)
- Dependências: Task 10
- Motivo: Salvar/abrir projetos multi‑dispositivo, compartilhar com a equipe.
- Passos
  1. Models `Project` e (opcional) `Page`/`ActionLog` conforme `banco_studio.md`. Migrar.
  2. Endpoints: `POST /api/studio/projects` (criar), `GET/PUT /api/studio/projects/:id` (carregar/salvar `data`).
  3. No client, se logado, ao fazer autosave também `PUT` (debounce 2–3s) com `updatedAt`.
  4. Botão “Meus projetos” (lista simples) para abrir.
- Teste/Validação
  - Criar projeto, editar, recarregar e ver dados vindos do DB. Conflitos: validar por timestamp simples.

## Task 12 — Saneamento/segurança e rate‑limit IA (P1)
- Dependências: Task 7 já criada
- Motivo: Evitar payloads grandes, prompt injection básica e abuso de API.
- Passos
  1. Truncar `text` de elementos (ex.: 1k chars) e payload do `projectState` para IA.
  2. Rate limit 10 req/min por IP/usuário em `/api/studio/ai`.
  3. Validar `actions` com zod; rejeitar com erro legível quando inválida.
- Teste/Validação
  - Simular flood e ver bloqueio temporário; enviar action inválida e ver erro de validação.

## Task 13 — Polimento visual (P2)
- Dependências: Tasks 3–4
- Motivo: UX “gostosa”: micro animações, estados de foco, alinhamento visual.
- Passos
  1. Ajustar estilos conforme `frontend_studio.md` (bordas, sombras, animações, toasts). 
  2. Atalhos de teclado básicos (mover com setas, delete, salvar).
  3. Melhorar Inspector (inputs com step + snap; selects com lista de páginas).
- Teste/Validação
  - Avaliação visual/manual e teste de teclado.

## Task 14 — (Opcional) Mapa de fluxo das páginas (P2)
- Dependências: Task 11 (para IDs estáveis) ou pode usar store local.
- Motivo: Visualizar navegação entre telas (credibilidade e clareza).
- Passos
  1. Adicionar mini‑mapa com `reactflow` baseado em `pages` e `linkToPageId` dos elementos.
  2. Clique em um nó seleciona a página no Canvas.
- Teste/Validação
  - Criar links e ver edges no mapa.

## Task 15 — Preparação de deploy e env (P1)
- Dependências: Tasks 7, 9, 10, 11
- Motivo: Garantir que tudo roda na Vercel com Neon/Resend e Gemini.
- Passos
  1. Confirmar envs na Vercel: `GOOGLE_GENERATIVE_AI_API_KEY`, `RESEND_API_KEY`, `DATABASE_URL` (Neon).
  2. Rodar `prisma generate` no build (se necessário) e validar `next build`.
  3. Smoke test em preview: `/studio`, IA, envio para equipe, login, salvar/carregar projeto.
- Teste/Validação
  - Build sem erros e smoke tests passam.

---

Observação final sobre ordem e dependências
- A sequência prioriza o essencial de UX (Tasks 1–4), segurança de estado (Task 2), o laço IA→actions (Tasks 6–8) e o fechamento comercial (Task 9). Persistência e auth (Tasks 10–11) vêm logo após para habilitar colaboração real e continuidade. Polimento e fluxo visual fecham a experiência (Tasks 13–14). Deploy é checklist final (Task 15).
