import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

function formatConversation(messages: Message[]): string {
  let html = "<h1>Relatório de Conversa - Assistente IA</h1>"
  html += "<h2>Histórico da Conversa:</h2><br>"

  messages.forEach((msg) => {
    if (msg.id === "1") return // Pula a mensagem inicial de boas-vindas

    const role = msg.role === "user" ? "Usuário" : "Assistente (Logic)"
    const color = msg.role === "user" ? "#3b82f6" : "#10b981"
    const bgColor = msg.role === "user" ? "#eff6ff" : "#f0fdf4"

    html += `
      <div style="margin-bottom: 16px; padding: 12px; border-radius: 8px; background-color: ${bgColor}; border: 1px solid ${color};">
        <strong style="color: ${color};">${role}:</strong>
        <p style="margin: 4px 0 0 0; white-space: pre-wrap; color: #333;">${msg.content}</p>
      </div>
    `
  })

  return html
}

export async function POST(req: Request) {
  try {
    const { messages, whatsapp } = await req.json()

    if (!messages || !whatsapp) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 })
    }

    const htmlBody = formatConversation(messages)

    const { data, error } = await resend.emails.send({
      from: "Assistente IA <onboarding@resend.dev>", // Obrigatório ser do domínio resend.dev no plano gratuito
      to: ["potaozinho361@gmail.com"],
      subject: `Novo Lead do Assistente IA: ${whatsapp}`,
      html: `
        <div style="font-family: sans-serif;">
          <h1>Novo Lead Capturado!</h1>
          <p>Um novo potencial cliente finalizou a conversa com o assistente de IA.</p>
          <hr>
          <h2><strong>Número de WhatsApp:</strong> ${whatsapp}</h2>
          <hr><br>
          ${htmlBody}
        </div>
      `,
    })

    if (error) {
      console.error("Erro ao enviar email pelo Resend:", error)
      return NextResponse.json({ error: "Erro ao enviar o email." }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Relatório enviado com sucesso!" })
  } catch (error) {
    console.error("Erro na API de envio de relatório:", error)
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 })
  }
}
