"use client"

import { InteractiveCard } from "./interactive-card"
import { ScrollReveal } from "./scroll-reveal"
import { Badge } from "@/components/ui/badge"

const projects = [
  {
    title: "Modelo Preditivo de Receitas",
    client: "Rede Gazeta",
    description: "IA para prever receitas futuras com alta precisão, apoiando planejamento e decisões.",
    tech: ["Machine Learning", "Python", "Cloud"],
    gradient: "from-blue-600/20 to-purple-600/20",
  },
  {
    title: "Jogo de Negócios",
    client: "Zuyd University",
    description: "Webapp de simulação para tomada de decisão em cenários empresariais.",
    tech: ["React", "Node.js", "Gamification"],
    gradient: "from-green-600/20 to-blue-600/20",
  },
  {
    title: "Créditos Florestais",
    client: "Abundance Brasil", // Corrigido cliente do projeto blockchain
    description: "Marketplace com smart contracts para compra e venda de créditos florestais.",
    tech: ["Blockchain", "Smart Contracts", "Web3"],
    gradient: "from-emerald-600/20 to-teal-600/20",
  },
]

export function ProjectsSection() {
  return (
    <section id="projetos" className="py-24 px-4 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient">Projetos que transformam negócios</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Cases reais de como nossa tecnologia gera resultados mensuráveis para nossos clientes.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ScrollReveal key={project.title} delay={index * 200}>
              <InteractiveCard
                className={`p-8 h-full bg-gradient-to-br ${project.gradient} border-primary/20 group hover:scale-105 transition-all duration-300`}
              >
                <div className="mb-4">
                  <Badge variant="secondary" className="mb-2 bg-primary/20 text-primary border-primary/30">
                    {project.client}
                  </Badge>
                  <h3 className="text-2xl font-bold mb-4 text-primary group-hover:text-primary/80 transition-colors">
                    {project.title}
                  </h3>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">{project.description}</p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="border-primary/30 text-primary group-hover:border-primary/50 transition-colors"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </InteractiveCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
