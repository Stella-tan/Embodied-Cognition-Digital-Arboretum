"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Factory, 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  Dna,
  FlaskConical,
  Scissors,
  Package,
  ShieldCheck,
  DollarSign,
  Clock,
  Building2,
  AlertCircle,
  FileText,
  ChevronRight,
  Lightbulb,
  Beaker
} from "lucide-react"
import { useOrganism, SynthesisResult } from "@/lib/organism-context"

const targetOrganisms = [
  { id: "ecoli", name: "E. coli", description: "Standard bacterial expression", icon: "🦠" },
  { id: "yeast", name: "S. cerevisiae", description: "Eukaryotic expression", icon: "🍞" },
  { id: "mammalian", name: "Mammalian (CHO)", description: "Complex protein production", icon: "🐹" },
  { id: "plant", name: "Plant Cell", description: "Agrobacterium-mediated", icon: "🌱" },
]

const synthesisMethods = [
  { id: "gibson", name: "Gibson Assembly", description: "Seamless, scarless cloning" },
  { id: "golden_gate", name: "Golden Gate", description: "Type IIS restriction assembly" },
  { id: "traditional", name: "Traditional Cloning", description: "Restriction enzyme based" },
  { id: "direct", name: "Direct Synthesis", description: "Full gene synthesis" },
]

const qualityTiers = [
  { id: "research", name: "Research Grade", cost: "$", time: "Fast", accuracy: "99%" },
  { id: "production", name: "Production Grade", cost: "$$", time: "Standard", accuracy: "99.9%" },
  { id: "clinical", name: "Clinical Grade", cost: "$$$", time: "Extended", accuracy: "99.99%" },
]

