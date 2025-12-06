"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Sun, 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  Dna,
  TrendingUp,
  Shield,
  Lightbulb,
  Plus,
  Pencil,
  X,
  Save,
  Trash2,
  RotateCcw
} from "lucide-react"
import { useOrganism } from "@/lib/organism-context"

interface Environment {
  id: string
  name: string
  temp: number
  pressure: number
  radiation: number
  water: number
  color: string
  challenges: string[]
  isCustom?: boolean
}

const defaultEnvironments: Environment[] = [
  {
    id: "mars",
    name: "Mars Surface",
    temp: -63,
    pressure: 0.6,
    radiation: 0.67,
    water: 0,
    color: "bg-accent",
    challenges: ["Extreme cold", "Low pressure", "High UV radiation", "No liquid water"],
  },
  {
    id: "europa",
    name: "Europa Ocean",
    temp: -160,
    pressure: 1.0,
    radiation: 5.4,
    water: 100,
    color: "bg-chart-2",
    challenges: ["Extreme cold", "High radiation", "Subsurface ocean", "Ice shell"],
  },
  {
    id: "titan",
    name: "Titan Lakes",
    temp: -179,
    pressure: 1.5,
    radiation: 0.01,
    water: 0,
    color: "bg-chart-5",
    challenges: ["Cryogenic temperatures", "Methane lakes", "Dense atmosphere"],
  },
  {
    id: "venus",
    name: "Venus Clouds",
    temp: 30,
    pressure: 1.0,
    radiation: 2.6,
    water: 0,
    color: "bg-chart-4",
    challenges: ["Sulfuric acid", "High UV", "Cloud habitation"],
  },
]

const colorOptions = [
  { value: "bg-accent", label: "Orange" },
  { value: "bg-chart-2", label: "Cyan" },
  { value: "bg-chart-4", label: "Yellow" },
  { value: "bg-chart-5", label: "Pink" },
  { value: "bg-primary", label: "Green" },
  { value: "bg-violet-500", label: "Purple" },
  { value: "bg-rose-500", label: "Rose" },
  { value: "bg-sky-500", label: "Sky" },
]

