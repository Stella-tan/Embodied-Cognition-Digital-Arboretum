import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Cpu, Database, Globe, Microscope, Sparkles } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Generative Algorithms",
    description:
      "Neural networks trained on biochemistry, genetics, and evolutionary biology to generate viable DNA blueprints.",
    color: "text-primary",
  },
  {
    icon: Microscope,
    title: "Synthetic Biology Interface",
    description:
      "Direct API integration with gene synthesis labs to convert digital blueprints into physical DNA sequences.",
    color: "text-chart-2",
  },
  {
    icon: Globe,
    title: "Digital Twin Simulator",
    description:
      "High-fidelity planetary environment simulation — Mars, Europa, Titan — to validate organism survival.",
    color: "text-accent",
  },
  {
    icon: Database,
    title: "Genome Library",
    description: "Access millions of sequenced genomes as building blocks for your synthetic organism designs.",
    color: "text-chart-4",
  },
  {
    icon: Cpu,
    title: "Evolutionary Engine",
    description: "Accelerated evolution simulation to optimize genetic traits across thousands of generations.",
    color: "text-chart-5",
  },
  {
    icon: Sparkles,
    title: "Phenotype Prediction",
    description: "Machine learning models predicting physical traits and behaviors from genetic sequences.",
    color: "text-primary",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Platform Capabilities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From code to creation — a complete toolkit for designing life at the intersection of computer science,
            bioengineering, and astrobiology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <feature.icon className={`w-10 h-10 ${feature.color} mb-2`} />
                <CardTitle className="text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
