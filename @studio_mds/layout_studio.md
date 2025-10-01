# layout_studio.md — Modelo espacial, posicionamento e não-colisão

Problema
- A IA decide **o que** adicionar, mas não "enxerga" o canvas. Precisamos dar contexto espacial e garantir **colocação sem colisão**.

Objetivos
- Representar o layout de forma eficiente para consulta/validação.
- Fornecer à IA um resumo compacto do estado (brief) para decisões melhores.
- Converter intents de alto nível em coordenadas concretas sem sobreposição.

Abordagem
1) **Grade espacial (spatial hash)**
   - Dividir o canvas em células fixas (ex.: 32px ou o snap grid 8×4 células). 
   - Cada elemento ocupa um conjunto de células; mantemos um `Map<CellKey, Set<ElementId>>`.
   - Checagem de colisão: O(n) no número de células ocupadas, não no total de elementos.

2) **Bounding boxes + margem**
   - Guardar `rect = {x,y,w,h}` e calcular `bbox` inflado (margem 8–16px) para evitar toques.
   - Funções util: `intersects(a,b)`, `occupiesCells(rect)`, `isFree(rect)`.

3) **Intents de posicionamento (para a IA)**
   - Em vez de passar sempre coordenadas, a IA envia intents:
     - `place { targetPage, type, size?, anchor?: 'top'|'bottom'|'left'|'right'|'center', referenceElementId? }`
   - O **resolver** traduz o intent em um `rect` que não colide (ver item 4).
   - Ainda aceitamos `add_block` com `rect` explícito; se colidir, fazemos ajuste.

4) **Heurística de auto-placement**
   - Dado `size (w,h)` e `anchor`, gerar candidatos:
     - Anchors relativas: `right_of(ref)`, `below(ref)`, `above(ref)`, `left_of(ref)` com gaps.
     - Anchors absolutas: `top/left/center` da página.
   - Para cada candidato, ajustar `snap` e checar `isFree(rect)`; se colisão, varrer offsets (espiral ou BFS em grade) até encontrar slot livre.
   - Limitar busca (ex.: 300 tentativas) e, se falhar, retornar sugestão de reorganização.

5) **Resumo para IA (layout brief)**
   - Enviar para a IA uma lista compacta por página:
     - `[{id,name,rect:{x,y,w,h},type:'text'|'button'|...}]` com até N itens e resolução simplificada (snapped).
   - Incluir `pageSize` (viewport) e `gridSize`.

6) **Detecção de colisão eficiente**
   - A cada inserção/movimento:
     - Calcular `cells = occupiesCells(rect)`; verificar `cells` no hash.
     - O custo ~ O(células do elemento), típico baixo (retângulos pequenos).

7) **Restrições e regras simples**
   - Tamanho mínimo por tipo (ex.: botão 120×40, texto 160×40).
   - Snap 8px; margem padrão 8px.
   - Evitar sobreposição vertical forte: preferir alinhar baseline em grids de 40px.

8) **Iterações futuras**
   - Livre-retângulos (guillotine/skyline) para packing mais denso.
   - Sugestões de layout (linhas/colunas/templates) geradas pela IA e validadas pelo resolver.

API interna (utils)
- `buildSpatialHash(elements, cellSize) -> map`
- `occupiesCells(rect, cellSize) -> cellKeys[]`
- `isFree(rect, hash) -> boolean`
- `findFreeRectNear(desiredRect, hash) -> rect|undefined`
- `resolveIntent(intent, page, hash) -> rect`

Integração com o agent
- Tools list passa a incluir `place_block_intent`.
- O backend traduz intent → rect (com o resolver) e cai em `add_block` já com coordenadas válidas.
- Brief enviado junto do `projectState` para a IA decidir âncoras e referências.
