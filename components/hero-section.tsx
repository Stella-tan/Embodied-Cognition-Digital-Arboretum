"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Dna, FlaskConical, Satellite } from "lucide-react"
import { DNAHelix } from "@/components/dna-helix"

export function HeroSection() {
  const [activeBase, setActiveBase] = useState(0)
  const bases = ["A", "T", "G", "C"]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBase((prev) => (prev + 1) % bases.length)
    }, 800)
    return () => clearInterval(interval)
  }, [])

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
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,163,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,163,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full border border-border">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Synthetic Biology Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-balance">
              <span className="text-foreground">Design Life</span>
              <br />
              <span className="text-primary">From Code</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              An AI-powered platform bridging computational biology and synthetic life. Generate
              DNA blueprints, simulate planetary environments, and engineer organisms for extreme conditions.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => scrollToSection("dna-designer")}
              >
                Start Designing
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border hover:bg-secondary bg-transparent"
                onClick={() => scrollToSection("features")}
              >
                View Features
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <button 
                onClick={() => scrollToSection("dna-designer")}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Dna className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">AI Gene Design</span>
              </button>
              <button 
                onClick={() => scrollToSection("simulator")}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <FlaskConical className="w-5 h-5 text-chart-2" />
                <span className="text-sm text-muted-foreground">Bio Synthesis</span>
              </button>
              <button 
                onClick={() => scrollToSection("evolution")}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Satellite className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Astrobiology</span>
              </button>
            </div>
          </div>

          <div className="relative h-[500px] flex items-center justify-center">
            <DNAHelix />

            {/* Floating base indicators */}
            <div className="absolute top-10 right-10 flex gap-2">
              {bases.map((base, i) => (
                <div
                  key={base}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center font-mono text-lg font-bold transition-all duration-300 ${
                    activeBase === i
                      ? "bg-primary text-primary-foreground scale-110"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {base}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
