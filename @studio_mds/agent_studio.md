# agent_studio.md — StudioAgent (IA)

Objetivo
- Controlar o Studio via chat emitindo **actions JSON** (não texto solto). A IA entende o estado atual do projeto, evita duplicidades e faz perguntas quando há ambiguidade.

Modelo (validados no teste)
- `models/gemini-2.5-flash-lite-preview-09-2025`

Prompt de sistema (resumo)
- Você é o StudioAgent. Você recebe `projectState` (JSON) e uma mensagem do usuário.
- Você deve responder com `{"actions": Action[], "summary": string}`.
- Nunca gere HTML/JS; apenas ações do schema.
- Se precisar de confirmação, responda `{"actions":[], "ask": "pergunta"}`.
- Reutilize telas/componentes existentes quando fizer sentido; evite duplicar.

Schema de actions (Zod)
- `add_page { name }`
- `select_page { pageId }`
- `rename_page { pageId, name }`
- `delete_page { pageId }`
- `add_block { pageId, type: 'text'|'button'|'input'|'box'|'image', text?, rect? }`
- `update_block_text { pageId, elementId, text }`
- `move_block { pageId, elementId, x, y }`
- `resize_block { pageId, elementId, w, h }`
- `delete_block { pageId, elementId }`
- `link_pages { fromPageId, toPageId }`

Contrato da API `/api/studio/ai`
- Request: `{ message: string, projectState: ProjectState }`
- Response 200:
  - Sucesso: `{ actions: Action[], summary: string }`
  - Necessita confirmação: `{ actions: [], ask: string }`
  - Erro validável: `{ actions: [], error: string }`

Validações e proteção
- `zod` valida payloads. Se inválido: retorna erro ao chat (“não apliquei, payload inválido”).
- Rate limit por IP/usuário: 10 req/min (middleware simples).
- Sanitização: truncar textos longos; limitar número de elementos adicionados por ação.

Exemplos
1) Usuário: “Adiciona uma página de Login com título e um botão Entrar, botão à direita.”
```json
{
  "actions": [
    { "type": "add_page", "payload": { "name": "Login" } },
    { "type": "add_block", "payload": { "pageId": "p-login", "type": "text", "text": "Bem‑vindo", "rect": { "x": 80, "y": 40, "w": 240, "h": 40 } } },
    { "type": "add_block", "payload": { "pageId": "p-login", "type": "button", "text": "Entrar", "rect": { "x": 480, "y": 260, "w": 120, "h": 40 } } }
  ],
  "summary": "Criei a página Login, adicionei título e botão à direita."
}
```
2) Usuário: “Quero mais uma tela de assinaturas.” (já existe “Assinaturas”)
```json
{ "actions": [], "ask": "Já existe a tela 'Assinaturas'. Prefere reutilizar e fazer ajustes nela?" }
```

Contexto enviado à IA
- `projectState` serializado (compactado se necessário)
- Últimas 10 mensagens do chat (para manter histórico curto)
- Regras do schema e limites (no prompt)

Erros comuns e respostas desejadas
- Duplicidade de páginas → perguntar antes
- Layout impossível → sugerir alternativa (“reduzi largura para caber no canvas”)
- Falta pageId/elementId → retornar `ask` pedindo qual alvo alterar

Logging
- Guardar request/response no `ActionLog` (pós‑MVP) para auditoria e undo/redo.

---

## Notas de campo — validação de actions (abril/2025)
Problema observado: a IA, ocasionalmente, retornou tipos fora do contrato (ex.: `create_page`, `add_component`). O backend rejeitava todo o lote com `action inválida da IA`.

Ajustes implementados (hardening):
- Normalização de tipos no endpoint `/api/studio/ai` mapeando sinônimos → tipos oficiais (`create_page`→`add_page`, `add_component`→`add_block`, etc.).
- Validação unitária: ações inválidas são filtradas e as válidas aplicadas; índice das inválidas retornado em `invalid` (para telemetria futura).
- Prompt reforçado exigindo os nomes exatos e orientando a devolver `{actions:[], ask:"..."}` em caso de ambiguidade.

Impacto: reduz falhas 500 e mantém fluxo responsivo, sem abrir mão de validação do schema Zod.
