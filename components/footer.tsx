import Image from "next/image"

export function Footer() {
  return (
    <footer id="contato" className="bg-card/50 border-t border-border py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Image src="/images/logo-com-texto.png" alt="LogicaAI" width={200} height={80} className="mb-4" />
            <p className="text-muted-foreground mb-4 max-w-md">
              Transformamos ideias em soluções digitais inteligentes. Sua parceira em inovação tecnológica com IA.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors interactive-hover">
                LinkedIn
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors interactive-hover">
                GitHub
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors interactive-hover">
                Instagram
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary">Serviços</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#servicos" className="hover:text-primary transition-colors interactive-hover">
                  Desenvolvimento IA
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-primary transition-colors interactive-hover">
                  Full-Stack
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-primary transition-colors interactive-hover">
                  Automação
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-primary transition-colors interactive-hover">
                  Blockchain
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary">Contato</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="interactive-hover">contato@logicaai.com</li>
              <li className="interactive-hover">+55 11 98883-8915</li>
              <li className="interactive-hover">São Paulo, SP</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 LogicaAI. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
