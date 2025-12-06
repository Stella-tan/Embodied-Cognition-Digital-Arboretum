"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Torus, Text } from "@react-three/drei"
import * as THREE from "three"

// Base pair colors
const baseColors: Record<string, string> = {
  A: "#00ffa3", // Adenine - Green
  T: "#ff6b6b", // Thymine - Red  
  U: "#ff9f43", // Uracil - Orange (RNA)
  G: "#ffd93d", // Guanine - Yellow
  C: "#6bcfff", // Cytosine - Blue
}

// Amino acid colors for protein
const aminoColors = [
  "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3",
  "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a",
  "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722",
]

// ============================================
// DNA DOUBLE HELIX STRUCTURE
// ============================================
function DNAHelixStructure({ sequence }: { sequence: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const displaySequence = sequence.slice(0, 60)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const complementary: Record<string, string> = { A: "T", T: "A", G: "C", C: "G" }

  return (
    <group ref={groupRef}>
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* DNA Backbone strands */}
        {[0, Math.PI].map((offset, strandIndex) => {
          const points: THREE.Vector3[] = []
          for (let i = 0; i < displaySequence.length; i++) {
            const angle = (i / displaySequence.length) * Math.PI * 6 + offset
            const y = (i - displaySequence.length / 2) * 0.15
            points.push(new THREE.Vector3(Math.cos(angle) * 0.6, y, Math.sin(angle) * 0.6))
          }
          const curve = new THREE.CatmullRomCurve3(points)
          return (
            <mesh key={strandIndex}>
              <tubeGeometry args={[curve, 100, 0.04, 8, false]} />
              <meshStandardMaterial 
                color={strandIndex === 0 ? "#00e5ff" : "#7c4dff"} 
                emissive={strandIndex === 0 ? "#00e5ff" : "#7c4dff"}
                emissiveIntensity={0.3}
              />
            </mesh>
          )
        })}

        {/* Base pairs */}
        {displaySequence.split("").map((base, i) => {
          const angle = (i / displaySequence.length) * Math.PI * 6
          const y = (i - displaySequence.length / 2) * 0.15
          const comp = complementary[base] || "A"
          
          return (
            <group key={i}>
              {/* First base */}
              <Sphere args={[0.08, 12, 12]} position={[Math.cos(angle) * 0.6, y, Math.sin(angle) * 0.6]}>
                <meshStandardMaterial color={baseColors[base]} emissive={baseColors[base]} emissiveIntensity={0.5} />
              </Sphere>
              {/* Second base */}
              <Sphere args={[0.08, 12, 12]} position={[Math.cos(angle + Math.PI) * 0.6, y, Math.sin(angle + Math.PI) * 0.6]}>
                <meshStandardMaterial color={baseColors[comp]} emissive={baseColors[comp]} emissiveIntensity={0.5} />
              </Sphere>
              {/* Connection */}
              {i % 3 === 0 && (
                <mesh position={[0, y, 0]} rotation={[0, -angle, 0]}>
                  <cylinderGeometry args={[0.015, 0.015, 1.1, 8]} />
                  <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
                </mesh>
              )}
            </group>
          )
        })}
      </Float>
      <pointLight position={[0, 0, 3]} intensity={1} color="#00e5ff" />
    </group>
  )
}

