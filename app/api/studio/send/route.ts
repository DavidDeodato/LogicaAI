import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { project, chat } = await req.json()
    if (!project) return NextResponse.json({ error: "missing project" }, { status: 400 })

    const to = "potaozinho361@gmail.com" // enviar para o email verificado da conta

    const html = `
      <div style="font-family: sans-serif">
        <h2>Studio - Envio de Projeto</h2>
        <h3>Resumo</h3>
        <ul>
          <li>Nome: ${project.name}</li>
          <li>Páginas: ${project.pages?.length || 0}</li>
          <li>Entry: ${project.entry || "(não definido)"}</li>
        </ul>
        <h3>JSON do Projeto</h3>
        <pre style="white-space: pre-wrap; font-size: 12px; background:#111; color:#eee; padding:12px;">${
          project ? JSON.stringify(project, null, 2) : ""
        }</pre>
        <h3>Chat</h3>
        <pre style="white-space: pre-wrap; font-size: 12px; background:#111; color:#eee; padding:12px;">${
          chat ? JSON.stringify(chat, null, 2) : ""
        }</pre>
      </div>
    `

    const { error } = await resend.emails.send({
      from: "Assistente IA <onboarding@resend.dev>",
      to: [to],
      subject: `Studio — Projeto: ${project.name || "Sem título"}`,
      html,
    })

    if (error) return NextResponse.json({ error: String(error) }, { status: 500 })

    return NextResponse.json({ success: true, message: "Projeto enviado para a equipe." })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
