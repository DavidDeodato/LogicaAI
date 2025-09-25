"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import { TypingText } from "./typing-text"

export function HeroSection() {
  const dynamicWords = [
    "IA no centro",
    "automação inteligente",
    "inovação contínua",
    "resultados mensuráveis",
    "tecnologia de ponta",
  ]

  const handleAIClick = () => {
    const element = document.getElementById("ai-assistant")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleProjectsClick = () => {
    const element = document.getElementById("projetos")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background com efeito parallax */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">O Futuro da Tecnologia</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            Soluções digitais com{" "}
            <span className="text-gradient">
              <TypingText words={dynamicWords} />
            </span>{" "}
            da estratégia
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Unimos desenvolvimento full-stack, cloud e automação com inteligência artificial integrada. Do protótipo ao
            deploy, criamos softwares sob medida com agentes de IA que realmente trabalham pelo seu negócio.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={600}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold group"
              onClick={handleAIClick}
            >
              Converse com nossa IA
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/30 hover:bg-primary/10 px-8 py-4 text-lg bg-transparent"
              onClick={handleProjectsClick}
            >
              Ver Projetos
            </Button>
          </div>
        </ScrollReveal>

        {/* Elementos decorativos */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </section>
  )
}
