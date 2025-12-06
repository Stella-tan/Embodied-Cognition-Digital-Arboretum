"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Region {
  name: string;
  start: number;
  end: number;
  description: string;
}

interface Analysis {
  stability: string;
  expressionLevel: string;
  codonOptimization?: string;
  foldingPrediction?: string;
}

interface TraitIntegration {
  trait: string;
  location: string;
  function: string;
}

interface OrganismData {
  sequence: string;
  traits: string[];
  gcContent: number;
  length: number;
  regions: Region[];
  analysis: Analysis;
  explanation: string;
  traitIntegration?: TraitIntegration[];
  molecularWeight?: number;
  structureType?: string;
  structureName?: string;
}

interface SimulationResult {
  survivalProbability: number;
  generationsSimulated: number;
  criticalFactors: {
    factor: string;
    score: number;
    impact: string;
    details: string;
  }[];
  adaptations: {
    generation: number;
    adaptation: string;
    benefit: string;
  }[];
  weaknesses: string[];
  recommendations: string[];
  verdict: string;
  summary: string;
  environment: string;
}

interface FitnessHistoryPoint {
  generation: number;
  avgFitness: number;
  bestFitness: number;
  diversity: number;
}

interface ObjectiveScore {
  objective: string;
  initialScore: number;
  finalScore: number;
  improvement: string;
}

interface KeyMutation {
  generation: number;
  mutation: string;
  effect: string;
  fitnessImpact: number;
  retained: boolean;
}

interface EmergentTrait {
  trait: string;
  generation: number;
  description: string;
  benefit: string;
}

interface TradeOff {
  enhanced: string;
  reduced: string;
  reason: string;
}

interface OptimizedGenome {
  suggestedSequenceChanges: string[];
  newGCContent: number;
  predictedStability: string;
  expressionOptimization: string;
}

interface EvolutionResult {
  evolutionSummary: {
    initialFitness: number;
    finalFitness: number;
    improvementPercent: number;
    convergenceGeneration: number;
    totalMutationsAccepted: number;
    totalMutationsRejected: number;
  };
  fitnessHistory: FitnessHistoryPoint[];
  objectiveScores: ObjectiveScore[];
  keyMutations: KeyMutation[];
  emergentTraits: EmergentTrait[];
  tradeOffs: TradeOff[];
  optimizedGenome: OptimizedGenome;
  recommendations: string[];
  verdict: string;
  summary: string;
}

// Synthesis Types
interface SynthesisFragment {
  id: string;
  name: string;
  startPosition: number;
  endPosition: number;
  length: number;
  gcContent: number;
  synthesisComplexity: string;
  overlapWith: string | null;
  notes: string;
}

interface AssemblyStep {
  step: number;
  action: string;
  inputs: string[];
  output: string;
  duration: string;
}

interface QualityCheckpoint {
  checkpoint: string;
  method: string;
  expectedResult: string;
  criticalLevel: string;
}

interface SynthesisRisk {
  risk: string;
  likelihood: string;
  impact: string;
  mitigation: string;
}

interface VendorRecommendation {
  vendor: string;
  specialty: string;
  estimatedCost: string;
  turnaround: string;
  recommended: boolean;
}

interface SynthesisResult {
  synthesisOverview: {
    totalFragments: number;
    averageFragmentSize: number;
    assemblyMethod: string;
    estimatedSuccessRate: number;
    complexityScore: string;
    estimatedCost: string;
    estimatedTimeline: string;
  };
  codonOptimization: {
    originalCAI: number;
    optimizedCAI: number;
    rareCodonsRemoved: number;
    gcContentAdjusted: boolean;
    newGCContent: number;
    optimizationNotes: string;
  };
  fragments: SynthesisFragment[];
  assemblyPlan: {
    steps: AssemblyStep[];
    finalConstruct: string;
    vectorBackbone: string;
    selectionMarker: string;
  };
  qualityControl: QualityCheckpoint[];
  riskAssessment: {
    overallRisk: string;
    risks: SynthesisRisk[];
  };
  vendorRecommendations: VendorRecommendation[];
  regulatoryNotes: string[];
  summary: string;
}

interface OrganismContextType {
  organism: OrganismData | null;
  setOrganism: (data: OrganismData | null) => void;
  simulationResult: SimulationResult | null;
  setSimulationResult: (result: SimulationResult | null) => void;
  evolutionResult: EvolutionResult | null;
  setEvolutionResult: (result: EvolutionResult | null) => void;
  synthesisResult: SynthesisResult | null;
  setSynthesisResult: (result: SynthesisResult | null) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  isSimulating: boolean;
  setIsSimulating: (value: boolean) => void;
  isEvolving: boolean;
  setIsEvolving: (value: boolean) => void;
  isSynthesizing: boolean;
  setIsSynthesizing: (value: boolean) => void;
}

const OrganismContext = createContext<OrganismContextType | undefined>(
  undefined
);

export function OrganismProvider({ children }: { children: ReactNode }) {
  const [organism, setOrganism] = useState<OrganismData | null>(null);
  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null);
  const [evolutionResult, setEvolutionResult] =
    useState<EvolutionResult | null>(null);
  const [synthesisResult, setSynthesisResult] =
    useState<SynthesisResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isEvolving, setIsEvolving] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  return (
    <OrganismContext.Provider
      value={{
        organism,
        setOrganism,
        simulationResult,
        setSimulationResult,
        evolutionResult,
        setEvolutionResult,
        synthesisResult,
        setSynthesisResult,
        isGenerating,
        setIsGenerating,
        isSimulating,
        setIsSimulating,
        isEvolving,
        setIsEvolving,
        isSynthesizing,
        setIsSynthesizing,
      }}
    >
      {children}
    </OrganismContext.Provider>
  );
}

export function useOrganism() {
  const context = useContext(OrganismContext);
  if (context === undefined) {
    throw new Error("useOrganism must be used within an OrganismProvider");
  }
  return context;
}

// Export types for use in other components
export type {
  OrganismData,
  TraitIntegration,
  Analysis,
  Region,
  SimulationResult,
  EvolutionResult,
  FitnessHistoryPoint,
  ObjectiveScore,
  KeyMutation,
  EmergentTrait,
  TradeOff,
  OptimizedGenome,
  SynthesisResult,
  SynthesisFragment,
  AssemblyStep,
  QualityCheckpoint,
  SynthesisRisk,
  VendorRecommendation,
};