// ============================================
// RNA SINGLE STRAND WITH HAIRPIN LOOPS
// ============================================
function RNAStructure({ sequence }: { sequence: string }) {
  const groupRef = useRef<THREE.Group>(null)
  // Convert T to U for RNA
  const rnaSequence = sequence.slice(0, 80).replace(/T/g, "U")
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })

  // Create a winding single strand with hairpin loops
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const len = rnaSequence.length
    for (let i = 0; i < len; i++) {
      const t = i / len
      // Create a path with loops (hairpin structure)
      const loopPhase = Math.sin(t * Math.PI * 4) * 0.5
      const x = Math.sin(t * Math.PI * 3) * (0.8 + loopPhase * 0.3)
      const y = (t - 0.5) * 4
      const z = Math.cos(t * Math.PI * 3) * (0.8 + loopPhase * 0.3)
      pts.push(new THREE.Vector3(x, y, z))
    }
    return pts
  }, [rnaSequence.length])

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])

  return (
    <group ref={groupRef}>
      <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.2}>
        {/* RNA Backbone */}
        <mesh>
          <tubeGeometry args={[curve, 150, 0.035, 8, false]} />
          <meshStandardMaterial color="#ff9800" emissive="#f57c00" emissiveIntensity={0.4} />
        </mesh>

        {/* Nucleotide bases along the strand */}
        {rnaSequence.split("").map((base, i) => {
          if (i >= points.length) return null
          const pos = points[i]
          // Extend base outward from backbone
          const outward = new THREE.Vector3(pos.x, 0, pos.z).normalize().multiplyScalar(0.15)
          return (
            <group key={i}>
              <Sphere args={[0.06, 8, 8]} position={[pos.x + outward.x, pos.y, pos.z + outward.z]}>
                <meshStandardMaterial color={baseColors[base]} emissive={baseColors[base]} emissiveIntensity={0.6} />
              </Sphere>
              {/* Connection to backbone */}
              <mesh position={[pos.x + outward.x / 2, pos.y, pos.z + outward.z / 2]}>
                <cylinderGeometry args={[0.01, 0.01, 0.15, 6]} />
                <meshStandardMaterial color="#ffcc80" transparent opacity={0.6} />
              </mesh>
            </group>
          )
        })}

        {/* Hairpin loop regions (secondary structure) */}
        {[0.25, 0.5, 0.75].map((t, i) => {
          const idx = Math.floor(t * points.length)
          if (idx >= points.length) return null
          const pos = points[idx]
          return (
            <Torus key={i} args={[0.15, 0.03, 12, 24]} position={[pos.x, pos.y, pos.z]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#ffab40" emissive="#ff9100" emissiveIntensity={0.5} transparent opacity={0.7} />
            </Torus>
          )
        })}

        {/* 5' and 3' end markers */}
        <Sphere args={[0.12, 16, 16]} position={[points[0].x, points[0].y - 0.2, points[0].z]}>
          <meshStandardMaterial color="#4caf50" emissive="#2e7d32" emissiveIntensity={0.8} />
        </Sphere>
        <Sphere args={[0.12, 16, 16]} position={[points[points.length - 1].x, points[points.length - 1].y + 0.2, points[points.length - 1].z]}>
          <meshStandardMaterial color="#f44336" emissive="#c62828" emissiveIntensity={0.8} />
        </Sphere>
      </Float>
      <pointLight position={[0, 0, 3]} intensity={1} color="#ff9800" />
    </group>
  )
}

// ============================================
// PROTEIN FOLDED STRUCTURE
// ============================================
function ProteinStructure({ sequence }: { sequence: string }) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.12
    }
  })

  // Simulate amino acid chain (every 3 bases = 1 amino acid)
  const aminoCount = Math.floor(sequence.length / 3)
  const displayCount = Math.min(aminoCount, 40)

  // Generate protein folding path with alpha helices and beta sheets
  const foldingPath = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i < displayCount; i++) {
      const t = i / displayCount
      // Complex folding pattern
      const helixPhase = Math.sin(t * Math.PI * 6) * 0.4
      const sheetPhase = Math.cos(t * Math.PI * 2) * 0.3
      const x = helixPhase + Math.sin(t * Math.PI * 2) * 0.6
      const y = (t - 0.5) * 3 + sheetPhase
      const z = Math.cos(t * Math.PI * 6) * 0.4 + Math.cos(t * Math.PI * 2) * 0.6
      pts.push(new THREE.Vector3(x, y, z))
    }
    return pts
  }, [displayCount])

  const curve = useMemo(() => new THREE.CatmullRomCurve3(foldingPath), [foldingPath])

  return (
    <group ref={groupRef}>
      <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Protein backbone */}
        <mesh>
          <tubeGeometry args={[curve, 100, 0.06, 12, false]} />
          <MeshDistortMaterial
            color="#e91e63"
            emissive="#c2185b"
            emissiveIntensity={0.3}
            roughness={0.4}
            metalness={0.3}
            distort={0.1}
            speed={1}
          />
        </mesh>

        {/* Amino acid residues */}
        {foldingPath.map((pos, i) => (
          <group key={i}>
            <Sphere args={[0.1, 12, 12]} position={[pos.x, pos.y, pos.z]}>
              <meshStandardMaterial 
                color={aminoColors[i % aminoColors.length]} 
                emissive={aminoColors[i % aminoColors.length]}
                emissiveIntensity={0.4}
                metalness={0.5}
                roughness={0.3}
              />
            </Sphere>
          </group>
        ))}

        {/* Alpha helix regions (spiral ribbons) */}
        {[0.2, 0.6].map((t, i) => {
          const idx = Math.floor(t * foldingPath.length)
          const pos = foldingPath[Math.min(idx, foldingPath.length - 1)]
          return (
            <mesh key={i} position={[pos.x, pos.y, pos.z]} rotation={[0, t * Math.PI * 2, 0]}>
              <torusGeometry args={[0.2, 0.04, 8, 24, Math.PI * 1.5]} />
              <meshStandardMaterial color="#ff4081" emissive="#f50057" emissiveIntensity={0.5} />
            </mesh>
          )
        })}

        {/* Beta sheet regions (flat arrows) */}
        {[0.4, 0.8].map((t, i) => {
          const idx = Math.floor(t * foldingPath.length)
          const pos = foldingPath[Math.min(idx, foldingPath.length - 1)]
          return (
            <mesh key={i} position={[pos.x, pos.y, pos.z]} rotation={[Math.PI / 2, t * Math.PI, 0]}>
              <boxGeometry args={[0.4, 0.02, 0.2]} />
              <meshStandardMaterial color="#7c4dff" emissive="#651fff" emissiveIntensity={0.5} />
            </mesh>
          )
        })}

        {/* Active site (highlighted region) */}
        <Sphere args={[0.25, 16, 16]} position={[foldingPath[Math.floor(foldingPath.length / 2)].x, foldingPath[Math.floor(foldingPath.length / 2)].y, foldingPath[Math.floor(foldingPath.length / 2)].z]}>
          <meshStandardMaterial color="#76ff03" emissive="#64dd17" emissiveIntensity={0.6} transparent opacity={0.4} />
        </Sphere>
      </Float>
      <pointLight position={[2, 2, 2]} intensity={1} color="#e91e63" />
      <pointLight position={[-2, -2, 2]} intensity={0.5} color="#7c4dff" />
    </group>
  )
}

