import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ProjectsSection } from "@/components/projects-section"
import { AIAssistant } from "@/components/ai-assistant"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { FloatingElements } from "@/components/floating-elements"
import { WhatsAppWidget } from "@/components/whatsapp-widget"
import { EnhancedInteractiveEffects } from "@/components/enhanced-interactive-effects"
import { MagneticElements } from "@/components/magnetic-elements"
import { FloatingShapes } from "@/components/floating-shapes"

export default function HomePage() {
  return (
    <div className="relative">
      <EnhancedInteractiveEffects />
      <FloatingShapes />
      <MagneticElements />
      <FloatingElements />

      <Header />
      <main>
        <section id="inicio">
          <HeroSection />
        </section>

        <section id="servicos">
          <ServicesSection />
        </section>

        <section id="projetos">
          <ProjectsSection />
        </section>

        <section id="ai-assistant">
          <AIAssistant />
        </section>

        <section id="faq">
          <FAQSection />
        </section>
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  )
}
