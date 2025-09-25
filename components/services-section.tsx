"use client"

import { Bot, Cloud, Zap, Shield, BarChart3, Palette } from "lucide-react"
import { InteractiveCard } from "./interactive-card"
import { ScrollReveal } from "./scroll-reveal"

const services = [
  {
    icon: Bot,
    title: "Agentes de IA e Integrações",
    description: "Agentes conectados a dados e APIs para executar processos ponta a ponta.",
    gradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    icon: Cloud,
    title: "Full-Stack & Cloud",
    description: "Front/back escalável com arquitetura cloud-native e boas práticas.",
    gradient: "from-green-500/20 to-blue-500/20",
  },
  {
    icon: Zap,
    title: "Automação sob Medida",
    description: "RPA inteligente e workflows que reduzem custo e tempo do time.",
    gradient: "from-yellow-500/20 to-orange-500/20",
  },
  {
    icon: Shield,
    title: "Blockchain & Smart Contracts",
    description: "Transparência e segurança em transações e registros.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: BarChart3,
    title: "Data Science & Analytics",
    description: "Modelos preditivos, dashboards e insights acionáveis.",
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
  {
    icon: Palette,
    title: "UX/UI Design",
    description: "Interfaces centradas no usuário para conversão e retenção.",
    gradient: "from-pink-500/20 to-red-500/20",
  },
]

export function ServicesSection() {
  return (
    <section id="servicos" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient">Nossos Serviços</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tecnologias de ponta integradas em soluções que transformam seu negócio num time só.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 100}>
              <InteractiveCard className="p-8 h-full bg-gradient-to-br from-card to-card/50 interactive-hover magnetic-hover">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 animate-bounce-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </InteractiveCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