export function EnvironmentSimulator() {
  const [environments, setEnvironments] = useState<Environment[]>(defaultEnvironments)
  const [selectedEnv, setSelectedEnv] = useState<Environment>(environments[0])
  const [error, setError] = useState<string | null>(null)
  const [simulationProgress, setSimulationProgress] = useState(0)
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false)
  const [editingEnv, setEditingEnv] = useState<Environment | null>(null)
  
  // New environment form
  const [showNewForm, setShowNewForm] = useState(false)
  const [newChallenge, setNewChallenge] = useState("")

  const { organism, simulationResult, setSimulationResult, isSimulating, setIsSimulating } = useOrganism()

  // Start editing an environment
  const startEditing = (env: Environment) => {
    setEditingEnv({ ...env })
    setIsEditing(true)
    setShowNewForm(false)
  }

  // Save edited environment
  const saveEdit = () => {
    if (!editingEnv) return
    
    setEnvironments(prev => 
      prev.map(env => env.id === editingEnv.id ? editingEnv : env)
    )
    
    if (selectedEnv.id === editingEnv.id) {
      setSelectedEnv(editingEnv)
    }
    
    setIsEditing(false)
    setEditingEnv(null)
  }

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false)
    setEditingEnv(null)
  }

  // Start creating new environment
  const startNewEnvironment = () => {
    const newEnv: Environment = {
      id: `custom-${Date.now()}`,
      name: "New Environment",
      temp: 20,
      pressure: 1.0,
      radiation: 1.0,
      water: 50,
      color: "bg-violet-500",
      challenges: [],
      isCustom: true,
    }
    setEditingEnv(newEnv)
    setShowNewForm(true)
    setIsEditing(false)
  }

  // Save new environment
  const saveNewEnvironment = () => {
    if (!editingEnv || !editingEnv.name.trim()) return
    
    setEnvironments(prev => [...prev, editingEnv])
    setSelectedEnv(editingEnv)
    setShowNewForm(false)
    setEditingEnv(null)
  }

  // Delete custom environment
  const deleteEnvironment = (envId: string) => {
    const env = environments.find(e => e.id === envId)
    if (!env?.isCustom) return
    
    setEnvironments(prev => prev.filter(e => e.id !== envId))
    if (selectedEnv.id === envId) {
      setSelectedEnv(environments[0])
    }
  }

  // Reset to default environments
  const resetToDefaults = () => {
    setEnvironments(defaultEnvironments)
    setSelectedEnv(defaultEnvironments[0])
    setIsEditing(false)
    setShowNewForm(false)
    setEditingEnv(null)
  }

  // Add challenge to editing environment
  const addChallenge = () => {
    if (!editingEnv || !newChallenge.trim()) return
    setEditingEnv({
      ...editingEnv,
      challenges: [...editingEnv.challenges, newChallenge.trim()]
    })
    setNewChallenge("")
  }

  // Remove challenge from editing environment
  const removeChallenge = (index: number) => {
    if (!editingEnv) return
    setEditingEnv({
      ...editingEnv,
      challenges: editingEnv.challenges.filter((_, i) => i !== index)
    })
  }

  const runSimulation = async () => {
    setIsSimulating(true)
    setSimulationResult(null)
    setError(null)
    setSimulationProgress(0)

    const progressInterval = setInterval(() => {
      setSimulationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          environment: selectedEnv,
          organism: organism ? {
            sequence: organism.sequence,
            traits: organism.traits,
            gcContent: organism.gcContent,
          } : null,
        }),
      })

      const result = await response.json()

      clearInterval(progressInterval)
      setSimulationProgress(100)

      if (!response.ok) {
        throw new Error(result.error || "Failed to run simulation")
      }

      if (result.success && result.data) {
        setSimulationResult({
          ...result.data,
          environment: selectedEnv.name,
        })
      }
    } catch (err) {
      clearInterval(progressInterval)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSimulating(false)
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "VIABLE":
        return "text-primary bg-primary/10 border-primary/30"
      case "MARGINAL":
        return "text-chart-5 bg-chart-5/10 border-chart-5/30"
      case "NOT_VIABLE":
        return "text-destructive bg-destructive/10 border-destructive/30"
      default:
        return "text-muted-foreground bg-secondary border-border"
    }
  }

  // Render the edit form
  const renderEditForm = () => {
    if (!editingEnv) return null

    return (
      <div className="space-y-4 p-4 bg-secondary/50 rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">
            {showNewForm ? "Create New Environment" : "Edit Environment"}
          </h4>
          <Button size="sm" variant="ghost" onClick={showNewForm ? () => { setShowNewForm(false); setEditingEnv(null); } : cancelEdit}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Environment Name</label>
          <input
            type="text"
            value={editingEnv.name}
            onChange={(e) => setEditingEnv({ ...editingEnv, name: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="e.g., Enceladus Geysers"
          />
        </div>

        {/* Color */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Color</label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => setEditingEnv({ ...editingEnv, color: color.value })}
                className={`w-6 h-6 rounded-full ${color.value} ${
                  editingEnv.color === color.value ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                }`}
                title={color.label}
              />
            ))}
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Temperature</span>
            <span className="text-accent font-mono">{editingEnv.temp}°C</span>
          </div>
          <Slider
            value={[editingEnv.temp]}
            onValueChange={([val]) => setEditingEnv({ ...editingEnv, temp: val })}
            min={-273}
            max={500}
            step={1}
          />
        </div>

        {/* Pressure */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Pressure</span>
            <span className="text-chart-2 font-mono">{editingEnv.pressure} atm</span>
          </div>
          <Slider
            value={[editingEnv.pressure]}
            onValueChange={([val]) => setEditingEnv({ ...editingEnv, pressure: val })}
            min={0}
            max={100}
            step={0.1}
          />
        </div>

        {/* Radiation */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Radiation</span>
            <span className="text-chart-5 font-mono">{editingEnv.radiation} mSv</span>
          </div>
          <Slider
            value={[editingEnv.radiation]}
            onValueChange={([val]) => setEditingEnv({ ...editingEnv, radiation: val })}
            min={0}
            max={100}
            step={0.01}
          />
        </div>

        {/* Water */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Water Availability</span>
            <span className="text-primary font-mono">{editingEnv.water}%</span>
          </div>
          <Slider
            value={[editingEnv.water]}
            onValueChange={([val]) => setEditingEnv({ ...editingEnv, water: val })}
            min={0}
            max={100}
            step={1}
          />
        </div>

        {/* Challenges */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Environmental Challenges</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {editingEnv.challenges.map((challenge, i) => (
              <Badge key={i} variant="outline" className="pr-1 flex items-center gap-1">
                {challenge}
                <button
                  onClick={() => removeChallenge(i)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newChallenge}
              onChange={(e) => setNewChallenge(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addChallenge()}
              className="flex-1 px-3 py-1.5 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Add challenge..."
            />
            <Button size="sm" variant="outline" onClick={addChallenge} disabled={!newChallenge.trim()}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            onClick={showNewForm ? saveNewEnvironment : saveEdit}
            disabled={!editingEnv.name.trim()}
            className="flex-1 bg-primary text-primary-foreground"
          >
            <Save className="w-3 h-3 mr-1" />
            {showNewForm ? "Create Environment" : "Save Changes"}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={showNewForm ? () => { setShowNewForm(false); setEditingEnv(null); } : cancelEdit}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-chart-2/20 text-chart-2 border-chart-2/30">AI-Powered Digital Twin Simulator</Badge>
          <h2 className="text-4xl font-bold mb-4">Planetary Environment Simulation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Test your AI-generated organism against extreme extraterrestrial conditions using Claude&apos;s analysis.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="bg-card border-border lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Select Environment</CardTitle>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={resetToDefaults}
                    className="h-7 w-7 p-0"
                    title="Reset to defaults"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Environment List */}
              {environments.map((env) => (
                <div key={env.id}>
                  <div
                    className={`relative group rounded-lg border transition-all ${
                      selectedEnv.id === env.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <button
                      onClick={() => {
                        setSelectedEnv(env)
                        setSimulationResult(null)
                        setIsEditing(false)
                        setShowNewForm(false)
                      }}
                      className="w-full p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${env.color}`} />
                        <span className="font-medium">{env.name}</span>
                        {env.isCustom && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            Custom
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {env.temp}°C • {env.pressure} atm
                      </div>
                    </button>
                    
                    {/* Edit/Delete buttons */}
                    <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          startEditing(env)
                        }}
                        className="p-1.5 rounded hover:bg-secondary"
                        title="Edit"
                      >
                        <Pencil className="w-3 h-3 text-muted-foreground" />
                      </button>
                      {env.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteEnvironment(env.id)
                          }}
                          className="p-1.5 rounded hover:bg-destructive/20"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Inline Edit Form - appears right after the environment being edited */}
                  {isEditing && editingEnv?.id === env.id && (
                    <div className="mt-2">
                      {renderEditForm()}
                    </div>
                  )}
                </div>
              ))}

              {/* Add New Environment Button */}
              {!showNewForm && !isEditing && (
                <button
                  onClick={startNewEnvironment}
                  className="w-full p-4 rounded-lg border border-dashed border-primary/50 text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add Custom Environment</span>
                </button>
              )}

              {/* New Environment Form - appears at the bottom */}
              {showNewForm && renderEditForm()}

              {/* Organism Status */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Dna className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Organism Status</span>
                </div>
                {organism ? (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Traits: {organism.traits.join(", ")}</div>
                    <div>Sequence: {organism.length} bp</div>
                    <div>GC Content: {organism.gcContent}%</div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No organism designed yet. Use the DNA Designer above to create one.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedEnv.name} Conditions</span>
                <div className="flex items-center gap-2">
                  {selectedEnv.isCustom && (
                    <Badge variant="outline" className="text-xs">Custom</Badge>
                  )}
                  <Badge variant="outline" className={`${selectedEnv.color} bg-opacity-20`}>
                    Active
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-secondary rounded-lg p-4">
                  <Thermometer className="w-5 h-5 text-accent mb-2" />
                  <div className="text-2xl font-bold">{selectedEnv.temp}°C</div>
                  <div className="text-xs text-muted-foreground">Temperature</div>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <Wind className="w-5 h-5 text-chart-2 mb-2" />
                  <div className="text-2xl font-bold">{selectedEnv.pressure} atm</div>
                  <div className="text-xs text-muted-foreground">Pressure</div>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <Sun className="w-5 h-5 text-chart-5 mb-2" />
                  <div className="text-2xl font-bold">{selectedEnv.radiation} mSv</div>
                  <div className="text-xs text-muted-foreground">Radiation</div>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <Droplets className="w-5 h-5 text-primary mb-2" />
                  <div className="text-2xl font-bold">{selectedEnv.water}%</div>
                  <div className="text-xs text-muted-foreground">Water</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-accent" />
                  Environmental Challenges
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEnv.challenges.length > 0 ? (
                    selectedEnv.challenges.map((challenge) => (
                      <Badge key={challenge} variant="outline" className="border-accent/50 text-accent">
                        {challenge}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No challenges defined</span>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="border-t border-border pt-6">
                {/* Warning when no organism */}
                {!organism && (
                  <div className="mb-4 p-4 rounded-lg bg-chart-5/10 border border-chart-5/30 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-chart-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-chart-5">No Organism Designed</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Please use the DNA Designer above to create an organism before running simulations.
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={runSimulation}
                  disabled={isSimulating || !organism}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Running AI Simulation...
                    </>
                  ) : !organism ? (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Design Organism First
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Survival Simulation
                    </>
                  )}
                </Button>

                {isSimulating && (
                  <div className="mt-4 space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Claude is simulating 1000 generations...
                    </div>
                    <Progress value={simulationProgress} className="h-2" />
                  </div>
                )}

                {simulationResult && (
                  <div className="mt-6 space-y-4">
                    {/* Main Result */}
                    <div className="p-4 rounded-lg bg-secondary">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {simulationResult.survivalProbability >= 70 ? (
                            <CheckCircle className="w-6 h-6 text-primary" />
                          ) : simulationResult.survivalProbability >= 40 ? (
                            <AlertTriangle className="w-6 h-6 text-chart-5" />
                          ) : (
                            <AlertTriangle className="w-6 h-6 text-destructive" />
                          )}
                          <span className="font-medium text-lg">Survival Probability</span>
                        </div>
                        <span
                          className={`text-3xl font-bold ${
                            simulationResult.survivalProbability >= 70
                              ? "text-primary"
                              : simulationResult.survivalProbability >= 40
                                ? "text-chart-5"
                                : "text-destructive"
                          }`}
                        >
                          {simulationResult.survivalProbability}%
                        </span>
                      </div>

                      <Badge className={`mb-3 ${getVerdictColor(simulationResult.verdict)}`}>
                        {simulationResult.verdict}
                      </Badge>

                      <p className="text-sm text-muted-foreground">{simulationResult.summary}</p>
                    </div>

                    {/* Critical Factors */}
                    {simulationResult.criticalFactors && simulationResult.criticalFactors.length > 0 && (
                      <div className="p-4 rounded-lg bg-card border border-border">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-chart-2" />
                          Critical Factors
                        </h4>
                        <div className="space-y-2">
                          {simulationResult.criticalFactors.slice(0, 4).map((factor, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{factor.factor}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={factor.score} className="w-20 h-2" />
                                <span
                                  className={`font-mono ${
                                    factor.impact === "positive"
                                      ? "text-primary"
                                      : factor.impact === "negative"
                                        ? "text-destructive"
                                        : "text-muted-foreground"
                                  }`}
                                >
                                  {factor.score}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Weaknesses */}
                    {simulationResult.weaknesses && simulationResult.weaknesses.length > 0 && (
                      <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                        <h4 className="font-medium mb-2 flex items-center gap-2 text-destructive">
                          <Shield className="w-4 h-4" />
                          Identified Weaknesses
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {simulationResult.weaknesses.map((weakness, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-destructive">•</span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {simulationResult.recommendations && simulationResult.recommendations.length > 0 && (
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <h4 className="font-medium mb-2 flex items-center gap-2 text-primary">
                          <Lightbulb className="w-4 h-4" />
                          AI Recommendations
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {simulationResult.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary">→</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

