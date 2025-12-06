"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dna, Menu, X } from "lucide-react"
import { useOrganism } from "@/lib/organism-context"

const navLinks = [
  { name: "Home", href: "#hero" },
  { name: "Features", href: "#features" },
  { name: "DNA Designer", href: "#dna-designer" },
  { name: "Simulator", href: "#simulator" },
  { name: "Evolution", href: "#evolution" },
  { name: "Synthesis", href: "#synthesis" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const { organism, simulationResult, evolutionResult, synthesisResult } = useOrganism()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Determine active section
      const sections = navLinks.map((link) => link.href.slice(1))
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.slice(1))
    if (element) {
      const offset = 80 // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("#hero")}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Dna className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:block">
              Digital Arboretum
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === link.href.slice(1)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Status Indicators */}
          <div className="hidden md:flex items-center gap-3">
            {organism && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs text-primary font-medium">
                  Organism Ready
                </span>
              </div>
            )}
            {simulationResult && (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                  simulationResult.verdict === "VIABLE"
                    ? "bg-primary/10 border-primary/30"
                    : simulationResult.verdict === "MARGINAL"
                      ? "bg-chart-5/10 border-chart-5/30"
                      : "bg-destructive/10 border-destructive/30"
                }`}
              >
                <span className="text-xs font-medium">
                  {simulationResult.survivalProbability}% Survival
                </span>
              </div>
            )}
            {evolutionResult && (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                  evolutionResult.verdict === "OPTIMIZED"
                    ? "bg-chart-5/10 border-chart-5/30"
                    : evolutionResult.verdict === "PARTIALLY_OPTIMIZED"
                      ? "bg-chart-4/10 border-chart-4/30"
                      : "bg-destructive/10 border-destructive/30"
                }`}
              >
                <span className="text-xs font-medium">
                  +{evolutionResult.evolutionSummary.improvementPercent}% Evolved
                </span>
              </div>
            )}
            {synthesisResult && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-chart-4/10 border-chart-4/30">
                <span className="text-xs font-medium text-chart-4">
                  {synthesisResult.synthesisOverview.totalFragments} Fragments Ready
                </span>
              </div>
            )}
            <Button
              size="sm"
              onClick={() => scrollToSection("#dna-designer")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Start Designing
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={`px-4 py-3 rounded-lg text-left font-medium transition-all ${
                    activeSection === link.href.slice(1)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-2 mt-2 border-t border-border">
                {organism && (
                  <div className="flex items-center gap-2 px-4 py-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm text-primary">Organism Ready</span>
                  </div>
                )}
                <Button
                  onClick={() => scrollToSection("#dna-designer")}
                  className="w-full mt-2 bg-primary text-primary-foreground"
                >
                  Start Designing
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}






