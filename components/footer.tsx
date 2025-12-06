"use client"

import { Dna } from "lucide-react"

export function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Dna className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-bold">Digital Arboretum</div>
              <div className="text-sm text-muted-foreground">Synthetic Biology Platform</div>
            </div>
          </div>

          <div className="flex gap-8 text-sm text-muted-foreground">
            <button 
              onClick={() => scrollToSection("features")}
              className="hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection("dna-designer")}
              className="hover:text-foreground transition-colors"
            >
              DNA Designer
            </button>
            <button 
              onClick={() => scrollToSection("simulator")}
              className="hover:text-foreground transition-colors"
            >
              Simulator
            </button>
            <button 
              onClick={() => scrollToSection("synthesis")}
              className="hover:text-foreground transition-colors"
            >
              Synthesis
            </button>
          </div>

          <div className="text-sm text-muted-foreground">Bridging code and biology</div>
        </div>
      </div>
    </footer>
  )
}
