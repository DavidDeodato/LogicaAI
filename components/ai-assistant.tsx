"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Olá! Sou o assistente da LogicaAI. Conte-me sobre sua ideia de projeto e vou fazer algumas perguntas para entender melhor suas necessidades. Depois, nossa equipe entrará em contato via WhatsApp!",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Lógica para rolar para a última mensagem
    // Implementar se necessário
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!response.ok) {
        throw new Error("A resposta da rede não foi ok")
      }

      const data = await response.json()
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.text,
        role: "assistant",
      }

      setMessages((prevMessages) => [...prevMessages, aiMessage])
    } catch (error) {
      console.error("Erro ao buscar resposta da IA:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Desculpe, não consegui me conectar. Tente novamente.",
        role: "assistant",
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendReport = async () => {
    if (!whatsappNumber.trim()) {
      toast.error("Por favor, insira seu número de WhatsApp.")
      return
    }
    setIsSubmittingReport(true)

    try {
      const response = await fetch("/api/send-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages, whatsapp: whatsappNumber }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar relatório.")
      }

      toast.success(data.message)
      setShowReportDialog(false)
      setWhatsappNumber("")
      clearChat()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido."
      toast.error(errorMessage)
      console.error("Erro ao enviar relatório:", error)
    } finally {
      setIsSubmittingReport(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Olá! Sou o assistente da LogicaAI. Conte-me sobre sua ideia de projeto e vou fazer algumas perguntas para entender melhor suas necessidades. Depois, nossa equipe entrará em contato via WhatsApp!",
      },
    ])
  }

  return (
    <section id="ai-assistant" className="py-24 px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">IA Integrada</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient">Converse com nosso Assistente IA</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conte sua ideia para nossa IA. Ela fará perguntas estratégicas para entender melhor seu projeto e nossa
            equipe entrará em contato via WhatsApp com uma proposta personalizada.
          </p>
        </div>

        <Card className="bg-background/50 backdrop-blur-sm border-primary/20 p-6">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" size="sm" onClick={clearChat} className="text-muted-foreground bg-transparent">
              Nova Conversa
            </Button>

            <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
              <DialogTrigger asChild>
                <Button variant="default">Finalizar e enviar para a equipe</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Quase lá!</DialogTitle>
                  <DialogDescription>
                    Para que nossa equipe possa entrar em contato, por favor, informe seu número de WhatsApp com DDD.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  type="tel"
                  placeholder="(99) 99999-9999"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                />
                <DialogFooter>
                  <Button onClick={handleSendReport} disabled={!whatsappNumber.trim() || isSubmittingReport}>
                    {isSubmittingReport ? "Enviando..." : "Enviar para a equipe"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <ScrollArea className="h-96 mb-4 pr-4">
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      m.role === "user" ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"
                    }`}
                  >
                    {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      m.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{m.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={!input.trim() || isLoading} className="bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>
    </section>
  )
}
