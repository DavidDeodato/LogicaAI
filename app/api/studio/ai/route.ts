import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { ActionSchema, AiResponse, toSafeProjectState } from "@/lib/studio/actions"

const MODEL_ID = "models/gemini-2.5-flash-lite-preview-09-2025"

function normalizeType(t: string) {
  const map: Record<string, string> = {
    create_page: "add_page",
    add_screen: "add_page",
    new_page: "add_page",
    add_component: "add_block",
    add_element: "add_block",
    update_component_text: "update_block_text",
    move_component: "move_block",
    resize_component: "resize_block",
    delete_component: "delete_block",
    link_screen: "link_pages",
    link_page: "link_pages",
    place_component_intent: "place_block_intent",
    update_style: "update_block_style",
    set_style: "update_block_style",
    change_style: "update_block_style",
    change_color: "update_block_style",
  }
  return (map[t] || t) as string
}

function buildBrief(state: any) {
  const pages = (state.pages || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    elements: (p.elements || []).map((e: any) => ({
      id: e.id,
      type: e.type,
      rect: e.rect,
      props: e.props ? { kind: e.props.kind } : undefined,
      style: e.style
        ? {
            backgroundColor: e.style.backgroundColor,
            borderColor: e.style.borderColor,
            borderWidth: e.style.borderWidth,
            borderRadius: e.style.borderRadius,
            opacity: e.style.opacity,
            rotateDeg: e.style.rotateDeg,
            textColor: e.style.textColor,
          }
        : undefined,
      text: e.text,
    })),
  }))
  const currentPageId = state.entry || (state.pages && state.pages[0]?.id)
  const currentPageName = (state.pages || []).find((p: any) => p.id === currentPageId)?.name
  return { pages, currentPageId, currentPageName, gridSize: 8, pageSize: { w: 2400, h: 2400 } }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message: string = body?.message ?? ""
    const projectState = body?.projectState
    const image = body?.image as { data?: string; mime?: string } | undefined
    if (!message || !projectState) return NextResponse.json({ error: "invalid body" }, { status: 400 })

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) return NextResponse.json({ error: "missing GOOGLE_GENERATIVE_AI_API_KEY" }, { status: 500 })

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: MODEL_ID, generationConfig: { temperature: 0.2, topK: 20, topP: 0.9 } })

    const safeState = toSafeProjectState(projectState)
    const brief = buildBrief(safeState)

    const toolsList = `Ferramentas (actions) que você pode "chamar":
- add_page { name }
- select_page { pageId }
- rename_page { pageId, name }
- delete_page { pageId }
- add_block { pageId, type: 'text'|'button'|'input'|'box'|'image', text?, rect? }
- place_block_intent { pageId?, type, size?, anchor?, referenceElementId?, gap?, text? } // preferível para posicionamento relativo
 - place_block_intent { pageId?, type, size?, anchor?, referenceElementId?, referenceText?, gap?, text? } // preferível para posicionamento relativo; se não souber o id, use referenceText (ex.: "Login")
- update_block_text { pageId, elementId, text }
- move_block { pageId, elementId, x, y }
- resize_block { pageId, elementId, w, h }
- delete_block { pageId, elementId }
- link_pages { fromPageId, toPageId }
- update_block_style { pageId, elementId, style } // style pode conter: backgroundColor|fill, borderColor|stroke, borderWidth|strokeWidth, borderRadius, textColor|color, opacity, fontSize, fontFamily, fontWeight, rotateDeg`

    const fewShot = `Exemplos:
1) {"user":"crie página Login com botão Entrar à direita do título"}
→ {"actions":[{"type":"add_page","payload":{"name":"Login"}},{"type":"place_block_intent","payload":{"type":"text","text":"Login","anchor":"top"}},{"type":"place_block_intent","payload":{"type":"button","text":"Entrar","anchor":"right_of","referenceElementId":"<id_do_titulo>","gap":24}}]}
2) {"user":"ligue Home para Assinaturas"}
→ {"actions":[{"type":"link_pages","payload":{"fromPageId":"home","toPageId":"subscriptions"}}]}`

    const system = `Você é o StudioAgent. Responda exclusivamente em JSON com o formato:
{"actions": Action[], "summary": string, "vision"?: {"description": string}}
${toolsList}
Use preferencialmente place_block_intent para posicionar elementos sem colisão.
Se houver dúvida, responda {"actions":[], "ask":"pergunta"}. Não gere HTML/markdown.
Proibições: não narre processos (ex.: "selecionando página..."). Em vez disso, execute via actions e descreva o resultado no summary.`

    const header = `${system}\n\nContexto: você está ajudando um usuário a construir uma página visual no nosso Studio.\nVocê receberá um snapshot (imagem) do canvas e também um resumo (brief) + o estado JSON do layout.\nA imagem serve para entender hierarquia visual/contraste/espacamentos; o JSON traz detalhes precisos.\nPágina corrente (se aplicável): id=${brief.currentPageId}, name=${brief.currentPageName}.\nRegras importantes:\n- SEMPRE use elementId exatamente como aparece no brief ao modificar um elemento existente.\n- Para mudar cores/estilos use update_block_style com style (pode usar fill/stroke/strokeWidth, serão normalizados).\n- Não omita elementId nem pageId.\n\nExemplo de mudança de cor: {"type":"update_block_style","payload":{"pageId":"${brief.currentPageId}","elementId":"<id_da_elipse>","style":{"fill":"#0000ff"}}}\n\nBrief do layout atual (compacto):\n${JSON.stringify(brief)}\n\nEstado completo (referência):\n${JSON.stringify(safeState)}\n\nMensagem do usuário:\n${message}\n\nResponda SOMENTE o JSON.`

    const parts: any[] = [{ text: header }]
    if (image?.data && image?.mime) {
      parts.push({ inlineData: { mimeType: image.mime, data: image.data } })
    }

    const result = await model.generateContent(parts)
    const text = result.response.text()

    let data: AiResponse
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: "IA retornou resposta inválida" }, { status: 500 })
    }

    const valid: any[] = []
    const invalid: number[] = []

    const actionsArr: any[] = Array.isArray((data as any).actions) ? (data as any).actions : []

    actionsArr.forEach((a, idx) => {
      if (a && typeof a === "object" && typeof (a as any).type === "string") {
        ;(a as any).type = normalizeType((a as any).type)
      }
      const ok = ActionSchema.safeParse(a)
      if (ok.success) valid.push(ok.data)
      else invalid.push(idx)
    })

    if (!valid.length) {
      // se há ask, devolve ask; senão, se há summary, devolve summary com 200; caso contrário erro
      if ((data as any).ask) return NextResponse.json({ actions: [], ask: (data as any).ask, invalid })
      if ((data as any).summary) return NextResponse.json({ actions: [], summary: (data as any).summary, invalid })
      return NextResponse.json({ error: "action inválida da IA", invalid, raw: process.env.NODE_ENV === "development" ? text : undefined }, { status: 500 })
    }

    return NextResponse.json({ actions: valid, summary: (data as any).summary ?? "", visionDescription: (data as any).vision?.description ?? undefined, invalid })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
