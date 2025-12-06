"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Float } from "@react-three/drei"
import * as THREE from "three"

// Base pair colors
const baseColors: Record<string, string> = {
  A: "#00ffa3", // Primary green (Adenine)
  T: "#ff6b6b", // Red (Thymine)
  G: "#ffd93d", // Yellow (Guanine)
  C: "#6bcfff", // Blue (Cytosine)
}

// Complementary base pairs
const complementary: Record<string, string> = {
  A: "T",
  T: "A",
  G: "C",
  C: "G",
}

interface BasePairProps {
  base: string
  index: number
  totalBases: number
  helixRadius: number
  verticalSpacing: number
}

function BasePair({ base, index, totalBases, helixRadius, verticalSpacing }: BasePairProps) {
  const complementBase = complementary[base] || "A"
  const angle = (index / totalBases) * Math.PI * 8 // 4 full rotations
  const y = (index - totalBases / 2) * verticalSpacing
  
  // Position for first strand
  const x1 = Math.cos(angle) * helixRadius
  const z1 = Math.sin(angle) * helixRadius
  
  // Position for second strand (opposite side)
  const x2 = Math.cos(angle + Math.PI) * helixRadius
  const z2 = Math.sin(angle + Math.PI) * helixRadius

  return (
    <group>
      {/* First base (main strand) */}
      <mesh position={[x1, y, z1]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={baseColors[base]} 
          emissive={baseColors[base]} 
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Second base (complementary strand) */}
      <mesh position={[x2, y, z2]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={baseColors[complementBase]} 
          emissive={baseColors[complementBase]} 
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Connecting bond (base pair connection) */}
      <mesh position={[(x1 + x2) / 2, y, (z1 + z2) / 2]} rotation={[0, -angle, 0]}>
        <cylinderGeometry args={[0.03, 0.03, helixRadius * 2 - 0.3, 8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.4}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
    </group>
  )
}

interface DNABackboneProps {
  totalBases: number
  helixRadius: number
  verticalSpacing: number
  isSecondStrand?: boolean
}

function DNABackbone({ totalBases, helixRadius, verticalSpacing, isSecondStrand = false }: DNABackboneProps) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i < totalBases; i++) {
      const angle = (i / totalBases) * Math.PI * 8 + (isSecondStrand ? Math.PI : 0)
      const y = (i - totalBases / 2) * verticalSpacing
      const x = Math.cos(angle) * helixRadius
      const z = Math.sin(angle) * helixRadius
      pts.push(new THREE.Vector3(x, y, z))
    }
    return pts
  }, [totalBases, helixRadius, verticalSpacing, isSecondStrand])

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])

  return (
    <mesh>
      <tubeGeometry args={[curve, 100, 0.05, 8, false]} />
      <meshStandardMaterial 
        color={isSecondStrand ? "#7c4dff" : "#00e5ff"} 
        emissive={isSecondStrand ? "#7c4dff" : "#00e5ff"}
        emissiveIntensity={0.3}
        metalness={0.6}
        roughness={0.3}
      />
    </mesh>
  )
}

interface DNAHelixSceneProps {
  sequence: string
}

function DNAHelixScene({ sequence }: DNAHelixSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  // Limit displayed bases for performance (show up to 50 bases)
  const displaySequence = sequence.slice(0, 50)
  const totalBases = displaySequence.length
  const helixRadius = 0.8
  const verticalSpacing = 0.25

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* DNA Backbones */}
        <DNABackbone 
          totalBases={totalBases} 
          helixRadius={helixRadius} 
          verticalSpacing={verticalSpacing} 
        />
        <DNABackbone 
          totalBases={totalBases} 
          helixRadius={helixRadius} 
          verticalSpacing={verticalSpacing} 
          isSecondStrand 
        />
        
        {/* Base pairs */}
        {displaySequence.split("").map((base, index) => (
          <BasePair
            key={index}
            base={base}
            index={index}
            totalBases={totalBases}
            helixRadius={helixRadius}
            verticalSpacing={verticalSpacing}
          />
        ))}
      </Float>
      
      {/* Ambient particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh 
          key={i}
          position={[
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 6
          ]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={0.5}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

function EmptyState() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
        {/* Placeholder DNA outline */}
        <mesh>
          <torusGeometry args={[1, 0.02, 16, 100]} />
          <meshStandardMaterial color="#333" transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1, 0.02, 16, 100]} />
          <meshStandardMaterial color="#333" transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.02, 16, 100]} />
          <meshStandardMaterial color="#333" transparent opacity={0.3} />
        </mesh>
      </Float>
    </group>
  )
}

interface DNASequence3DProps {
  sequence: string | null
  isGenerating?: boolean
}

export function DNASequence3D({ sequence, isGenerating }: DNASequence3DProps) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-background via-secondary/10 to-background border border-border relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#7c4dff" />
        <pointLight position={[10, -10, 5]} intensity={0.3} color="#00ffa3" />
        
        {sequence && !isGenerating ? (
          <DNAHelixScene sequence={sequence} />
        ) : (
          <EmptyState />
        )}
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          minDistance={4} 
          maxDistance={15}
          autoRotate={false}
        />
      </Canvas>
      
      {/* Legend */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="flex gap-3 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-lg border border-border">
          {Object.entries(baseColors).map(([base, color]) => (
            <div key={base} className="flex items-center gap-1.5">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
              />
              <span className="text-xs font-mono">{base}</span>
            </div>
          ))}
        </div>
        <div className="px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-lg border border-border">
          <span className="text-xs text-muted-foreground">
            {sequence ? `${Math.min(sequence.length, 50)} of ${sequence.length} bp shown` : "Drag to rotate"}
          </span>
        </div>
      </div>

      {/* Loading overlay */}
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Generating DNA structure...</p>
          </div>
        </div>
      )}
    </div>
  )
}