export function SynthesisInterface() {
  const [targetOrganism, setTargetOrganism] = useState("ecoli")
  const [synthesisMethod, setSynthesisMethod] = useState("gibson")
  const [qualityTier, setQualityTier] = useState("research")
  const [includeVerification, setIncludeVerification] = useState(true)
  const [codonOptimizeFor, setCodonOptimizeFor] = useState("ecoli")
  const [error, setError] = useState<string | null>(null)
  const [synthesisProgress, setSynthesisProgress] = useState(0)

  const { 
    organism, 
    simulationResult,
    evolutionResult,
    synthesisResult, 
    setSynthesisResult, 
    isSynthesizing, 
    setIsSynthesizing 
  } = useOrganism()

  const runSynthesis = async () => {
    setIsSynthesizing(true)
    setSynthesisResult(null)
    setError(null)
    setSynthesisProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setSynthesisProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const response = await fetch("/api/synthesize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organism: organism ? {
            sequence: organism.sequence,
            traits: organism.traits,
            gcContent: organism.gcContent,
            length: organism.length,
          } : null,
          params: {
            targetOrganism: targetOrganisms.find(t => t.id === targetOrganism)?.name || targetOrganism,
            synthesisMethod: synthesisMethods.find(m => m.id === synthesisMethod)?.name || synthesisMethod,
            qualityTier: qualityTiers.find(q => q.id === qualityTier)?.name || qualityTier,
            includeVerification,
            codonOptimizeFor: targetOrganisms.find(t => t.id === codonOptimizeFor)?.name || codonOptimizeFor,
          },
          evolutionResult: evolutionResult ? {
            evolutionSummary: evolutionResult.evolutionSummary,
            optimizedGenome: evolutionResult.optimizedGenome,
            verdict: evolutionResult.verdict,
          } : null,
          simulationResult: simulationResult ? {
            environment: simulationResult.environment,
            survivalProbability: simulationResult.survivalProbability,
            verdict: simulationResult.verdict,
          } : null,
        }),
      })

      const result = await response.json()

      clearInterval(progressInterval)
      setSynthesisProgress(100)

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate synthesis plan")
      }

      if (result.success && result.data) {
        setSynthesisResult(result.data as SynthesisResult)
      }
    } catch (err) {
      clearInterval(progressInterval)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSynthesizing(false)
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity?.toLowerCase()) {
      case "low":
        return "text-primary bg-primary/10 border-primary/30"
      case "medium":
        return "text-chart-5 bg-chart-5/10 border-chart-5/30"
      case "high":
      case "very high":
        return "text-destructive bg-destructive/10 border-destructive/30"
      default:
        return "text-muted-foreground bg-secondary border-border"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return "text-primary"
      case "medium":
        return "text-chart-5"
      case "high":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-chart-4/20 text-chart-4 border-chart-4/30">
            AI-Powered DNA Synthesis Planning
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Synthetic Biology Interface</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Translate your optimized genetic designs into actionable synthesis orders with AI-generated assembly plans.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Synthesis Parameters */}
          <Card className="bg-card border-border lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="w-5 h-5 text-chart-4" />
                Synthesis Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Target Expression System */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Target Expression System</label>
                <div className="grid grid-cols-2 gap-2">
                  {targetOrganisms.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => {
                        setTargetOrganism(org.id)
                        setCodonOptimizeFor(org.id)
                      }}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        targetOrganism === org.id
                          ? "border-chart-4 bg-chart-4/10"
                          : "border-border hover:border-chart-4/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{org.icon}</span>
                        <div>
                          <div className="text-sm font-medium">{org.name}</div>
                          <div className="text-xs text-muted-foreground">{org.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Synthesis Method */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Assembly Method</label>
                <div className="space-y-2">
                  {synthesisMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSynthesisMethod(method.id)}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        synthesisMethod === method.id
                          ? "border-chart-4 bg-chart-4/10"
                          : "border-border hover:border-chart-4/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{method.name}</span>
                        {synthesisMethod === method.id && (
                          <CheckCircle className="w-4 h-4 text-chart-4" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Tier */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Quality Tier</label>
                <div className="space-y-2">
                  {qualityTiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setQualityTier(tier.id)}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        qualityTier === tier.id
                          ? "border-chart-4 bg-chart-4/10"
                          : "border-border hover:border-chart-4/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{tier.name}</span>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-chart-4">{tier.cost}</span>
                          <span className="text-muted-foreground">•</span>
                          <span>{tier.accuracy}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Verification Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <div className="text-sm font-medium">Include Verification</div>
                  <div className="text-xs text-muted-foreground">Sequencing & QC checkpoints</div>
                </div>
                <button
                  onClick={() => setIncludeVerification(!includeVerification)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    includeVerification ? "bg-chart-4" : "bg-secondary"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    includeVerification ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </button>
              </div>

              {/* Organism Status */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Dna className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Pipeline Status</span>
                </div>
                <div className="space-y-2 text-sm">
                  {organism ? (
                    <div className="flex items-center gap-2 text-primary">
                      <CheckCircle className="w-3 h-3" />
                      <span>Organism designed ({organism.length} bp)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertCircle className="w-3 h-3" />
                      <span>No organism (Step 1)</span>
                    </div>
                  )}
                  {simulationResult ? (
                    <div className="flex items-center gap-2 text-chart-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Simulated ({simulationResult.survivalProbability}% survival)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertCircle className="w-3 h-3" />
                      <span>Not simulated (Step 2)</span>
                    </div>
                  )}
                  {evolutionResult ? (
                    <div className="flex items-center gap-2 text-chart-5">
                      <CheckCircle className="w-3 h-3" />
                      <span>Evolved (+{evolutionResult.evolutionSummary.improvementPercent}%)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertCircle className="w-3 h-3" />
                      <span>Not evolved (Step 3)</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Results */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-chart-4" />
                Synthesis Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Warning when no organism */}
              {!organism && (
                <div className="p-4 rounded-lg bg-chart-5/10 border border-chart-5/30 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-chart-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-chart-5">No Organism Sequence</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Please complete Step 1 (DNA Designer) to generate a sequence before creating a synthesis plan.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={runSynthesis}
                disabled={isSynthesizing || !organism}
                className="w-full bg-chart-4 text-white hover:bg-chart-4/90 disabled:opacity-50"
              >
                {isSynthesizing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Synthesis Plan...
                  </>
                ) : !organism ? (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Design Organism First
                  </>
                ) : (
                  <>
                    <Factory className="w-4 h-4 mr-2" />
                    Generate Synthesis Plan
                  </>
                )}
              </Button>

              {/* Progress */}
              {isSynthesizing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Analyzing sequence and planning assembly...</span>
                    <span>{synthesisProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={synthesisProgress} className="h-2" />
                </div>
              )}

              {/* Results */}
              {synthesisResult && (
                <div className="space-y-4 pt-4 border-t border-border">
                  {/* Overview Card */}
                  <div className="p-4 rounded-lg bg-secondary">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-chart-4" />
                        <span className="font-medium">Synthesis Overview</span>
                      </div>
                      <Badge className={getComplexityColor(synthesisResult.synthesisOverview.complexityScore)}>
                        {synthesisResult.synthesisOverview.complexityScore} Complexity
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-background rounded-lg">
                        <Scissors className="w-5 h-5 mx-auto mb-1 text-chart-4" />
                        <div className="text-xl font-bold">{synthesisResult.synthesisOverview.totalFragments}</div>
                        <div className="text-xs text-muted-foreground">Fragments</div>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg">
                        <Beaker className="w-5 h-5 mx-auto mb-1 text-chart-4" />
                        <div className="text-xl font-bold">{synthesisResult.synthesisOverview.estimatedSuccessRate}%</div>
                        <div className="text-xs text-muted-foreground">Success Rate</div>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg">
                        <DollarSign className="w-5 h-5 mx-auto mb-1 text-chart-4" />
                        <div className="text-lg font-bold">{synthesisResult.synthesisOverview.estimatedCost}</div>
                        <div className="text-xs text-muted-foreground">Est. Cost</div>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg">
                        <Clock className="w-5 h-5 mx-auto mb-1 text-chart-4" />
                        <div className="text-lg font-bold">{synthesisResult.synthesisOverview.estimatedTimeline}</div>
                        <div className="text-xs text-muted-foreground">Timeline</div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{synthesisResult.summary}</p>
                  </div>

                  {/* Codon Optimization */}
                  {synthesisResult.codonOptimization && (
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Dna className="w-4 h-4 text-chart-4" />
                        Codon Optimization
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Original CAI:</span>
                          <span className="ml-2 font-mono">{synthesisResult.codonOptimization.originalCAI.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Optimized CAI:</span>
                          <span className="ml-2 font-mono text-chart-4">{synthesisResult.codonOptimization.optimizedCAI.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rare Codons Removed:</span>
                          <span className="ml-2 font-mono">{synthesisResult.codonOptimization.rareCodonsRemoved}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">New GC Content:</span>
                          <span className="ml-2 font-mono">{synthesisResult.codonOptimization.newGCContent}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{synthesisResult.codonOptimization.optimizationNotes}</p>
                    </div>
                  )}

                  {/* Fragments */}
                  {synthesisResult.fragments && synthesisResult.fragments.length > 0 && (
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-chart-4" />
                        DNA Fragments ({synthesisResult.fragments.length})
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {synthesisResult.fragments.map((fragment, i) => (
                          <div 
                            key={i} 
                            className="p-2 rounded bg-secondary/50 flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="font-mono text-xs">
                                {fragment.id}
                              </Badge>
                              <div>
                                <div className="font-medium text-xs">{fragment.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {fragment.startPosition}-{fragment.endPosition} ({fragment.length} bp)
                                </div>
                              </div>
                            </div>
                            <Badge className={getComplexityColor(fragment.synthesisComplexity)}>
                              {fragment.synthesisComplexity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assembly Plan */}
                  {synthesisResult.assemblyPlan && synthesisResult.assemblyPlan.steps.length > 0 && (
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-chart-4" />
                        Assembly Plan
                      </h4>
                      <div className="space-y-2">
                        {synthesisResult.assemblyPlan.steps.map((step, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm">
                            <div className="w-6 h-6 rounded-full bg-chart-4/20 text-chart-4 flex items-center justify-center text-xs font-bold shrink-0">
                              {step.step}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{step.action}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                <span>{step.inputs.join(" + ")}</span>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-chart-4">{step.output}</span>
                                <span className="ml-auto">{step.duration}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-muted-foreground">Vector:</span> {synthesisResult.assemblyPlan.vectorBackbone}</div>
                        <div><span className="text-muted-foreground">Marker:</span> {synthesisResult.assemblyPlan.selectionMarker}</div>
                      </div>
                    </div>
                  )}

                  {/* Quality Control */}
                  {synthesisResult.qualityControl && synthesisResult.qualityControl.length > 0 && (
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-chart-4" />
                        Quality Control Checkpoints
                      </h4>
                      <div className="space-y-2">
                        {synthesisResult.qualityControl.map((qc, i) => (
                          <div key={i} className="flex items-center justify-between text-sm p-2 rounded bg-secondary/30">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  qc.criticalLevel === "Critical" ? "border-destructive text-destructive" :
                                  qc.criticalLevel === "Important" ? "border-chart-5 text-chart-5" :
                                  ""
                                }`}
                              >
                                {qc.criticalLevel}
                              </Badge>
                              <span className="font-medium">{qc.checkpoint}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{qc.method}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Risk Assessment */}
                  {synthesisResult.riskAssessment && (
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-chart-4" />
                        Risk Assessment
                        <Badge className={getComplexityColor(synthesisResult.riskAssessment.overallRisk)}>
                          {synthesisResult.riskAssessment.overallRisk} Risk
                        </Badge>
                      </h4>
                      <div className="space-y-2">
                        {synthesisResult.riskAssessment.risks.slice(0, 4).map((risk, i) => (
                          <div key={i} className="text-sm p-2 rounded bg-secondary/30">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{risk.risk}</span>
                              <div className="flex items-center gap-2 text-xs">
                                <span className={getRiskColor(risk.likelihood)}>L: {risk.likelihood}</span>
                                <span className={getRiskColor(risk.impact)}>I: {risk.impact}</span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">→ {risk.mitigation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vendor Recommendations */}
                  {synthesisResult.vendorRecommendations && synthesisResult.vendorRecommendations.length > 0 && (
                    <div className="p-4 rounded-lg bg-chart-4/5 border border-chart-4/20">
                      <h4 className="font-medium mb-3 flex items-center gap-2 text-chart-4">
                        <Building2 className="w-4 h-4" />
                        Recommended Vendors
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {synthesisResult.vendorRecommendations.filter(v => v.recommended).map((vendor, i) => (
                          <div key={i} className="p-3 rounded bg-background text-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{vendor.vendor}</span>
                              {vendor.recommended && (
                                <Badge className="bg-chart-4/20 text-chart-4 text-xs">Recommended</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{vendor.specialty}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              <span><DollarSign className="w-3 h-3 inline" /> {vendor.estimatedCost}</span>
                              <span><Clock className="w-3 h-3 inline" /> {vendor.turnaround}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Regulatory Notes */}
                  {synthesisResult.regulatoryNotes && synthesisResult.regulatoryNotes.length > 0 && (
                    <div className="p-4 rounded-lg bg-chart-5/5 border border-chart-5/20">
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-chart-5">
                        <FileText className="w-4 h-4" />
                        Regulatory & Biosafety Notes
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {synthesisResult.regulatoryNotes.map((note, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-chart-5">⚠</span>
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}





