"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"

const faqs = [
  {
    question: "O que é uma software house com foco em IA?",
    answer:
      "Somos uma empresa de desenvolvimento que coloca a inteligência artificial no centro de todas as soluções. Não apenas desenvolvemos software tradicional, mas integramos agentes de IA que automatizam processos, tomam decisões e aprendem com os dados do seu negócio.",
  },
  {
    question: "Como vocês diferem de outras empresas de desenvolvimento?",
    answer:
      "Nossa diferença está na integração nativa de IA em todos os projetos. Enquanto outras empresas adicionam IA como um extra, nós projetamos sistemas onde a IA é fundamental para resolver problemas complexos e gerar valor real desde o primeiro dia.",
  },
  {
    question: "Que tipo de projetos vocês desenvolvem?",
    answer:
      "Desenvolvemos desde aplicações web e mobile até sistemas complexos de automação, modelos preditivos, chatbots inteligentes, análise de dados em tempo real, e soluções blockchain. Cada projeto é personalizado para as necessidades específicas do cliente.",
  },
  {
    question: "Quanto tempo leva para desenvolver uma solução?",
    answer:
      "O prazo varia conforme a complexidade, mas nossa metodologia ágil permite entregas incrementais. Projetos simples podem levar 2-4 semanas, enquanto sistemas complexos podem levar 3-6 meses. Sempre mantemos o cliente atualizado sobre o progresso.",
  },
  {
    question: "Vocês oferecem suporte após o lançamento?",
    answer:
      "Sim! Oferecemos suporte técnico, manutenção, atualizações e melhorias contínuas. Também treinamos sua equipe para usar as soluções e fornecemos documentação completa para garantir o sucesso a longo prazo.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient">Perguntas Frequentes</h2>
            <p className="text-xl text-muted-foreground">Tire suas dúvidas sobre nossos serviços e metodologia.</p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="border border-border rounded-lg overflow-hidden bg-card/50 backdrop-blur-sm">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-primary/5 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-primary transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 text-muted-foreground leading-relaxed animate-slide-up">{faq.answer}</div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
