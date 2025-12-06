import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { DNADesigner } from "@/components/dna-designer"
import { EnvironmentSimulator } from "@/components/environment-simulator"
import { EvolutionaryOptimizer } from "@/components/evolutionary-optimizer"
import { SynthesisInterface } from "@/components/synthesis-interface"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <section id="hero">
        <HeroSection />
      </section>
      <section id="features">
        <FeaturesSection />
      </section>
      <section id="dna-designer">
        <DNADesigner />
      </section>
      <section id="simulator">
        <EnvironmentSimulator />
      </section>
      <section id="evolution">
        <EvolutionaryOptimizer />
      </section>
      <section id="synthesis">
        <SynthesisInterface />
      </section>
      <Footer />
    </main>
  )
}
