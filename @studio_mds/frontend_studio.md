# frontend_studio.md — Guia de Frontend + Integração do Studio

Objetivo
- Garantir que o Studio seja “gostoso de usar” (fluido, bonito, consistente) e fácil de evoluir. Este guia define padrões visuais, UX, componentes, interações e os pontos de integração com store/IA/DB.

Princípios
- Clareza > Complexidade: wireframe limpo, poucas distrações, labels diretas
- Feedback imediato: cada ação (drag, resize, add) gera feedback visual/toast
- Operável por mouse e teclado (acessibilidade básica + atalhos)
- Estilo consistente com a brand atual (dark, amarelo primário)

Fundação de UI
- Tech: React (Next.js App Router), Tailwind, shadcn/ui (botões, inputs, dialog, tabs), lucide-react (ícones)
- Tokens (Tailwind/cores):
  - bg: `bg-background` (dark existente)
  - surface: `bg-card` / `border-border`
  - realce primário: `text-primary` / `bg-primary`
  - grid do canvas: linhas sutis `bg-[linear-gradient(...)]` (opcional)
- Tipografia: seguir `Geist` como no app

Layout /studio (3 colunas)
- Esquerda (w-80): Chat + ações rápidas (shadcn Tabs: Chat | Actions)
- Centro (flex-1): Canvas (viewport com scroll, grid e snapping)
- Direita (w-80): Inspector (propriedades de Página/Elemento)
- Header fino com: Nome do projeto, Import/Export, Enviar para equipe

Componentes principais
- `StudioHeader`: nome do projeto (editável), ações globais (import/export/enviar)
- `ChatPanel`: histórico, input, botões “Criar Página”, “Adicionar Botão”, “Arrumar Layout”
- `Canvas`: viewport do wireframe, renderiza elementos com `react-rnd`
- `ElementFrame`: wrapper do bloco (bordas, handles, overlay de seleção)
- `Inspector`: propriedades contextuais (página/elemento)
- `Toolbar`: “+ Texto”, “+ Botão”, “+ Input”, “+ Caixa”, “+ Imagem”, “Nova Página”
- `PageTabs`/`MiniNavigator`: navegar entre páginas

Elementos suportados (MVP)
- `text`: `contentEditable` controlado (ou input no Inspector)
- `button`: label, variant `primary|ghost`, linkToPage opcional
- `input`: placeholder, width/height
- `box`: container neutro (para agrupar visualmente)
- `image`: url opcional (mostra placeholder xadrez se vazio)

Interações do Canvas (UX)
- Drag/Resize: `react-rnd`; snap grid = 8px; limites de bounds do canvas
- Seleção: clique para selecionar; `Shift` para multiseleção (pós‑MVP)
- Teclado:
  - `Delete` → apagar elemento
  - `Arrow keys` → mover 1px; `Shift+Arrow` → 8px
  - `Ctrl/Cmd + S` → salvar (noop com toast “salvo automaticamente”)
  - `Ctrl/Cmd + Z / Shift+Z` → undo/redo (pós‑MVP)
- Guias de alinhamento (pós‑MVP): mostrar linhas ao alinhar centros/bordas

Inspector (Direita)
- Contexto “Página”:
  - Nome da página (input)
  - Entrypoint (checkbox para definir como inicial)
- Contexto “Elemento”:
  - Tipo (label)
  - Texto (se `text`/`button`)
  - Link para página (select de pages)
  - Posição/Tamanho (x,y,w,h) com inputs numéricos

Estados/Feedbacks
- Seleção: borda `border-primary` + sombreamento leve
- Hover: sombra sutil + cursor específico (move/resize)
- Toasts (sonner): “Página criada”, “Elemento adicionado”, “Ação inválida (payload IA)”
- Loaders: spinner mínimo em chamadas IA e envio para equipe

Integração com store (Zustand)
- Store é a fonte da verdade do ProjectState
- Canvas escuta `pages[currentPageId]` e renderiza `elements`
- Inspector chama actions da store (`updateElement`, `renamePage`, …)
- Chat aplica **actions** vindas da IA usando um aplicador central

Integração com IA
- Chat envia `{ message, projectState }` → `/api/studio/ai`
- Resposta com `{ actions, summary | ask }`
- Aplicar actions com validação zod; se `ask`, exibir pergunta e botões “Confirmar/Cancelar”
- Registrar `summary` no chat como mensagem da IA

Persistência
- MVP: autosave `localStorage` (debounce 500ms). Chave: `studio:project`
- Import/Export: file `.studio.json`
- DB (pós‑MVP): salvar `Project.data` inteiro (JSON) + logs

Estilo/Qualidade visual
- Cantos levemente arredondados (`rounded-md`), bordas discretas, contrastes adequados
- Espaçamento consistente (8px múltiplos)
- Sem “pixel hunting”: hit areas generosas nos handles
- Cursor: `grab/grabbing` no drag; `nwse/nesw` nos resizes
- Micro animações: `transition-all duration-150` em hover/seleção

Acessibilidade básica
- Foco visível nos elementos selecionáveis
- Labels e `aria-label` em botões
- Suportar teclado no Inspector

Performance
- `react-rnd` apenas nos elementos visíveis
- Canvas virtualizável (pós‑MVP) para páginas com muitos elementos
- Evitar re‑renders usando memo e selectors do Zustand

Ergonomia do dev
- Tipos compartilhados (ProjectState, Page, Element, Action)
- Aplicador de actions único (pure functions), testável
- Utilitários: `snap(value, grid)`, `clampRect`, `generateId (nanoid)`

Aceite visual (MVP)
- Dark consistente com a home
- Canvas responsivo (scroll quando necessário)
- Interações suaves, sem “pulos”/glitches no drag/resize
- Inspector claro e funcional

Roadmap de frontend (rápido)
- Undo/Redo com `past/present/future` no Zustand
- Mapa de fluxo de telas (reactflow mini‑map)
- Templates de página (login, pricing, dashboard)
- “Sugestões de layout” da IA (actions compostas)

Checklist de qualidade antes de lançar
- [ ] Canvas com snap 8px e resize ok
- [ ] Text editável ou via Inspector sem quebrar layout
- [ ] Chat cria páginas/blocos com actions válidas
- [ ] Export/Import funcionando
- [ ] Envio para equipe com JSON + chat
- [ ] UI coerente com a brand (cores/espaçamentos)
