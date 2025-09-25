"use client"

import { MessageCircle, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const phoneNumber = "5511988838915"

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Olá! Gostaria de saber mais sobre os serviços da LogicaAI.")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 bg-card border border-border rounded-lg p-4 shadow-2xl animate-slide-up max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">LogicaAI</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Olá! 👋 Como podemos ajudar você com soluções de IA?</p>
          <Button onClick={handleWhatsAppClick} className="w-full bg-green-600 hover:bg-green-700 text-white">
            Iniciar conversa
          </Button>
        </div>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  )
}
