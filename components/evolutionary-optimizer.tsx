"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { 
  Sparkles, 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  Dna,
  TrendingUp,
  Zap,
  Target,
  GitBranch,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  BarChart3,
  Shuffle,
  Shield,
  Lightbulb,
  RefreshCw
} from "lucide-react"
import { useOrganism, EvolutionResult, FitnessHistoryPoint } from "@/lib/organism-context"

const optimizationObjectives = [
  { id: "survival", name: "Survival Rate", icon: Shield, description: "Maximize organism longevity" },
  { id: "reproduction", name: "Reproduction Efficiency", icon: GitBranch, description: "Optimize reproductive success" },
  { id: "energy", name: "Energy Efficiency", icon: Zap, description: "Minimize metabolic costs" },
  { id: "adaptation", name: "Adaptation Speed", icon: RefreshCw, description: "Faster environmental adaptation" },
  { id: "stability", name: "Genetic Stability", icon: Dna, description: "Reduce harmful mutations" },
  { id: "expression", name: "Gene Expression", icon: TrendingUp, description: "Optimize protein production" },
]

export function EvolutionaryOptimizer() {
  const [populationSize, setPopulationSize] = useState([500])
  const [generations, setGenerations] = useState([100])
  const [mutationRate, setMutationRate] = useState([5])
  const [selectionPressure, setSelectionPressure] = useState([70])
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>(["survival", "energy"])
  const [error, setError] = useState<string | null>(null)
  const [evolutionProgress, setEvolutionProgress] = useState(0)
  const [currentGeneration, setCurrentGeneration] = useState(0)

  const { 
    organism, 
    simulationResult, 
    evolutionResult, 
    setEvolutionResult, 
    isEvolving, 
    setIsEvolving 
  } = useOrganism()

  const toggleObjective = (objectiveId: string) => {
    setSelectedObjectives(prev => 
      prev.includes(objectiveId)
        ? prev.filter(o => o !== objectiveId)
        : [...prev, objectiveId]
    )
  }

  const runEvolution = async () => {
    if (selectedObjectives.length === 0) {
      setError("Please select at least one optimization objective")
      return
    }

    setIsEvolving(true)
    setEvolutionResult(null)
    setError(null)
    setEvolutionProgress(0)
    setCurrentGeneration(0)

    // Simulate progress through generations
    const progressInterval = setInterval(() => {
      setEvolutionProgress((prev) => {
        const newProgress = prev + 2
        setCurrentGeneration(Math.floor((newProgress / 100) * generations[0]))
        if (newProgress >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return newProgress
      })
    }, 150)

    try {
      const response = await fetch("/api/evolve", {
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
            populationSize: populationSize[0],
            generations: generations[0],
            mutationRate: mutationRate[0] / 100,
            selectionPressure: selectionPressure[0],
            objectives: selectedObjectives.map(id => 
              optimizationObjectives.find(o => o.id === id)?.name || id
            ),
            targetEnvironment: simulationResult?.environment,
          },
          simulationResult: simulationResult ? {
            environment: simulationResult.environment,
            weaknesses: simulationResult.weaknesses,
            survivalProbability: simulationResult.survivalProbability,
          } : null,
        }),
      })

      const result = await response.json()

      clearInterval(progressInterval)
      setEvolutionProgress(100)
      setCurrentGeneration(generations[0])

      if (!response.ok) {
        throw new Error(result.error || "Failed to run evolution")
      }

      if (result.success && result.data) {
        setEvolutionResult(result.data as EvolutionResult)
      }
    } catch (err) {
      clearInterval(progressInterval)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsEvolving(false)
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "OPTIMIZED":
        return "text-primary bg-primary/10 border-primary/30"
      case "PARTIALLY_OPTIMIZED":
        return "text-chart-5 bg-chart-5/10 border-chart-5/30"
      case "STUCK_LOCAL_MINIMUM":
        return "text-destructive bg-destructive/10 border-destructive/30"
      default:
        return "text-muted-foreground bg-secondary border-border"
    }
  }

  const getEffectIcon = (effect: string) => {
    switch (effect) {
      case "positive":
        return <ArrowUpRight className="w-3 h-3 text-primary" />
      case "negative":
        return <ArrowDownRight className="w-3 h-3 text-destructive" />
      default:
        return <Minus className="w-3 h-3 text-muted-foreground" />
    }
  }

  // Mini fitness chart component
  const FitnessChart = ({ data }: { data: FitnessHistoryPoint[] }) => {
    if (!data || data.length === 0) return null
    
    const maxFitness = Math.max(...data.map(d => d.bestFitness))
    const minFitness = Math.min(...data.map(d => d.avgFitness))
    const range = maxFitness - minFitness || 1
    
    return (
      <div className="h-32 flex items-end gap-1 p-4 bg-secondary/30 rounded-lg">
        {data.map((point, i) => {
          const avgHeight = ((point.avgFitness - minFitness) / range) * 100
          const bestHeight = ((point.bestFitness - minFitness) / range) * 100
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center gap-0.5 h-20">
                <div 
                  className="w-2 bg-primary/50 rounded-t transition-all"
                  style={{ height: `${avgHeight}%` }}
                  title={`Avg: ${point.avgFitness.toFixed(1)}`}
                />
                <div 
                  className="w-2 bg-primary rounded-t transition-all"
                  style={{ height: `${bestHeight}%` }}
                  title={`Best: ${point.bestFitness.toFixed(1)}`}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">
                G{point.generation}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-chart-5/20 text-chart-5 border-chart-5/30">
            AI-Powered Genetic Algorithm
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Evolutionary Optimization</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simulate millions of generations to optimize your organism&apos;s genome using AI-driven evolutionary algorithms.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Evolution Parameters */}
          <Card className="bg-card border-border lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="w-5 h-5 text-chart-5" />
                Evolution Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Population Size */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Population Size</span>
                  <span className="text-chart-5 font-mono">{populationSize[0]}</span>
                </div>
                <Slider 
                  value={populationSize} 
                  onValueChange={setPopulationSize} 
                  min={100} 
                  max={1000} 
                  step={50} 
                />
                <p className="text-xs text-muted-foreground">
                  Larger populations = more genetic diversity
                </p>
              </div>

              {/* Generations */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Generations</span>
                  <span className="text-chart-5 font-mono">{generations[0]}</span>
                </div>
                <Slider 
                  value={generations} 
                  onValueChange={setGenerations} 
                  min={50} 
                  max={500} 
                  step={25} 
                />
                <p className="text-xs text-muted-foreground">
                  More generations = deeper optimization
                </p>
              </div>

              {/* Mutation Rate */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mutation Rate</span>
                  <span className="text-chart-5 font-mono">{mutationRate[0]}%</span>
                </div>
                <Slider 
                  value={mutationRate} 
                  onValueChange={setMutationRate} 
                  min={1} 
                  max={20} 
                  step={1} 
                />
                <p className="text-xs text-muted-foreground">
                  Higher rates explore more, lower rates refine
                </p>
              </div>

              {/* Selection Pressure */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Selection Pressure</span>
                  <span className="text-chart-5 font-mono">{selectionPressure[0]}%</span>
                </div>
                <Slider 
                  value={selectionPressure} 
                  onValueChange={setSelectionPressure} 
                  min={30} 
                  max={95} 
                  step={5} 
                />
                <p className="text-xs text-muted-foreground">
                  Higher pressure = faster convergence, less diversity
                </p>
              </div>

              {/* Organism Status */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Dna className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Organism Status</span>
                </div>
                {organism ? (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-primary" />
                      <span>{organism.traits.length} traits selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-primary" />
                      <span>{organism.length} bp sequence</span>
                    </div>
                    {simulationResult && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-chart-2" />
                        <span>Simulated in {simulationResult.environment}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-chart-5" />
                    <span>Design an organism first (Step 1)</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Objectives & Results */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-chart-5" />
                Optimization Objectives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Objective Selection */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {optimizationObjectives.map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => toggleObjective(obj.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedObjectives.includes(obj.id)
                        ? "border-chart-5 bg-chart-5/10"
                        : "border-border hover:border-chart-5/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <obj.icon className={`w-4 h-4 ${
                        selectedObjectives.includes(obj.id) ? "text-chart-5" : "text-muted-foreground"
                      }`} />
                      <span className="font-medium text-sm">{obj.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{obj.description}</p>
                  </button>
                ))}
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  {error}
                </div>
              )}

              {/* Warning when no organism */}
              {!organism && (
                <div className="p-4 rounded-lg bg-chart-5/10 border border-chart-5/30 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-chart-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-chart-5">No Organism Designed</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Please use the DNA Designer (Step 1) to create an organism before running evolutionary optimization.
                    </p>
                  </div>
                </div>
              )}

              {/* Run Button */}
              <Button
                onClick={runEvolution}
                disabled={isEvolving || !organism || selectedObjectives.length === 0}
                className="w-full bg-chart-5 text-white hover:bg-chart-5/90 disabled:opacity-50"
              >
                {isEvolving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Evolving Generation {currentGeneration}/{generations[0]}...
                  </>
                ) : !organism ? (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Design Organism First
                  </>
                ) : selectedObjectives.length === 0 ? (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Select Objectives
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Run Evolutionary Optimization
                  </>
                )}
              </Button>

              {/* Progress */}
              {isEvolving && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Simulating {populationSize[0]} individuals...</span>
                    <span>{evolutionProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={evolutionProgress} className="h-2" />
                </div>
              )}

              {/* Results */}
              {evolutionResult && (
                <div className="space-y-4 pt-4 border-t border-border">
                  {/* Summary Card */}
                  <div className="p-4 rounded-lg bg-secondary">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-chart-5" />
                        <span className="font-medium">Evolution Summary</span>
                      </div>
                      <Badge className={getVerdictColor(evolutionResult.verdict)}>
                        {evolutionResult.verdict.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-muted-foreground">
                          {evolutionResult.evolutionSummary.initialFitness}%
                        </div>
                        <div className="text-xs text-muted-foreground">Initial Fitness</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-chart-5">
                          {evolutionResult.evolutionSummary.finalFitness}%
                        </div>
                        <div className="text-xs text-muted-foreground">Final Fitness</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${
                          evolutionResult.evolutionSummary.improvementPercent > 0 
                            ? "text-primary" 
                            : "text-destructive"
                        }`}>
                          +{evolutionResult.evolutionSummary.improvementPercent}%
                        </div>
                        <div className="text-xs text-muted-foreground">Improvement</div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{evolutionResult.summary}</p>
                  </div>

                  {/* Fitness History Chart */}
                  {evolutionResult.fitnessHistory && evolutionResult.fitnessHistory.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-chart-5" />
                        Fitness Over Generations
                      </h4>
                      <FitnessChart data={evolutionResult.fitnessHistory} />
                      <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-primary/50 rounded" /> Avg Fitness
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-primary rounded" /> Best Fitness
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Objective Scores */}
                  {evolutionResult.objectiveScores && evolutionResult.objectiveScores.length > 0 && (
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-chart-5" />
                        Objective Scores
                      </h4>
                      <div className="space-y-3">
                        {evolutionResult.objectiveScores.map((score, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{score.objective}</span>
                              <span className="font-mono">
                                <span className="text-muted-foreground">{score.initialScore}</span>
                                <span className="mx-1">→</span>
                                <span className="text-chart-5">{score.finalScore}</span>
                              </span>
                            </div>
                            <Progress 
                              value={score.finalScore} 
                              className="h-1.5" 
                            />
                            <p className="text-xs text-muted-foreground">{score.improvement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Mutations */}
                  {evolutionResult.keyMutations && evolutionResult.keyMutations.length > 0 && (
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-chart-5" />
                        Key Mutations
                      </h4>
                      <div className="space-y-2">
                        {evolutionResult.keyMutations.slice(0, 5).map((mutation, i) => (
                          <div 
                            key={i} 
                            className={`p-2 rounded text-sm flex items-start gap-2 ${
                              mutation.retained ? "bg-primary/5" : "bg-destructive/5"
                            }`}
                          >
                            {getEffectIcon(mutation.effect)}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{mutation.mutation}</span>
                                <span className="text-xs text-muted-foreground">
                                  Gen {mutation.generation}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    mutation.fitnessImpact > 0 
                                      ? "text-primary border-primary/30" 
                                      : mutation.fitnessImpact < 0 
                                        ? "text-destructive border-destructive/30"
                                        : ""
                                  }`}
                                >
                                  {mutation.fitnessImpact > 0 ? "+" : ""}{mutation.fitnessImpact}% fitness
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {mutation.retained ? "Retained" : "Rejected"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Emergent Traits */}
                  {evolutionResult.emergentTraits && evolutionResult.emergentTraits.length > 0 && (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <h4 className="font-medium mb-3 flex items-center gap-2 text-primary">
                        <Sparkles className="w-4 h-4" />
                        Emergent Traits
                      </h4>
                      <div className="space-y-3">
                        {evolutionResult.emergentTraits.map((trait, i) => (
                          <div key={i} className="text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{trait.trait}</span>
                              <Badge variant="outline" className="text-xs">
                                Gen {trait.generation}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-xs mt-1">{trait.description}</p>
                            <p className="text-primary text-xs mt-1">✓ {trait.benefit}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trade-offs */}
                  {evolutionResult.tradeOffs && evolutionResult.tradeOffs.length > 0 && (
                    <div className="p-4 rounded-lg bg-chart-5/5 border border-chart-5/20">
                      <h4 className="font-medium mb-3 flex items-center gap-2 text-chart-5">
                        <Shuffle className="w-4 h-4" />
                        Evolutionary Trade-offs
                      </h4>
                      <div className="space-y-2">
                        {evolutionResult.tradeOffs.map((tradeoff, i) => (
                          <div key={i} className="text-sm flex items-center gap-2">
                            <span className="text-primary">↑ {tradeoff.enhanced}</span>
                            <span className="text-muted-foreground">⟷</span>
                            <span className="text-destructive">↓ {tradeoff.reduced}</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              ({tradeoff.reason})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {evolutionResult.recommendations && evolutionResult.recommendations.length > 0 && (
                    <div className="p-4 rounded-lg bg-chart-5/5 border border-chart-5/20">
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-chart-5">
                        <Lightbulb className="w-4 h-4" />
                        AI Recommendations
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {evolutionResult.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-chart-5">→</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Optimized Genome Info */}
                  {evolutionResult.optimizedGenome && (
                    <div className="p-4 rounded-lg bg-secondary">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Dna className="w-4 h-4 text-chart-5" />
                        Optimized Genome Profile
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">GC Content:</span>
                          <span className="ml-2 font-mono">{evolutionResult.optimizedGenome.newGCContent}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stability:</span>
                          <span className="ml-2 capitalize">{evolutionResult.optimizedGenome.predictedStability}</span>
                        </div>
                      </div>
                      {evolutionResult.optimizedGenome.suggestedSequenceChanges && (
                        <div className="mt-3">
                          <span className="text-xs text-muted-foreground">Suggested Changes:</span>
                          <ul className="mt-1 space-y-1">
                            {evolutionResult.optimizedGenome.suggestedSequenceChanges.slice(0, 3).map((change, i) => (
                              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                                <span className="text-chart-5">•</span>
                                {change}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
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