// ============================================
// PLASMID CIRCULAR DNA
// ============================================
function PlasmidStructure({ sequence }: { sequence: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const displayLength = Math.min(sequence.length, 100)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  const complementary: Record<string, string> = { A: "T", T: "A", G: "C", C: "G" }

  return (
    <group ref={groupRef}>
      <Float speed={0.5} rotationIntensity={0.15} floatIntensity={0.2}>
        {/* Main circular DNA backbone - double strand */}
        {[0, 0.15].map((offset, strandIndex) => (
          <Torus key={strandIndex} args={[1.2 + offset, 0.04, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial 
              color={strandIndex === 0 ? "#00e5ff" : "#7c4dff"} 
              emissive={strandIndex === 0 ? "#00b8d4" : "#651fff"}
              emissiveIntensity={0.4}
            />
          </Torus>
        ))}

        {/* Base pairs around the circle */}
        {Array.from({ length: Math.min(displayLength, 36) }).map((_, i) => {
          const angle = (i / 36) * Math.PI * 2
          const base = sequence[i % sequence.length]
          const comp = complementary[base] || "A"
          const innerRadius = 1.2
          const outerRadius = 1.35
          
          return (
            <group key={i}>
              {/* Inner base */}
              <Sphere args={[0.06, 8, 8]} position={[Math.cos(angle) * innerRadius, 0, Math.sin(angle) * innerRadius]}>
                <meshStandardMaterial color={baseColors[base]} emissive={baseColors[base]} emissiveIntensity={0.6} />
              </Sphere>
              {/* Outer base */}
              <Sphere args={[0.06, 8, 8]} position={[Math.cos(angle) * outerRadius, 0, Math.sin(angle) * outerRadius]}>
                <meshStandardMaterial color={baseColors[comp]} emissive={baseColors[comp]} emissiveIntensity={0.6} />
              </Sphere>
              {/* Connection */}
              {i % 2 === 0 && (
                <mesh position={[Math.cos(angle) * (innerRadius + 0.075), 0, Math.sin(angle) * (innerRadius + 0.075)]} rotation={[Math.PI / 2, angle, 0]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.12, 6]} />
                  <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
                </mesh>
              )}
            </group>
          )
        })}

        {/* Origin of Replication (oriC) marker */}
        <group position={[1.27, 0.3, 0]}>
          <Sphere args={[0.12, 16, 16]}>
            <meshStandardMaterial color="#4caf50" emissive="#2e7d32" emissiveIntensity={0.8} />
          </Sphere>
        </group>

        {/* Antibiotic resistance gene marker */}
        <group position={[-1.27, 0.3, 0]}>
          <Sphere args={[0.12, 16, 16]}>
            <meshStandardMaterial color="#ff9800" emissive="#f57c00" emissiveIntensity={0.8} />
          </Sphere>
        </group>

        {/* Multiple Cloning Site (MCS) */}
        <group position={[0, 0.3, 1.27]}>
          <Sphere args={[0.12, 16, 16]}>
            <meshStandardMaterial color="#9c27b0" emissive="#7b1fa2" emissiveIntensity={0.8} />
          </Sphere>
        </group>

        {/* Insert gene region (highlighted arc) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.27, 0.08, 8, 32, Math.PI / 2]} />
          <meshStandardMaterial color="#ffeb3b" emissive="#fdd835" emissiveIntensity={0.5} transparent opacity={0.6} />
        </mesh>

        {/* Supercoiling effect (twisted torus) */}
        <mesh rotation={[Math.PI / 2 + 0.2, 0.1, 0]} position={[0, -0.1, 0]}>
          <torusGeometry args={[1.27, 0.02, 8, 100]} />
          <meshStandardMaterial color="#b2ebf2" transparent opacity={0.3} />
        </mesh>
      </Float>
      <pointLight position={[0, 2, 2]} intensity={1} color="#00e5ff" />
      <pointLight position={[0, -2, 2]} intensity={0.5} color="#7c4dff" />
    </group>
  )
}

// ============================================
// EMPTY STATE
// ============================================
function EmptyState({ structureType }: { structureType: string }) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  const getPlaceholder = () => {
    switch (structureType) {
      case "rna":
        return { color: "#ff9800", shape: "wave" }
      case "protein":
        return { color: "#e91e63", shape: "fold" }
      case "plasmid":
        return { color: "#00e5ff", shape: "circle" }
      default:
        return { color: "#7c4dff", shape: "helix" }
    }
  }

  const { color } = getPlaceholder()

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
        <Torus args={[1, 0.02, 16, 100]}>
          <meshStandardMaterial color={color} transparent opacity={0.3} />
        </Torus>
        <Torus args={[1, 0.02, 16, 100]} rotation={[Math.PI / 4, 0, 0]}>
          <meshStandardMaterial color={color} transparent opacity={0.3} />
        </Torus>
        <Torus args={[1, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={color} transparent opacity={0.3} />
        </Torus>
      </Float>
    </group>
  )
}

// ============================================
// STRUCTURE TYPE DETERMINATION
// ============================================
export function determineStructureType(traits: string[]): "dna" | "rna" | "protein" | "plasmid" {
  // Traits that suggest specific structure types - updated for expanded categories
  
  // PLASMID: Bacterial/synthetic engineered constructs
  const plasmidTraits = [
    // Extremophile (bacterial)
    "Thermophilic", "Radioresistance", "Halophilic", "Acidophilic", "Barophilic",
    "Psychrophilic", "Desiccation Resistance", "Alkaliphilic",
    // Synthetic/Engineered
    "Biosensor (Arsenic)", "Bioplastic (PHA)", "Heavy Metal Bioremediation", "Biofuel Production",
    "CRISPR Self-Repair", "Quorum Sensing", "Genetic Kill Switch", "Carbon Capture Enhanced",
    // Chemosynthetic (bacterial)
    "Sulfur Oxidation", "Iron Oxidation", "Hydrogen Metabolism", "Methane Oxidation",
    "Ammonia Oxidation", "Arsenite Oxidation",
    // Immune (bacterial CRISPR)
    "CRISPR Immunity",
  ]
  
  // PROTEIN: Structural proteins, enzymes, toxins
  const proteinTraits = [
    // Animal structural proteins
    "Spider Silk", "Antifreeze Proteins", "Limb Regeneration",
    "Venomous Bite", "Echolocation", "Hibernation",
    // Plant stress proteins
    "Drought Resistance", "UV-B Protection", "Salinity Tolerance",
    // Marine proteins
    "Bioluminescence", "Electric Organ", "Ink Production", "Chromatophore System",
    // Insect proteins
    "Exoskeleton", "Venom Synthesis", "Super Strength", "Flight Muscles",
    // Fungal enzymes
    "Lignin Decomposition", "Antibiotic Production", "Plastic Degradation",
    // Immune proteins
    "Antimicrobial Peptides", "Oxidative Burst", "Hypersensitive Response",
    // Neural proteins
    "Electroreception", "Distributed Neural Network", "Rapid Learning",
  ]
  
  // RNA: Gene expression, regulatory, rapid response
  const rnaTraits = [
    // Plant gene expression
    "Rapid Cell Division", "C4 Photosynthesis", "CAM Photosynthesis", "Nitrogen Fixation",
    "Deep Root System",
    // Insect development
    "Metamorphosis", "Pheromone Communication", "Hive Mind Behavior",
    // Fungal
    "Mycelium Network", "Mycorrhizal Symbiosis", "Spore Dormancy", "Psychedelic Compounds",
    // Marine development
    "Coral Symbiosis", "Osmoregulation", "Jet Propulsion",
    // Animal sensory/behavioral
    "Infrared Vision", "Magnetic Navigation", "Camouflage",
    // Neural/sensory
    "Compound Eyes", "Photoreceptor Diversity", "Magnetoreception", "Lateral Line System",
    // Immune RNA
    "Antiviral RNA Silencing", "Systemic Acquired Resistance",
  ]
  
  // DNA: Default for general/mixed or plant genomic traits
  const dnaTraits = [
    // Plant genomic
    "Salinity Tolerance",
    // Marine genomic
    "Pressure Adaptation",
    // General
  ]

  // Count matches for each type
  let plasmidScore = 0
  let proteinScore = 0
  let rnaScore = 0
  let dnaScore = 0

  traits.forEach((trait) => {
    const cleanTrait = trait.replace("custom:", "")
    if (plasmidTraits.includes(cleanTrait)) plasmidScore += 1
    if (proteinTraits.includes(cleanTrait)) proteinScore += 1
    if (rnaTraits.includes(cleanTrait)) rnaScore += 1
    if (dnaTraits.includes(cleanTrait)) dnaScore += 1
  })

  // Custom traits default to protein (most versatile visualization)
  const customCount = traits.filter((t) => t.startsWith("custom:")).length
  proteinScore += customCount * 0.5

  // Determine winner
  const maxScore = Math.max(plasmidScore, proteinScore, rnaScore, dnaScore)
  
  if (maxScore === 0) return "dna" // Default
  if (plasmidScore === maxScore) return "plasmid"
  if (proteinScore === maxScore) return "protein"
  if (rnaScore === maxScore) return "rna"
  
  return "dna"
}

// Structure info for display
export const structureInfo = {
  dna: {
    name: "DNA Double Helix",
    chineseName: "DNA雙螺旋",
    icon: "🧬",
    description: "Classic B-form DNA structure for genetic storage",
    color: "from-cyan-500 to-purple-500",
  },
  rna: {
    name: "RNA Structure",
    chineseName: "RNA結構",
    icon: "📜",
    description: "Single-stranded RNA with secondary hairpin structures",
    color: "from-orange-500 to-amber-500",
  },
  protein: {
    name: "Protein Fold",
    chineseName: "蛋白質折疊",
    icon: "🔮",
    description: "3D folded protein with alpha helices and beta sheets",
    color: "from-pink-500 to-purple-500",
  },
  plasmid: {
    name: "Circular Plasmid",
    chineseName: "環狀質粒",
    icon: "🌀",
    description: "Circular DNA for bacterial genetic engineering",
    color: "from-cyan-500 to-blue-500",
  },
}

// ============================================
// MAIN COMPONENT
// ============================================
interface GeneticStructure3DProps {
  sequence: string | null
  structureType: "dna" | "rna" | "protein" | "plasmid"
  isGenerating?: boolean
}

export function GeneticStructure3D({ sequence, structureType, isGenerating }: GeneticStructure3DProps) {
  const info = structureInfo[structureType]

  const renderStructure = () => {
    if (!sequence || isGenerating) {
      return <EmptyState structureType={structureType} />
    }

    switch (structureType) {
      case "rna":
        return <RNAStructure sequence={sequence} />
      case "protein":
        return <ProteinStructure sequence={sequence} />
      case "plasmid":
        return <PlasmidStructure sequence={sequence} />
      default:
        return <DNAHelixStructure sequence={sequence} />
    }
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-background via-secondary/10 to-background border border-border relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
        {renderStructure()}
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          minDistance={3} 
          maxDistance={10}
        />
      </Canvas>
      
      {/* Structure type indicator */}
      <div className="absolute top-3 left-3 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <span className="text-lg">{info.icon}</span>
          <div>
            <span className="text-xs font-medium block">{info.name}</span>
            <span className="text-[10px] text-muted-foreground">{info.chineseName}</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="flex gap-2 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-lg border border-border">
          {structureType === "rna" ? (
            <>
              {["A", "U", "G", "C"].map((base) => (
                <div key={base} className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: baseColors[base] }} />
                  <span className="text-[10px] font-mono">{base}</span>
                </div>
              ))}
            </>
          ) : structureType === "protein" ? (
            <span className="text-[10px] text-muted-foreground">Amino acids colored by position</span>
          ) : (
            <>
              {["A", "T", "G", "C"].map((base) => (
                <div key={base} className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: baseColors[base] }} />
                  <span className="text-[10px] font-mono">{base}</span>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-lg border border-border">
          <span className="text-[10px] text-muted-foreground">Drag to rotate</span>
        </div>
      </div>

      {/* Loading overlay */}
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Generating {info.name}...</p>
          </div>
        </div>
      )}
    </div>
  )
}


