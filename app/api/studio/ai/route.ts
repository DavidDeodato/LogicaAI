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
  }
  return (map[t] || t) as string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message: string = body?.message ?? ""
    const projectState = body?.projectState
    if (!message || !projectState) return NextResponse.json({ error: "invalid body" }, { status: 400 })

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) return NextResponse.json({ error: "missing GOOGLE_GENERATIVE_AI_API_KEY" }, { status: 500 })

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: MODEL_ID, generationConfig: { temperature: 0.2, topK: 20, topP: 0.9 } })

    const safeState = toSafeProjectState(projectState)

    const toolsList = `Ferramentas (actions) que você pode "chamar":
- add_page { name }
- select_page { pageId }
- rename_page { pageId, name }
- delete_page { pageId }
- add_block { pageId, type: 'text'|'button'|'input'|'box'|'image', text?, rect? }
- update_block_text { pageId, elementId, text }
- move_block { pageId, elementId, x, y }
- resize_block { pageId, elementId, w, h }
- delete_block { pageId, elementId }
- link_pages { fromPageId, toPageId }`

    const fewShot = `Exemplos:
1) {"user":"crie página Login com botão Entrar à direita"}
→ {"actions":[{"type":"add_page","payload":{"name":"Login"}},{"type":"add_block","payload":{"pageId":"p-login","type":"text","text":"Login"}},{"type":"add_block","payload":{"pageId":"p-login","type":"button","text":"Entrar"}}],"summary":"Criei página Login e adicionei título e botão Entrar"}
2) {"user":"ligue Home para Assinaturas"}
→ {"actions":[{"type":"link_pages","payload":{"fromPageId":"home","toPageId":"subscriptions"}}],"summary":"Criei link Home→Assinaturas"}`

    const system = `Você é o StudioAgent. Responda exclusivamente em JSON com o formato:
{"actions": Action[], "summary": string}
${toolsList}
Se houver dúvida, responda {"actions":[], "ask":"pergunta"}. Não gere HTML/markdown.`

    const prompt = `${system}\n\n${fewShot}\n\nEstado atual do projeto (JSON):\n${JSON.stringify(safeState)}\n\nMensagem do usuário:\n${message}\n\nResponda somente o JSON solicitado.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    let data: AiResponse
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: "IA retornou resposta inválida" }, { status: 500 })
    }

    const valid: any[] = []
    const invalid: number[] = []

    if (Array.isArray(data.actions)) {
      data.actions.forEach((a, idx) => {
        if (a && typeof a === "object" && typeof (a as any).type === "string") {
          ;(a as any).type = normalizeType((a as any).type)
        }
        const ok = ActionSchema.safeParse(a)
        if (ok.success) valid.push(ok.data)
        else invalid.push(idx)
      })
    }

    if (!valid.length && !data.ask) {
      return NextResponse.json({ error: "action inválida da IA", invalid, raw: process.env.NODE_ENV === "development" ? text : undefined }, { status: 500 })
    }

    return NextResponse.json({ actions: valid, summary: data.summary ?? "", invalid })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
