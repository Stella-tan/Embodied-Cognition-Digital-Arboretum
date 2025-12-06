"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, Download, Loader2, Info, Eye, Code, Box, ChevronDown, ChevronRight, X, Plus, Sparkles, Search } from "lucide-react"
import { useOrganism } from "@/lib/organism-context"
import { traitCategories, getCategoryByTraitName } from "@/lib/traits-data"
import { TraitInfoDialog } from "@/components/trait-info-dialog"

// Dynamically import 3D components to avoid SSR issues
const TraitVisualizer3D = dynamic(
  () => import("@/components/trait-visualizer-3d").then((mod) => mod.TraitVisualizer3D),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-secondary/50 rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }
)

const GeneticStructure3D = dynamic(
  () => import("@/components/genetic-structure-3d").then((mod) => mod.GeneticStructure3D),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-secondary/50 rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }
)

// Import structure determination logic
import { determineStructureType, structureInfo } from "@/components/genetic-structure-3d"

interface CustomTrait {
  name: string
  gene: string
  description: string
}

export function DNADesigner() {
  const [selectedTraits, setSelectedTraits] = useState<string[]>([])
  const [complexity, setComplexity] = useState([50])
  const [error, setError] = useState<string | null>(null)
  const [hoveredTrait, setHoveredTrait] = useState<string | null>(null)
  const [lastSelectedTrait, setLastSelectedTrait] = useState<string | null>(null) // Track most recently selected
  const [viewMode, setViewMode] = useState<"3d" | "text">("3d")
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["extremophile"])
  
  // Custom traits state
  const [customTraits, setCustomTraits] = useState<CustomTrait[]>([])
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [newCustomTrait, setNewCustomTrait] = useState<CustomTrait>({ name: "", gene: "", description: "" })
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  
  const { organism, setOrganism, isGenerating, setIsGenerating } = useOrganism()

  // Add custom trait
  const addCustomTrait = () => {
    if (newCustomTrait.name.trim() && newCustomTrait.description.trim()) {
      const trait: CustomTrait = {
        name: newCustomTrait.name.trim(),
        gene: newCustomTrait.gene.trim() || "CUSTOM",
        description: newCustomTrait.description.trim(),
      }
      setCustomTraits([...customTraits, trait])
      setSelectedTraits([...selectedTraits, `custom:${trait.name}`])
      setLastSelectedTrait(`custom:${trait.name}`) // Set as most recently selected
      setNewCustomTrait({ name: "", gene: "", description: "" })
      setShowCustomForm(false)
    }
  }

  // Remove custom trait
  const removeCustomTrait = (traitName: string) => {
    setCustomTraits(customTraits.filter((t) => t.name !== traitName))
    setSelectedTraits(selectedTraits.filter((t) => t !== `custom:${traitName}`))
  }

  // Get custom trait by name
  const getCustomTrait = (name: string): CustomTrait | undefined => {
    const cleanName = name.replace("custom:", "")
    return customTraits.find((t) => t.name === cleanName)
  }

  const generateSequence = async () => {
    setIsGenerating(true)
    setError(null)

    // Separate predefined and custom traits for API
    const predefinedTraits = selectedTraits.filter((t) => !t.startsWith("custom:"))
    const selectedCustomTraits = selectedTraits
      .filter((t) => t.startsWith("custom:"))
      .map((t) => getCustomTrait(t.replace("custom:", "")))
      .filter(Boolean) as CustomTrait[]

    try {
      const response = await fetch("/api/generate-dna", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          traits: predefinedTraits,
          customTraits: selectedCustomTraits,
          complexity: complexity[0],
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate DNA")
      }

      if (result.success && result.data) {
        setOrganism({
          sequence: result.data.sequence,
          traits: selectedTraits,
          gcContent: result.data.gcContent,
          length: result.data.length,
          regions: result.data.regions || [],
          analysis: result.data.analysis || {},
          explanation: result.data.explanation || "",
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleTrait = (traitName: string) => {
    setSelectedTraits((prev) => {
      if (prev.includes(traitName)) {
        // Removing trait - update lastSelectedTrait to the previous one if this was it
        const newList = prev.filter((t) => t !== traitName)
        if (lastSelectedTrait === traitName) {
          setLastSelectedTrait(newList.length > 0 ? newList[newList.length - 1] : null)
        }
        return newList
      } else {
        // Adding trait - set as most recently selected
        setLastSelectedTrait(traitName)
        return [...prev, traitName]
      }
    })
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    )
  }

  const removeSelectedTrait = (traitName: string) => {
    setSelectedTraits((prev) => prev.filter((t) => t !== traitName))
  }

  const downloadFasta = () => {
    if (!organism?.sequence) return
    
    const fastaContent = `>Synthetic_Organism_${Date.now()}
; Traits: ${organism.traits.join(", ")}
; GC Content: ${organism.gcContent}%
; Length: ${organism.length} bp
${organism.sequence.match(/.{1,70}/g)?.join("\n") || organism.sequence}`

    const blob = new Blob([fastaContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `organism_${Date.now()}.fasta`
    a.click()
    URL.revokeObjectURL(url)
  }

  const resetDesigner = () => {
    setOrganism(null)
    setError(null)
    setSelectedTraits([])
  }

  // Get selected traits grouped by category for display
  const getSelectedByCategory = () => {
    const grouped: Record<string, string[]> = {}
    selectedTraits.forEach((traitName) => {
      if (traitName.startsWith("custom:")) {
        if (!grouped["custom"]) grouped["custom"] = []
        grouped["custom"].push(traitName)
      } else {
        const category = getCategoryByTraitName(traitName)
        if (category) {
          if (!grouped[category.id]) grouped[category.id] = []
          grouped[category.id].push(traitName)
        }
      }
    })
    return grouped
  }

  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">AI-Powered DNA Blueprint Generator</Badge>
          <h2 className="text-4xl font-bold mb-4">Design Your Organism</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Mix traits from different categories — bacteria, plants, fungi, and more — to create unique synthetic organisms.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Unified Trait Selector with 3D Preview */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border overflow-hidden h-full">
              <CardHeader className="pb-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Eye className="w-4 h-4 text-primary" />
                    Trait Selector
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {selectedTraits.length} selected
                  </Badge>
                </div>
                {/* Search Bar */}
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search traits (e.g., heat, cold, glow)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 text-sm bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </CardHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 h-[500px]">
                {/* Left Side: 3D Visualizer */}
                <div className="border-r border-border bg-gradient-to-br from-secondary/30 to-background p-2 relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className="bg-background/80 backdrop-blur text-xs">
                      {hoveredTrait ? `Preview: ${hoveredTrait}` : "3D Preview"}
                    </Badge>
                  </div>
                  <div className="h-full">
                    <TraitVisualizer3D 
                      selectedTraits={selectedTraits} 
                      activePreview={hoveredTrait}
                      lastSelected={lastSelectedTrait}
                    />
                  </div>
                </div>

                {/* Right Side: Trait List */}
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="p-3 border-b border-border bg-secondary/20">
                    <p className="text-xs text-muted-foreground">
                      {searchQuery ? "Search Results" : "Browse by Category"}
                    </p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {/* Search Results Mode */}
                {searchQuery.trim() !== "" ? (
                  (() => {
                    const query = searchQuery.toLowerCase().trim()
                    
                    // Search through all traits
                    const searchResults = traitCategories.flatMap((category) =>
                      category.traits
                        .filter((trait) =>
                          trait.name.toLowerCase().includes(query) ||
                          trait.description.toLowerCase().includes(query) ||
                          trait.gene.toLowerCase().includes(query) ||
                          trait.chineseName.toLowerCase().includes(query) ||
                          category.name.toLowerCase().includes(query)
                        )
                        .map((trait) => ({ ...trait, category }))
                    )

                    // Also search custom traits
                    const customResults = customTraits.filter((trait) =>
                      trait.name.toLowerCase().includes(query) ||
                      trait.description.toLowerCase().includes(query) ||
                      trait.gene.toLowerCase().includes(query)
                    )

                    const hasResults = searchResults.length > 0 || customResults.length > 0

                    return (
                      <div className="space-y-2">
                        {/* Search Results Header */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border">
                          <span>
                            {hasResults 
                              ? `Found ${searchResults.length + customResults.length} trait${searchResults.length + customResults.length !== 1 ? "s" : ""}`
                              : "No traits found"
                            }
                          </span>
                          {!hasResults && (
                            <span className="text-primary">Create custom trait below ↓</span>
                          )}
                        </div>

                        {/* Predefined Search Results */}
                        {searchResults.map((trait) => (
                          <div
                            key={`${trait.category.id}-${trait.name}`}
                            className={`w-full p-2.5 rounded-lg border text-left transition-all text-sm ${
                              selectedTraits.includes(trait.name)
                                ? "bg-primary/15 border-primary/50"
                                : "bg-secondary/30 border-border hover:border-primary/30"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => toggleTrait(trait.name)}
                                onMouseEnter={() => setHoveredTrait(trait.name)}
                                onMouseLeave={() => setHoveredTrait(null)}
                                className="flex items-center gap-2 flex-1 text-left"
                              >
                                <span className="text-base">{trait.category.icon}</span>
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${trait.color}`} />
                                <div>
                                  <span className="font-medium block text-xs">{trait.name}</span>
                                  <span className="text-[10px] text-muted-foreground">{trait.description}</span>
                                </div>
                              </button>
                              <div className="flex items-center gap-1.5">
                                <TraitInfoDialog 
                                  trait={trait} 
                                  categoryIcon={trait.category.icon}
                                  categoryName={trait.category.name}
                                />
                                <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                                  {trait.gene}
                                </Badge>
                                {selectedTraits.includes(trait.name) && (
                                  <div className="w-2 h-2 bg-primary rounded-full" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Custom Search Results */}
                        {customResults.map((trait) => (
                          <button
                            key={`custom-${trait.name}`}
                            onClick={() => toggleTrait(`custom:${trait.name}`)}
                            className={`w-full p-2.5 rounded-lg border text-left transition-all text-sm ${
                              selectedTraits.includes(`custom:${trait.name}`)
                                ? "bg-primary/15 border-primary/50"
                                : "bg-secondary/30 border-border hover:border-primary/30"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-base shrink-0">✨</span>
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 shrink-0" />
                                <div className="text-left">
                                  <span className="font-medium block text-xs text-left">{trait.name}</span>
                                  <span className="text-[10px] text-muted-foreground text-left block">{trait.description}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                                  {trait.gene}
                                </Badge>
                                {selectedTraits.includes(`custom:${trait.name}`) && (
                                  <div className="w-2 h-2 bg-primary rounded-full" />
                                )}
                              </div>
                            </div>
                          </button>
                        ))}

                        {/* No Results - Show Inline Custom Trait Creator */}
                        {!hasResults && (
                          <div className="mt-2 p-4 rounded-lg border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Create &quot;{searchQuery}&quot;</p>
                                <p className="text-xs text-muted-foreground">as a new custom trait</p>
                              </div>
                            </div>
                            
                            {/* Inline Form */}
                            <div className="space-y-3">
                              <div>
                                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Trait Name</label>
                                <input
                                  type="text"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  placeholder="Trait name"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Gene (Optional)</label>
                                <input
                                  type="text"
                                  value={newCustomTrait.gene}
                                  onChange={(e) => setNewCustomTrait({ ...newCustomTrait, gene: e.target.value })}
                                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  placeholder="e.g., GFP, LUX, CUSTOM"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Description *</label>
                                <textarea
                                  value={newCustomTrait.description}
                                  onChange={(e) => setNewCustomTrait({ ...newCustomTrait, description: e.target.value })}
                                  rows={2}
                                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                  placeholder="Describe what this trait does..."
                                />
                              </div>
                              <div className="flex gap-2 pt-1">
                                <Button
                                  onClick={() => {
                                    if (searchQuery.trim() && newCustomTrait.description.trim()) {
                                      const trait: CustomTrait = {
                                        name: searchQuery.trim(),
                                        gene: newCustomTrait.gene.trim() || "CUSTOM",
                                        description: newCustomTrait.description.trim(),
                                      }
                                      setCustomTraits([...customTraits, trait])
                                      setSelectedTraits([...selectedTraits, `custom:${trait.name}`])
                                      setLastSelectedTrait(`custom:${trait.name}`) // Set as most recently selected
                                      setSearchQuery("")
                                      setNewCustomTrait({ name: "", gene: "", description: "" })
                                    }
                                  }}
                                  disabled={!searchQuery.trim() || !newCustomTrait.description.trim()}
                                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                                  size="sm"
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Create & Select
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSearchQuery("")
                                    setNewCustomTrait({ name: "", gene: "", description: "" })
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()
                ) : (
                  /* Normal Category View */
                  <>
                {traitCategories.map((category) => (
                  <div key={category.id} className="border border-border rounded-lg overflow-hidden">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={`w-full p-3 flex items-center justify-between transition-all ${
                        expandedCategories.includes(category.id)
                          ? "bg-secondary/80"
                          : "bg-secondary/30 hover:bg-secondary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{category.icon}</span>
                        <div className="text-left">
                          <span className="font-medium text-sm block">{category.name}</span>
                          <span className="text-xs text-muted-foreground">{category.chineseName}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedTraits.some((t) => 
                          category.traits.some((ct) => ct.name === t)
                        ) && (
                          <Badge className="bg-primary/20 text-primary text-xs">
                            {selectedTraits.filter((t) => 
                              category.traits.some((ct) => ct.name === t)
                            ).length}
                          </Badge>
                        )}
                        {expandedCategories.includes(category.id) ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Category Traits */}
                    {expandedCategories.includes(category.id) && (
                      <div className="p-2 space-y-1 bg-background/50">
                        {category.traits.map((trait) => (
                          <div
                            key={trait.name}
                            className={`w-full p-2 rounded-md text-left transition-all text-sm ${
                              selectedTraits.includes(trait.name)
                                ? "bg-primary/15 border border-primary/50"
                                : "hover:bg-secondary/80 border border-transparent"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => toggleTrait(trait.name)}
                                onMouseEnter={() => setHoveredTrait(trait.name)}
                                onMouseLeave={() => setHoveredTrait(null)}
                                className="flex items-center gap-2 flex-1 text-left"
                              >
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${trait.color}`} />
                                <div>
                                  <span className="font-medium block text-xs">{trait.name}</span>
                                  <span className="text-[10px] text-muted-foreground">{trait.chineseName}</span>
                                </div>
                              </button>
                              <div className="flex items-center gap-1.5">
                                <TraitInfoDialog 
                                  trait={trait} 
                                  categoryIcon={category.icon}
                                  categoryName={category.name}
                                />
                                <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                                  {trait.gene}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Custom Traits Section */}
                <div className="border border-dashed border-primary/50 rounded-lg overflow-hidden">
                  {/* Custom Category Header */}
                  <button
                    onClick={() => toggleCategory("custom")}
                    className={`w-full p-3 flex items-center justify-between transition-all ${
                      expandedCategories.includes("custom")
                        ? "bg-primary/10"
                        : "bg-primary/5 hover:bg-primary/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">✨</span>
                      <div className="text-left">
                        <span className="font-medium text-sm block">Custom Traits</span>
                        <span className="text-xs text-muted-foreground">自定義特性</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {customTraits.length > 0 && (
                        <Badge className="bg-primary/20 text-primary text-xs">
                          {customTraits.length}
                        </Badge>
                      )}
                      {expandedCategories.includes("custom") ? (
                        <ChevronDown className="w-4 h-4 text-primary" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </button>

                  {/* Custom Traits Content */}
                  {expandedCategories.includes("custom") && (
                    <div className="p-2 space-y-2 bg-background/50">
                      {/* Existing Custom Traits */}
                      {customTraits.map((trait) => (
                        <div
                          key={trait.name}
                          className={`w-full p-2 rounded-md text-left transition-all text-sm ${
                            selectedTraits.includes(`custom:${trait.name}`)
                              ? "bg-primary/15 border border-primary/50"
                              : "bg-secondary/50 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => toggleTrait(`custom:${trait.name}`)}
                              className="flex items-center gap-2 flex-1 text-left"
                            >
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 shrink-0" />
                              <div className="text-left">
                                <span className="font-medium block text-xs text-left">{trait.name}</span>
                                <span className="text-[10px] text-muted-foreground text-left block">{trait.description}</span>
                              </div>
                            </button>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                                {trait.gene}
                              </Badge>
                              <button
                                onClick={() => removeCustomTrait(trait.name)}
                                className="p-1 hover:bg-destructive/20 rounded"
                              >
                                <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Custom Trait Form */}
                      {showCustomForm ? (
                        <div className="p-3 bg-secondary/30 rounded-lg border border-primary/30 space-y-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium">Create Custom Trait</span>
                          </div>
                          <input
                            type="text"
                            placeholder="Trait Name (e.g., Bioluminescence)"
                            value={newCustomTrait.name}
                            onChange={(e) => setNewCustomTrait({ ...newCustomTrait, name: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <input
                            type="text"
                            placeholder="Gene Name (e.g., LUX) - Optional"
                            value={newCustomTrait.gene}
                            onChange={(e) => setNewCustomTrait({ ...newCustomTrait, gene: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <textarea
                            placeholder="Description (e.g., Produces light through enzymatic reaction)"
                            value={newCustomTrait.description}
                            onChange={(e) => setNewCustomTrait({ ...newCustomTrait, description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={addCustomTrait}
                              disabled={!newCustomTrait.name.trim() || !newCustomTrait.description.trim()}
                              className="flex-1 h-8 text-xs bg-primary text-primary-foreground"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Trait
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setShowCustomForm(false)
                                setNewCustomTrait({ name: "", gene: "", description: "" })
                              }}
                              className="h-8 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCustomForm(true)}
                          className="w-full p-3 rounded-md border border-dashed border-primary/30 text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-xs font-medium">Add Custom Trait</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                  </>
                )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Selected Traits + Controls + Generated Sequence */}
          <div className="lg:col-span-1 space-y-6">
            {/* Selected Traits Display */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>Selected Traits ({selectedTraits.length})</span>
                  {selectedTraits.length > 0 && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-muted-foreground text-xs h-7"
                      onClick={() => setSelectedTraits([])}
                    >
                      Clear All
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTraits.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    <p>No traits selected. Choose from categories on the left or create custom traits.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(getSelectedByCategory()).map(([categoryId, traits]) => {
                      // Handle custom traits
                      if (categoryId === "custom") {
                        return (
                          <div key={categoryId}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm">✨</span>
                              <span className="text-xs text-muted-foreground">Custom Traits</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {traits.map((traitName) => {
                                const customTrait = getCustomTrait(traitName.replace("custom:", ""))
                                return (
                                  <Badge
                                    key={traitName}
                                    className="bg-gradient-to-r from-violet-500 to-purple-500 text-white pr-1 flex items-center gap-1"
                                  >
                                    <span className="text-xs">{customTrait?.name || traitName}</span>
                                    <button
                                      onClick={() => removeSelectedTrait(traitName)}
                                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        )
                      }
                      
                      // Handle predefined traits
                      const category = traitCategories.find((c) => c.id === categoryId)
                      if (!category) return null
                      return (
                        <div key={categoryId}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">{category.icon}</span>
                            <span className="text-xs text-muted-foreground">{category.name}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {traits.map((traitName) => {
                              const trait = category.traits.find((t) => t.name === traitName)
                              return (
                                <Badge
                                  key={traitName}
                                  className={`bg-gradient-to-r ${trait?.color || "from-gray-500 to-gray-600"} text-white pr-1 flex items-center gap-1`}
                                >
                                  <span className="text-xs">{traitName}</span>
                                  <button
                                    onClick={() => removeSelectedTrait(traitName)}
                                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Controls */}
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Genetic Complexity</span>
                      <span className="text-primary font-mono">{complexity[0]}%</span>
                    </div>
                    <Slider value={complexity} onValueChange={setComplexity} max={100} step={1} className="w-full" />
                    <p className="text-xs text-muted-foreground">
                      Higher complexity = longer sequences with more regulatory elements
                    </p>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <Button
                      onClick={generateSequence}
                      disabled={isGenerating || selectedTraits.length === 0}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[160px]"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Generate with AI
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={resetDesigner} className="border-border">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generated Sequence */}
            {(() => {
              // Determine structure type based on selected traits
              const autoStructureType = determineStructureType(selectedTraits)
              const currentStructureInfo = structureInfo[autoStructureType]
              
              return (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>Generated Output</span>
                        {/* Structure Type Badge */}
                        <Badge className={`bg-gradient-to-r ${currentStructureInfo.color} text-white text-xs`}>
                          {currentStructureInfo.icon} {currentStructureInfo.name}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* View Mode Toggle */}
                        <div className="flex items-center bg-secondary rounded-lg p-1">
                          <button
                            onClick={() => setViewMode("3d")}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                              viewMode === "3d"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Box className="w-3.5 h-3.5" />
                            3D
                          </button>
                          <button
                            onClick={() => setViewMode("text")}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                              viewMode === "text"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Code className="w-3.5 h-3.5" />
                            Text
                          </button>
                        </div>
                        {organism?.sequence && (
                          <Button size="sm" variant="ghost" className="text-primary" onClick={downloadFasta}>
                            <Download className="w-4 h-4 mr-2" />
                            Export FASTA
                          </Button>
                        )}
                      </div>
                    </CardTitle>
                    {/* Structure Description */}
                    <p className="text-xs text-muted-foreground mt-1">
                      {currentStructureInfo.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {/* 3D View */}
                    {viewMode === "3d" && (
                      <div className="h-[380px] rounded-lg overflow-hidden">
                        <GeneticStructure3D 
                          sequence={organism?.sequence || null}
                          structureType={autoStructureType}
                          isGenerating={isGenerating}
                        />
                      </div>
                    )}

                {/* Text View */}
                {viewMode === "text" && (
                  <div className="bg-background rounded-lg p-4 min-h-[200px] font-mono text-sm overflow-auto max-h-[350px]">
                    {isGenerating ? (
                      <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span>Claude is designing your {currentStructureInfo.name}...</span>
                        <span className="text-xs">Analyzing {selectedTraits.length} traits...</span>
                      </div>
                    ) : organism?.sequence ? (
                      <div className="break-all leading-relaxed">
                        {organism.sequence.split("").map((char, i) => {
                          // Color coding based on structure type
                          const isProtein = autoStructureType === "protein"
                          const isRNA = autoStructureType === "rna"
                          
                          if (isProtein) {
                            // Amino acid coloring
                            const hydrophobic = "AILMFWVP".includes(char)
                            const polar = "STYCNQ".includes(char)
                            const charged = "DEKRH".includes(char)
                            const special = "GP".includes(char)
                            return (
                              <span
                                key={i}
                                className={
                                  hydrophobic ? "text-amber-500" :
                                  polar ? "text-cyan-500" :
                                  charged ? "text-rose-500" :
                                  special ? "text-violet-500" :
                                  "text-muted-foreground"
                                }
                                title={`Position ${i + 1}`}
                              >
                                {char}
                              </span>
                            )
                          }
                          
                          // DNA/RNA coloring
                          return (
                            <span
                              key={i}
                              className={
                                char === "A" ? "text-primary" :
                                char === "T" ? "text-chart-2" :
                                char === "U" ? "text-orange-500" : // RNA Uracil
                                char === "G" ? "text-accent" :
                                char === "C" ? "text-chart-4" :
                                "text-muted-foreground"
                              }
                            >
                              {char}
                            </span>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground gap-2">
                        <div className="text-4xl">{currentStructureInfo.icon}</div>
                        <span>Select traits and generate {currentStructureInfo.name.toLowerCase()} with AI</span>
                      </div>
                    )}
                  </div>
                )}

                {organism?.sequence && (
                  <>
                    {/* Sequence Statistics - adapts to structure type */}
                    <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                      {autoStructureType === "protein" ? (
                        // Protein: show amino acid categories
                        <>
                          <div className="bg-secondary rounded-lg p-3">
                            <div className="text-2xl font-bold text-amber-500">H</div>
                            <div className="text-xs text-muted-foreground">Hydrophobic</div>
                          </div>
                          <div className="bg-secondary rounded-lg p-3">
                            <div className="text-2xl font-bold text-cyan-500">P</div>
                            <div className="text-xs text-muted-foreground">Polar</div>
                          </div>
                          <div className="bg-secondary rounded-lg p-3">
                            <div className="text-2xl font-bold text-rose-500">±</div>
                            <div className="text-xs text-muted-foreground">Charged</div>
                          </div>
                          <div className="bg-secondary rounded-lg p-3">
                            <div className="text-2xl font-bold text-violet-500">{organism.molecularWeight || "~"}</div>
                            <div className="text-xs text-muted-foreground">kDa</div>
                          </div>
                        </>
                      ) : autoStructureType === "rna" ? (
                        // RNA: show A, U, G, C
                        ["A", "U", "G", "C"].map((base) => {
                          const count = organism.sequence.split("").filter((b) => b === base).length
                          const percent = ((count / organism.sequence.length) * 100).toFixed(1)
                          return (
                            <div key={base} className="bg-secondary rounded-lg p-3">
                              <div className={`text-2xl font-bold ${
                                base === "A" ? "text-primary" :
                                base === "U" ? "text-orange-500" :
                                base === "G" ? "text-accent" :
                                "text-chart-4"
                              }`}>
                                {base}
                              </div>
                              <div className="text-xs text-muted-foreground">{percent}%</div>
                            </div>
                          )
                        })
                      ) : (
                        // DNA: show A, T, G, C
                        ["A", "T", "G", "C"].map((base) => {
                          const count = organism.sequence.split("").filter((b) => b === base).length
                          const percent = ((count / organism.sequence.length) * 100).toFixed(1)
                          return (
                            <div key={base} className="bg-secondary rounded-lg p-3">
                              <div className={`text-2xl font-bold ${
                                base === "A" ? "text-primary" :
                                base === "T" ? "text-chart-2" :
                                base === "G" ? "text-accent" :
                                "text-chart-4"
                              }`}>
                                {base}
                              </div>
                              <div className="text-xs text-muted-foreground">{percent}%</div>
                            </div>
                          )
                        })
                      )}
                    </div>

                    {/* Trait Integration Display */}
                    {organism.traitIntegration && organism.traitIntegration.length > 0 && (
                      <div className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Trait Integration Map</span>
                        </div>
                        <div className="space-y-2">
                          {organism.traitIntegration.slice(0, 5).map((integration: { trait: string; location: string; function: string }, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-xs">
                              <Badge variant="outline" className="shrink-0 text-[10px]">
                                {integration.trait}
                              </Badge>
                              <span className="text-muted-foreground">
                                @ {integration.location}: {integration.function}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Explanation */}
                    {organism.explanation && (
                      <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-primary mb-1">AI Design Strategy</p>
                            <p className="text-sm text-muted-foreground">{organism.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Analysis Metrics */}
                    {organism.analysis && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="bg-secondary rounded-lg p-2 text-center">
                          <div className="text-xs text-muted-foreground">Stability</div>
                          <div className="text-sm font-medium capitalize">{organism.analysis.stability}</div>
                        </div>
                        <div className="bg-secondary rounded-lg p-2 text-center">
                          <div className="text-xs text-muted-foreground">Expression</div>
                          <div className="text-sm font-medium capitalize">{organism.analysis.expressionLevel}</div>
                        </div>
                        <div className="bg-secondary rounded-lg p-2 text-center">
                          <div className="text-xs text-muted-foreground">
                            {autoStructureType === "protein" ? "Folding" : "Optimization"}
                          </div>
                          <div className="text-sm font-medium">
                            {autoStructureType === "protein" 
                              ? organism.analysis.foldingPrediction || "N/A"
                              : organism.analysis.codonOptimization || "N/A"
                            }
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
              )
            })()}
          </div>
        </div>
      </div>
    </section>
  )
}
