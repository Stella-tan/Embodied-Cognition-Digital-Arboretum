"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Torus, Box, Icosahedron, Cone, Cylinder } from "@react-three/drei"
import * as THREE from "three"

// ============================================
// EXTREMOPHILE TRAITS (6)
// ============================================

// Thermophilic - Heat Shock Protein (HSP70) - Barrel chaperone with heat effects
function ThermophilicModel() {
  const groupRef = useRef<THREE.Group>(null)
  const flameRefs = useRef<THREE.Mesh[]>([])
  const coreRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.PointLight>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25
    }
    // Animate flames rising
    flameRefs.current.forEach((flame, i) => {
      if (flame) {
        const offset = i * 0.5
        flame.position.y = -0.5 + Math.sin(state.clock.elapsedTime * 2 + offset) * 0.3 + (state.clock.elapsedTime * 0.5 + offset) % 2
        flame.scale.setScalar(1 - ((state.clock.elapsedTime * 0.5 + offset) % 2) * 0.4)
        if (flame.position.y > 1.5) {
          flame.position.y = -0.5
        }
      }
    })
    // Pulsing core
    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1
      coreRef.current.scale.setScalar(pulse)
    }
    // Pulsing light
    if (glowRef.current) {
      glowRef.current.intensity = 3 + Math.sin(state.clock.elapsedTime * 4) * 1
    }
  })

  // HSP70 barrel structure (GroEL-like chaperonin)
  const barrelSegments = useMemo(() => {
    const segments: { y: number; radius: number; color: string }[] = []
    for (let i = 0; i < 7; i++) {
      const y = (i - 3) * 0.2
      const radius = 0.5 + Math.sin((i / 6) * Math.PI) * 0.15
      const temp = i / 6
      // Temperature gradient: red (hot) to orange to yellow
      const r = 255
      const g = Math.floor(100 + temp * 100)
      const b = Math.floor(temp * 50)
      segments.push({ y, radius, color: `rgb(${r},${g},${b})` })
    }
    return segments
  }, [])

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        {/* HSP70 Barrel Structure - Chaperonin */}
        {barrelSegments.map((seg, i) => (
          <group key={i}>
            {/* Ring of the barrel */}
            <Torus args={[seg.radius, 0.08, 16, 32]} position={[0, seg.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial 
                color={seg.color} 
                emissive={seg.color}
                emissiveIntensity={0.4}
                metalness={0.6}
                roughness={0.3}
              />
            </Torus>
            {/* Vertical supports */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
              <mesh key={j} position={[Math.cos((j / 8) * Math.PI * 2) * seg.radius, seg.y, Math.sin((j / 8) * Math.PI * 2) * seg.radius]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="#ff8a65" emissive="#ff5722" emissiveIntensity={0.5} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Inner glowing core - substrate binding domain */}
        <mesh ref={coreRef}>
          <Sphere args={[0.25, 32, 32]}>
            <MeshDistortMaterial
              color="#ffeb3b"
              emissive="#ff9800"
              emissiveIntensity={1}
              roughness={0.1}
              metalness={0.2}
              distort={0.4}
              speed={4}
            />
          </Sphere>
        </mesh>

        {/* Heat waves / flames rising */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh
            key={i}
            ref={(el) => { if (el) flameRefs.current[i] = el }}
            position={[
              Math.cos((i / 12) * Math.PI * 2) * 0.7,
              -0.5 + (i % 3) * 0.3,
              Math.sin((i / 12) * Math.PI * 2) * 0.7
            ]}
          >
            <coneGeometry args={[0.08, 0.25, 8]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#ff5722" : "#ff9800"} 
              emissive={i % 2 === 0 ? "#f44336" : "#ff5722"}
              emissiveIntensity={0.8}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}

        {/* Outer heat aura */}
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial 
            color="#ff6e40" 
            transparent 
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>

        {/* ATP binding sites (HSP70 uses ATP) */}
        {[0, 1, 2].map((i) => (
          <group key={i} position={[Math.cos((i / 3) * Math.PI * 2) * 0.4, 0.5, Math.sin((i / 3) * Math.PI * 2) * 0.4]}>
            <Sphere args={[0.08, 8, 8]}>
              <meshStandardMaterial color="#76ff03" emissive="#64dd17" emissiveIntensity={0.8} />
            </Sphere>
            {/* ATP phosphate groups */}
            <Sphere args={[0.04, 8, 8]} position={[0.1, 0, 0]}>
              <meshStandardMaterial color="#ffeb3b" emissive="#ffc107" emissiveIntensity={1} />
            </Sphere>
            <Sphere args={[0.04, 8, 8]} position={[0.15, 0.05, 0]}>
              <meshStandardMaterial color="#ffeb3b" emissive="#ffc107" emissiveIntensity={1} />
            </Sphere>
          </group>
        ))}

        {/* Temperature indicator particles */}
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2
          const radius = 1.2 + Math.random() * 0.3
          const y = (Math.random() - 0.5) * 1.5
          return (
            <Sphere key={i} args={[0.03, 6, 6]} position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}>
              <meshStandardMaterial 
                color={y > 0 ? "#ffeb3b" : "#ff5722"} 
                emissive={y > 0 ? "#ffc107" : "#e64a19"}
                emissiveIntensity={0.9}
                transparent
                opacity={0.7}
              />
            </Sphere>
          )
        })}
      </Float>
      
      {/* Dynamic lighting */}
      <pointLight ref={glowRef} position={[0, 0, 0]} intensity={3} color="#ff5722" distance={6} />
      <pointLight position={[0, 1.5, 0]} intensity={1.5} color="#ffeb3b" distance={4} />
      <pointLight position={[0, -1.5, 0]} intensity={1} color="#ff3d00" distance={4} />
    </group>
  )
}

// Radioresistance - RecA DNA Repair - Double helix with repair proteins
function RadioresistanceModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  const helixPoints = useMemo(() => {
    const points1: THREE.Vector3[] = []
    const points2: THREE.Vector3[] = []
    for (let i = 0; i < 50; i++) {
      const t = i / 50 * Math.PI * 4
      const y = (i / 50 - 0.5) * 3
      points1.push(new THREE.Vector3(Math.cos(t) * 0.5, y, Math.sin(t) * 0.5))
      points2.push(new THREE.Vector3(Math.cos(t + Math.PI) * 0.5, y, Math.sin(t + Math.PI) * 0.5))
    }
    return { points1, points2 }
  }, [])

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(helixPoints.points1.flatMap(p => [p.x, p.y, p.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#7c4dff" linewidth={2} />
        </line>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(helixPoints.points2.flatMap(p => [p.x, p.y, p.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#448aff" linewidth={2} />
        </line>
        {Array.from({ length: 10 }).map((_, i) => {
          const t = (i / 10) * Math.PI * 4
          const y = (i / 10 - 0.5) * 3
          return (
            <mesh key={i} position={[0, y, 0]} rotation={[0, t, 0]}>
              <boxGeometry args={[1, 0.05, 0.1]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#69f0ae" : "#ffab40"} emissive={i % 2 === 0 ? "#00e676" : "#ff9100"} emissiveIntensity={0.3} />
            </mesh>
          )
        })}
        <Sphere args={[0.2, 16, 16]} position={[0.3, 0.5, 0.3]}>
          <meshStandardMaterial color="#76ff03" emissive="#76ff03" emissiveIntensity={1} />
        </Sphere>
        <Sphere args={[0.15, 16, 16]} position={[-0.2, -0.3, -0.2]}>
          <meshStandardMaterial color="#76ff03" emissive="#76ff03" emissiveIntensity={1} />
        </Sphere>
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#7c4dff" distance={5} />
    </group>
  )
}

// Psychrophilic - Antifreeze Protein (AFP) - Ice crystal structure
function PsychrophilicModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
        <Icosahedron args={[0.7, 0]}>
          <meshStandardMaterial
            color="#e3f2fd"
            emissive="#64b5f6"
            emissiveIntensity={0.3}
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.8}
          />
        </Icosahedron>
        <Icosahedron args={[1.2, 0]}>
          <meshStandardMaterial color="#bbdefb" transparent opacity={0.3} wireframe />
        </Icosahedron>
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 2.5]}>
            <octahedronGeometry args={[0.08, 0]} />
            <meshStandardMaterial color="#e1f5fe" emissive="#4fc3f7" emissiveIntensity={0.5} transparent opacity={0.7} />
          </mesh>
        ))}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0, 0]} rotation={[0, (i * Math.PI * 2) / 3, Math.PI / 4]}>
            <cylinderGeometry args={[0.03, 0.03, 1.8, 8]} />
            <meshStandardMaterial color="#00bcd4" emissive="#00acc1" emissiveIntensity={0.5} />
          </mesh>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1.5} color="#4fc3f7" distance={5} />
    </group>
  )
}

// Halophilic - Osmotic Stress Protein - Salt crystal/ion channel
function HalophilicModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <Torus args={[0.6, 0.15, 16, 32]}>
          <meshStandardMaterial color="#ffb74d" emissive="#ff9800" emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
        </Torus>
        <Torus args={[0.6, 0.15, 16, 32]} position={[0, 0.4, 0]}>
          <meshStandardMaterial color="#ffb74d" emissive="#ff9800" emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
        </Torus>
        <Torus args={[0.6, 0.15, 16, 32]} position={[0, -0.4, 0]}>
          <meshStandardMaterial color="#ffb74d" emissive="#ff9800" emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
        </Torus>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[Math.cos((i * Math.PI) / 2) * 0.6, 0, Math.sin((i * Math.PI) / 2) * 0.6]}>
            <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
            <meshStandardMaterial color="#ffe0b2" emissive="#ffb74d" emissiveIntensity={0.3} />
          </mesh>
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <Sphere key={i} args={[0.1, 8, 8]} position={[(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2]}>
            <meshStandardMaterial color={i % 2 === 0 ? "#ffd54f" : "#81c784"} emissive={i % 2 === 0 ? "#ffca28" : "#66bb6a"} emissiveIntensity={0.8} />
          </Sphere>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#ffb74d" distance={5} />
    </group>
  )
}

// Acidophilic - Proton Pump ATPase - Molecular motor
function AcidophilicModel() {
  const groupRef = useRef<THREE.Group>(null)
  const rotorRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    if (rotorRef.current) {
      rotorRef.current.rotation.y = state.clock.elapsedTime * 3
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.8, 0.9, 0.3, 32]} />
          <meshStandardMaterial color="#f06292" emissive="#ec407a" emissiveIntensity={0.3} metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh ref={rotorRef} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 1.5, 16]} />
          <meshStandardMaterial color="#ce93d8" emissive="#ba68c8" emissiveIntensity={0.5} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0.3, 0]} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
            <boxGeometry args={[0.8, 0.1, 0.15]} />
            <meshStandardMaterial color="#e1bee7" emissive="#ce93d8" emissiveIntensity={0.4} />
          </mesh>
        ))}
        <Sphere args={[0.25, 16, 16]} position={[0, 0.9, 0]}>
          <meshStandardMaterial color="#f48fb1" emissive="#f06292" emissiveIntensity={0.5} />
        </Sphere>
        {Array.from({ length: 6 }).map((_, i) => (
          <Sphere key={i} args={[0.06, 8, 8]} position={[Math.sin(i) * 0.3, -0.5 + i * 0.2, Math.cos(i) * 0.3]}>
            <meshStandardMaterial color="#ffeb3b" emissive="#fdd835" emissiveIntensity={1} />
          </Sphere>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#f06292" distance={5} />
    </group>
  )
}

// Barophilic - High Pressure Protein - Compressed sphere structure
function BarophilicModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
      // Pulsing compression effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      groupRef.current.scale.set(scale, 1 / scale, scale)
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Compressed core */}
        <Sphere args={[0.6, 32, 32]}>
          <meshStandardMaterial color="#607d8b" emissive="#455a64" emissiveIntensity={0.5} metalness={0.9} roughness={0.2} />
        </Sphere>
        {/* Pressure rings */}
        {[0, 1, 2, 3].map((i) => (
          <Torus key={i} args={[0.8 + i * 0.15, 0.03, 16, 50]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#90a4ae" emissive="#78909c" emissiveIntensity={0.3} transparent opacity={0.7 - i * 0.15} />
          </Torus>
        ))}
        {/* Compression arrows */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI) / 3, 0]}>
            <Cone args={[0.1, 0.3, 8]} position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#b0bec5" emissive="#78909c" emissiveIntensity={0.5} />
            </Cone>
          </group>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#607d8b" distance={5} />
    </group>
  )
}

// ============================================
// PLANT TRAITS (6)
// ============================================

// C4 Photosynthesis - PEPC enzyme with CO2 molecules
function C4PhotosynthesisModel() {
  const groupRef = useRef<THREE.Group>(null)
  const leafRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    if (leafRef.current) {
      leafRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Chloroplast structure */}
        <mesh>
          <capsuleGeometry args={[0.4, 1, 16, 32]} />
          <meshStandardMaterial color="#4caf50" emissive="#2e7d32" emissiveIntensity={0.4} transparent opacity={0.8} />
        </mesh>
        {/* Internal thylakoid stacks */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} position={[0, -0.4 + i * 0.2, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
            <meshStandardMaterial color="#81c784" emissive="#66bb6a" emissiveIntensity={0.5} />
          </mesh>
        ))}
        {/* CO2 molecules */}
        {Array.from({ length: 6 }).map((_, i) => (
          <group key={i} position={[Math.cos(i * 1.05) * 1.2, Math.sin(i * 0.8) * 1.2, Math.cos(i * 0.5) * 0.5]}>
            <Sphere args={[0.08, 8, 8]}>
              <meshStandardMaterial color="#ffeb3b" emissive="#fdd835" emissiveIntensity={0.8} />
            </Sphere>
            <Sphere args={[0.05, 8, 8]} position={[0.12, 0, 0]}>
              <meshStandardMaterial color="#f44336" emissive="#e53935" emissiveIntensity={0.8} />
            </Sphere>
            <Sphere args={[0.05, 8, 8]} position={[-0.12, 0, 0]}>
              <meshStandardMaterial color="#f44336" emissive="#e53935" emissiveIntensity={0.8} />
            </Sphere>
          </group>
        ))}
        {/* Sun rays */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[0, 1.5, 0]} rotation={[0, 0, (i * Math.PI) / 4]}>
            <boxGeometry args={[0.03, 0.4, 0.03]} />
            <meshStandardMaterial color="#ffeb3b" emissive="#ffc107" emissiveIntensity={1} />
          </mesh>
        ))}
      </Float>
      <pointLight position={[0, 2, 0]} intensity={2} color="#ffeb3b" distance={5} />
      <pointLight position={[0, 0, 2]} intensity={1} color="#4caf50" distance={5} />
    </group>
  )
}

// Drought Resistance - DREB protein with water molecules
function DroughtResistanceModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Root-like structure */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.3, 1.5, 8]} />
          <meshStandardMaterial color="#8d6e63" emissive="#6d4c41" emissiveIntensity={0.3} />
        </mesh>
        {/* Branch roots */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[Math.cos((i * Math.PI) / 2) * 0.3, -0.3, Math.sin((i * Math.PI) / 2) * 0.3]} rotation={[0.5, (i * Math.PI) / 2, 0]}>
            <cylinderGeometry args={[0.05, 0.1, 0.8, 8]} />
            <meshStandardMaterial color="#a1887f" emissive="#8d6e63" emissiveIntensity={0.3} />
          </mesh>
        ))}
        {/* Water droplets being retained */}
        {Array.from({ length: 10 }).map((_, i) => (
          <Sphere key={i} args={[0.08, 8, 8]} position={[(Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 1.5]}>
            <meshStandardMaterial color="#4fc3f7" emissive="#29b6f6" emissiveIntensity={0.6} transparent opacity={0.7} />
          </Sphere>
        ))}
        {/* Protective membrane */}
        <Sphere args={[1.2, 16, 16]}>
          <meshStandardMaterial color="#ffcc80" transparent opacity={0.2} wireframe />
        </Sphere>
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#8d6e63" distance={5} />
    </group>
  )
}

// Nitrogen Fixation - nifH nitrogenase with N2 molecules
function NitrogenFixationModel() {
  const groupRef = useRef<THREE.Group>(null)
  const enzymeRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    if (enzymeRef.current) {
      enzymeRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Nitrogenase enzyme complex */}
        <group ref={enzymeRef}>
          <Sphere args={[0.5, 16, 16]}>
            <meshStandardMaterial color="#5c6bc0" emissive="#3f51b5" emissiveIntensity={0.4} />
          </Sphere>
          <Sphere args={[0.35, 16, 16]} position={[0.6, 0, 0]}>
            <meshStandardMaterial color="#7986cb" emissive="#5c6bc0" emissiveIntensity={0.4} />
          </Sphere>
          {/* Iron-molybdenum cofactor */}
          <Icosahedron args={[0.15, 0]} position={[0.1, 0, 0]}>
            <meshStandardMaterial color="#ff5722" emissive="#e64a19" emissiveIntensity={0.8} />
          </Icosahedron>
        </group>
        {/* N2 molecules (input) */}
        {Array.from({ length: 4 }).map((_, i) => (
          <group key={i} position={[Math.cos(i * 1.5) * 1.3, Math.sin(i * 1.2) * 1.3, 0]}>
            <Sphere args={[0.1, 8, 8]} position={[-0.08, 0, 0]}>
              <meshStandardMaterial color="#42a5f5" emissive="#2196f3" emissiveIntensity={0.8} />
            </Sphere>
            <Sphere args={[0.1, 8, 8]} position={[0.08, 0, 0]}>
              <meshStandardMaterial color="#42a5f5" emissive="#2196f3" emissiveIntensity={0.8} />
            </Sphere>
          </group>
        ))}
        {/* NH3 molecules (output) */}
        {Array.from({ length: 3 }).map((_, i) => (
          <group key={i} position={[0, -1.2 + i * 0.4, Math.cos(i) * 0.5]}>
            <Sphere args={[0.08, 8, 8]}>
              <meshStandardMaterial color="#66bb6a" emissive="#4caf50" emissiveIntensity={0.8} />
            </Sphere>
          </group>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#5c6bc0" distance={5} />
    </group>
  )
}

// Fast Growth - CycD Cyclin - Cell division visualization
function FastGrowthModel() {
  const groupRef = useRef<THREE.Group>(null)
  const cell1Ref = useRef<THREE.Mesh>(null)
  const cell2Ref = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    // Cell division animation
    const divisionPhase = (Math.sin(state.clock.elapsedTime * 0.5) + 1) / 2
    if (cell1Ref.current && cell2Ref.current) {
      cell1Ref.current.position.x = -divisionPhase * 0.4
      cell2Ref.current.position.x = divisionPhase * 0.4
      cell1Ref.current.scale.x = 1 - divisionPhase * 0.3
      cell2Ref.current.scale.x = 1 - divisionPhase * 0.3
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Dividing cells */}
        <Sphere ref={cell1Ref} args={[0.5, 16, 16]}>
          <meshStandardMaterial color="#aed581" emissive="#8bc34a" emissiveIntensity={0.4} transparent opacity={0.8} />
        </Sphere>
        <Sphere ref={cell2Ref} args={[0.5, 16, 16]}>
          <meshStandardMaterial color="#aed581" emissive="#8bc34a" emissiveIntensity={0.4} transparent opacity={0.8} />
        </Sphere>
        {/* Nucleus in each cell */}
        <Sphere args={[0.15, 8, 8]} position={[-0.2, 0, 0]}>
          <meshStandardMaterial color="#7cb342" emissive="#689f38" emissiveIntensity={0.6} />
        </Sphere>
        <Sphere args={[0.15, 8, 8]} position={[0.2, 0, 0]}>
          <meshStandardMaterial color="#7cb342" emissive="#689f38" emissiveIntensity={0.6} />
        </Sphere>
        {/* Growth arrows */}
        {[0, 1, 2, 3].map((i) => (
          <Cone key={i} args={[0.08, 0.2, 8]} position={[Math.cos((i * Math.PI) / 2) * 1.2, Math.sin((i * Math.PI) / 2) * 1.2, 0]} rotation={[0, 0, -(i * Math.PI) / 2 - Math.PI / 2]}>
            <meshStandardMaterial color="#c5e1a5" emissive="#aed581" emissiveIntensity={0.5} />
          </Cone>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#8bc34a" distance={5} />
    </group>
  )
}

// Deep Root - DRO1 - Root system structure
function DeepRootModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Main taproot */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.05, 2.5, 8]} />
          <meshStandardMaterial color="#795548" emissive="#5d4037" emissiveIntensity={0.3} />
        </mesh>
        {/* Lateral roots */}
        {Array.from({ length: 8 }).map((_, i) => {
          const y = -0.3 - i * 0.25
          const angle = i * 0.8
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.15, y, Math.sin(angle) * 0.15]} rotation={[0.8, angle, 0]}>
              <cylinderGeometry args={[0.05, 0.02, 0.6 - i * 0.05, 8]} />
              <meshStandardMaterial color="#8d6e63" emissive="#6d4c41" emissiveIntensity={0.3} />
            </mesh>
          )
        })}
        {/* Root hairs */}
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * 0.8, -0.5 - Math.random() * 1.5, (Math.random() - 0.5) * 0.8]}>
            <cylinderGeometry args={[0.01, 0.01, 0.2, 4]} />
            <meshStandardMaterial color="#a1887f" emissive="#8d6e63" emissiveIntensity={0.2} />
          </mesh>
        ))}
        {/* Soil particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <Box key={i} args={[0.1, 0.1, 0.1]} position={[(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 2]}>
            <meshStandardMaterial color="#4e342e" transparent opacity={0.4} />
          </Box>
        ))}
      </Float>
      <pointLight position={[0, -1, 2]} intensity={1} color="#795548" distance={5} />
    </group>
  )
}

// UV Protection - CHS Chalcone Synthase - Flavonoid shield
function UVProtectionModel() {
  const groupRef = useRef<THREE.Group>(null)
  const shieldRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    if (shieldRef.current) {
      shieldRef.current.rotation.z = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Cell being protected */}
        <Sphere args={[0.5, 16, 16]}>
          <meshStandardMaterial color="#a5d6a7" emissive="#81c784" emissiveIntensity={0.3} />
        </Sphere>
        {/* Flavonoid shield layer */}
        <mesh ref={shieldRef}>
          <Sphere args={[0.8, 16, 16]}>
            <meshStandardMaterial color="#ce93d8" emissive="#ba68c8" emissiveIntensity={0.3} transparent opacity={0.4} />
          </Sphere>
        </mesh>
        {/* UV rays being blocked */}
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[0, 1.5, 0]} rotation={[0, 0, (i * Math.PI) / 5]}>
            <boxGeometry args={[0.02, 0.5, 0.02]} />
            <meshStandardMaterial color="#7b1fa2" emissive="#9c27b0" emissiveIntensity={1} />
          </mesh>
        ))}
        {/* Blocked UV particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Sphere key={i} args={[0.05, 8, 8]} position={[Math.cos(i) * 0.9, 0.5 + Math.random() * 0.5, Math.sin(i) * 0.9]}>
            <meshStandardMaterial color="#e1bee7" emissive="#ce93d8" emissiveIntensity={0.8} />
          </Sphere>
        ))}
      </Float>
      <pointLight position={[0, 2, 0]} intensity={2} color="#9c27b0" distance={5} />
    </group>
  )
}

// ============================================
// FUNGAL TRAITS (5)
// ============================================

// Mycelium Network - MYC1 - Branching hyphal network
function MyceliumNetworkModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  // Generate random branch points
  const branches = useMemo(() => {
    const result: { start: THREE.Vector3; end: THREE.Vector3 }[] = []
    const addBranch = (start: THREE.Vector3, direction: THREE.Vector3, depth: number) => {
      if (depth > 3) return
      const length = 0.4 - depth * 0.08
      const end = start.clone().add(direction.clone().multiplyScalar(length))
      result.push({ start, end })
      
      if (depth < 3) {
        for (let i = 0; i < 2; i++) {
          const newDir = new THREE.Vector3(
            direction.x + (Math.random() - 0.5) * 0.8,
            direction.y + (Math.random() - 0.5) * 0.8,
            direction.z + (Math.random() - 0.5) * 0.8
          ).normalize()
          addBranch(end, newDir, depth + 1)
        }
      }
    }
    
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      addBranch(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle), Math.random() - 0.5, Math.sin(angle)).normalize(),
        0
      )
    }
    return result
  }, [])

  return (
    <group ref={groupRef}>
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Central node */}
        <Sphere args={[0.2, 16, 16]}>
          <meshStandardMaterial color="#ff9800" emissive="#f57c00" emissiveIntensity={0.5} />
        </Sphere>
        {/* Hyphal branches */}
        {branches.map((branch, i) => {
          const midpoint = branch.start.clone().add(branch.end).multiplyScalar(0.5)
          const direction = branch.end.clone().sub(branch.start)
          const length = direction.length()
          return (
            <mesh key={i} position={[midpoint.x, midpoint.y, midpoint.z]}>
              <cylinderGeometry args={[0.02, 0.015, length, 8]} />
              <meshStandardMaterial color="#ffb74d" emissive="#ffa726" emissiveIntensity={0.3} />
            </mesh>
          )
        })}
        {/* Node points */}
        {branches.map((branch, i) => (
          <Sphere key={i} args={[0.03, 8, 8]} position={[branch.end.x, branch.end.y, branch.end.z]}>
            <meshStandardMaterial color="#ffcc80" emissive="#ffb74d" emissiveIntensity={0.5} />
          </Sphere>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#ff9800" distance={5} />
    </group>
  )
}

// Lignin Decomposition - LiP enzyme - Breaking down wood
function LigninDecompositionModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
        {/* Wood block being decomposed */}
        <Box args={[1, 0.6, 0.6]}>
          <meshStandardMaterial color="#8d6e63" emissive="#6d4c41" emissiveIntensity={0.2} />
        </Box>
        {/* Enzyme particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <Sphere key={i} args={[0.08, 8, 8]} position={[(Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8]}>
            <meshStandardMaterial color="#ffeb3b" emissive="#fdd835" emissiveIntensity={0.8} />
          </Sphere>
        ))}
        {/* Breaking particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Box key={i} args={[0.1, 0.1, 0.1]} position={[0.7 + Math.random() * 0.5, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5]} rotation={[Math.random(), Math.random(), Math.random()]}>
            <meshStandardMaterial color="#a1887f" emissive="#8d6e63" emissiveIntensity={0.3} />
          </Box>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#8d6e63" distance={5} />
    </group>
  )
}

// Symbiosis - SYM protein - Two organisms connected
function SymbiosisModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Fungal partner */}
        <Sphere args={[0.4, 16, 16]} position={[-0.5, 0, 0]}>
          <meshStandardMaterial color="#ff9800" emissive="#f57c00" emissiveIntensity={0.4} />
        </Sphere>
        {/* Plant root partner */}
        <mesh position={[0.5, 0, 0]}>
          <capsuleGeometry args={[0.25, 0.5, 8, 16]} />
          <meshStandardMaterial color="#81c784" emissive="#66bb6a" emissiveIntensity={0.4} />
        </mesh>
        {/* Connection interface */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
          <meshStandardMaterial color="#c5e1a5" emissive="#aed581" emissiveIntensity={0.5} transparent opacity={0.7} />
        </mesh>
        {/* Nutrient exchange particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Sphere key={i} args={[0.05, 8, 8]} position={[(i % 2 === 0 ? -1 : 1) * (0.1 + i * 0.05), Math.sin(i) * 0.2, Math.cos(i) * 0.2]}>
            <meshStandardMaterial color={i % 2 === 0 ? "#4fc3f7" : "#ffb74d"} emissive={i % 2 === 0 ? "#29b6f6" : "#ffa726"} emissiveIntensity={0.8} />
          </Sphere>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#66bb6a" distance={5} />
    </group>
  )
}

// Spore Formation - SPO factor - Spore structure
function SporeFormationModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Sporangium (spore case) */}
        <Sphere args={[0.5, 16, 16]}>
          <meshStandardMaterial color="#78909c" emissive="#546e7a" emissiveIntensity={0.3} />
        </Sphere>
        {/* Outer protective layer */}
        <Sphere args={[0.6, 16, 16]}>
          <meshStandardMaterial color="#90a4ae" transparent opacity={0.3} wireframe />
        </Sphere>
        {/* Individual spores */}
        {Array.from({ length: 20 }).map((_, i) => {
          const phi = Math.acos(-1 + (2 * i) / 20)
          const theta = Math.sqrt(20 * Math.PI) * phi
          const r = 0.35
          return (
            <Sphere key={i} args={[0.06, 8, 8]} position={[r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)]}>
              <meshStandardMaterial color="#b0bec5" emissive="#90a4ae" emissiveIntensity={0.5} />
            </Sphere>
          )
        })}
        {/* Released spores */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Sphere key={i} args={[0.05, 8, 8]} position={[(Math.random() - 0.5) * 2, 0.8 + Math.random() * 0.5, (Math.random() - 0.5) * 2]}>
            <meshStandardMaterial color="#cfd8dc" emissive="#b0bec5" emissiveIntensity={0.6} />
          </Sphere>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#78909c" distance={5} />
    </group>
  )
}

// Bioluminescence - LUC Luciferase - Glowing organism
function BioluminescenceModel() {
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.PointLight>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    if (glowRef.current) {
      // Pulsing glow effect
      glowRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 3) * 1
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Bioluminescent organism */}
        <Sphere args={[0.6, 32, 32]}>
          <MeshDistortMaterial
            color="#00e5ff"
            emissive="#00bcd4"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.3}
            distort={0.2}
            speed={2}
          />
        </Sphere>
        {/* Inner glow core */}
        <Sphere args={[0.3, 16, 16]}>
          <meshStandardMaterial color="#84ffff" emissive="#18ffff" emissiveIntensity={1} />
        </Sphere>
        {/* Light particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <Sphere key={i} args={[0.04, 8, 8]} position={[(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2]}>
            <meshStandardMaterial color="#b2ebf2" emissive="#4dd0e1" emissiveIntensity={1} />
          </Sphere>
        ))}
      </Float>
      <pointLight ref={glowRef} position={[0, 0, 0]} intensity={2} color="#00e5ff" distance={8} />
    </group>
  )
}

// ============================================
// SYNTHETIC TRAITS (6)
// ============================================

// Biosensor - GFP-Lac fusion - Glowing sensor
function BiosensorModel() {
  const groupRef = useRef<THREE.Group>(null)
  const sensorRef = useRef<THREE.PointLight>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    if (sensorRef.current) {
      // Sensor detection pulse
      sensorRef.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Sensor cell */}
        <Sphere args={[0.5, 16, 16]}>
          <meshStandardMaterial color="#76ff03" emissive="#64dd17" emissiveIntensity={0.6} transparent opacity={0.8} />
        </Sphere>
        {/* Receptor proteins */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <group key={i} position={[Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0]}>
              <Box args={[0.1, 0.2, 0.1]}>
                <meshStandardMaterial color="#b2ff59" emissive="#76ff03" emissiveIntensity={0.5} />
              </Box>
            </group>
          )
        })}
        {/* Signal molecules */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Sphere key={i} args={[0.06, 8, 8]} position={[(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2]}>
            <meshStandardMaterial color="#ff5252" emissive="#ff1744" emissiveIntensity={0.8} />
          </Sphere>
        ))}
      </Float>
      <pointLight ref={sensorRef} position={[0, 0, 0]} intensity={1} color="#76ff03" distance={6} />
    </group>
  )
}

// Bioplastic Production - phaC synthase - PHA granules
function BioplasticProductionModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Cell membrane */}
        <Sphere args={[0.8, 16, 16]}>
          <meshStandardMaterial color="#42a5f5" transparent opacity={0.3} />
        </Sphere>
        {/* PHA granules inside */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Sphere key={i} args={[0.15 + Math.random() * 0.1, 16, 16]} position={[(Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6]}>
            <meshStandardMaterial color="#64b5f6" emissive="#42a5f5" emissiveIntensity={0.5} />
          </Sphere>
        ))}
        {/* Enzyme complex */}
        <Icosahedron args={[0.2, 0]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#1565c0" emissive="#0d47a1" emissiveIntensity={0.6} />
        </Icosahedron>
        {/* Polymer chains */}
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh key={i} position={[0, 0, 0]} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <torusGeometry args={[0.5, 0.02, 8, 32]} />
            <meshStandardMaterial color="#90caf9" emissive="#64b5f6" emissiveIntensity={0.3} />
          </mesh>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#42a5f5" distance={5} />
    </group>
  )
}

// Metal Accumulation - MT Metallothionein - Metal binding
function MetalAccumulationModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Cell structure */}
        <Sphere args={[0.6, 16, 16]}>
          <meshStandardMaterial color="#78909c" emissive="#546e7a" emissiveIntensity={0.3} transparent opacity={0.6} />
        </Sphere>
        {/* Metal ions being accumulated */}
        {Array.from({ length: 12 }).map((_, i) => (
          <Icosahedron key={i} args={[0.08, 0]} position={[(Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8]}>
            <meshStandardMaterial 
              color={["#ffd700", "#c0c0c0", "#b87333"][i % 3]} 
              emissive={["#ffc107", "#9e9e9e", "#8d6e63"][i % 3]} 
              emissiveIntensity={0.8}
              metalness={0.9}
              roughness={0.1}
            />
          </Icosahedron>
        ))}
        {/* Binding proteins */}
        {Array.from({ length: 4 }).map((_, i) => (
          <Torus key={i} args={[0.25 + i * 0.1, 0.03, 8, 32]} rotation={[Math.PI / 2, i * 0.5, 0]}>
            <meshStandardMaterial color="#b0bec5" emissive="#90a4ae" emissiveIntensity={0.3} />
          </Torus>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#ffd700" distance={5} />
    </group>
  )
}

// Oxygen Production - PSII+ Enhanced photosystem
function OxygenProductionModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Chloroplast/thylakoid */}
        <mesh>
          <capsuleGeometry args={[0.4, 0.8, 16, 32]} />
          <meshStandardMaterial color="#4caf50" emissive="#2e7d32" emissiveIntensity={0.4} />
        </mesh>
        {/* Photosystem II complex */}
        <Box args={[0.3, 0.5, 0.3]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#81c784" emissive="#66bb6a" emissiveIntensity={0.5} />
        </Box>
        {/* O2 bubbles being released */}
        {Array.from({ length: 10 }).map((_, i) => (
          <Sphere key={i} args={[0.06 + Math.random() * 0.04, 8, 8]} position={[(Math.random() - 0.5) * 0.5, 0.6 + Math.random() * 1, (Math.random() - 0.5) * 0.5]}>
            <meshStandardMaterial color="#29b6f6" emissive="#03a9f4" emissiveIntensity={0.8} transparent opacity={0.7} />
          </Sphere>
        ))}
        {/* Light input */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[0, -1, 0]} rotation={[0, 0, (i * Math.PI) / 3]}>
            <boxGeometry args={[0.02, 0.4, 0.02]} />
            <meshStandardMaterial color="#ffeb3b" emissive="#ffc107" emissiveIntensity={1} />
          </mesh>
        ))}
      </Float>
      <pointLight position={[0, 1, 0]} intensity={2} color="#29b6f6" distance={5} />
    </group>
  )
}

// Self-Repair - CRISPR system - DNA editing
function SelfRepairModel() {
  const groupRef = useRef<THREE.Group>(null)
  const casRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    if (casRef.current) {
      // Scanning motion
      casRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* DNA strand */}
        {Array.from({ length: 15 }).map((_, i) => {
          const y = (i - 7) * 0.2
          return (
            <mesh key={i} position={[0, y, 0]} rotation={[0, i * 0.4, 0]}>
              <boxGeometry args={[0.8, 0.05, 0.1]} />
              <meshStandardMaterial color={i === 7 ? "#f44336" : "#7c4dff"} emissive={i === 7 ? "#e53935" : "#651fff"} emissiveIntensity={0.4} />
            </mesh>
          )
        })}
        {/* Cas9 protein */}
        <mesh ref={casRef}>
          <Icosahedron args={[0.25, 1]}>
            <meshStandardMaterial color="#ff9800" emissive="#f57c00" emissiveIntensity={0.6} />
          </Icosahedron>
        </mesh>
        {/* Guide RNA */}
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
          <meshStandardMaterial color="#ffeb3b" emissive="#fdd835" emissiveIntensity={0.5} />
        </mesh>
        {/* Repair particles */}
        {Array.from({ length: 4 }).map((_, i) => (
          <Sphere key={i} args={[0.05, 8, 8]} position={[(Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 0.5]}>
            <meshStandardMaterial color="#76ff03" emissive="#64dd17" emissiveIntensity={0.8} />
          </Sphere>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#ff9800" distance={5} />
    </group>
  )
}

// Biofilm Resistance - LasR- Quorum sensing inhibitor
function BiofilmResistanceModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Protected cell */}
        <Sphere args={[0.5, 16, 16]}>
          <meshStandardMaterial color="#26a69a" emissive="#00897b" emissiveIntensity={0.4} />
        </Sphere>
        {/* Protective shield */}
        <Sphere args={[0.7, 16, 16]}>
          <meshStandardMaterial color="#80cbc4" transparent opacity={0.3} />
        </Sphere>
        {/* Blocked bacteria */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <group key={i} position={[Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0]}>
              <mesh>
                <capsuleGeometry args={[0.08, 0.15, 8, 8]} />
                <meshStandardMaterial color="#ef5350" emissive="#e53935" emissiveIntensity={0.3} />
              </mesh>
              {/* Block symbol */}
              <mesh position={[0, 0, 0.15]}>
                <ringGeometry args={[0.1, 0.12, 16]} />
                <meshStandardMaterial color="#f44336" emissive="#e53935" emissiveIntensity={0.8} />
              </mesh>
            </group>
          )
        })}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#26a69a" distance={5} />
    </group>
  )
}

// ============================================
// ANIMAL TRAITS (5)
// ============================================

// Regeneration - WNT pathway - Tissue regrowth
function RegenerationModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Original tissue */}
        <mesh position={[-0.4, 0, 0]}>
          <capsuleGeometry args={[0.3, 0.5, 16, 16]} />
          <meshStandardMaterial color="#f48fb1" emissive="#ec407a" emissiveIntensity={0.4} />
        </mesh>
        {/* Regenerating tissue */}
        <mesh position={[0.3, 0, 0]}>
          <capsuleGeometry args={[0.2, 0.3, 16, 16]} />
          <meshStandardMaterial color="#f8bbd9" emissive="#f48fb1" emissiveIntensity={0.5} transparent opacity={0.7} />
        </mesh>
        {/* Stem cells */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Sphere key={i} args={[0.06, 8, 8]} position={[0 + (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.5]}>
            <meshStandardMaterial color="#e91e63" emissive="#c2185b" emissiveIntensity={0.8} />
          </Sphere>
        ))}
        {/* Growth signals */}
        {Array.from({ length: 5 }).map((_, i) => (
          <Cone key={i} args={[0.05, 0.15, 8]} position={[-0.1 + i * 0.15, 0.5, 0]} rotation={[Math.PI, 0, 0]}>
            <meshStandardMaterial color="#76ff03" emissive="#64dd17" emissiveIntensity={0.6} />
          </Cone>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#e91e63" distance={5} />
    </group>
  )
}

// Antifreeze Protein - AFP-III - Ice prevention
function AntifreezeProteinModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* AFP protein structure */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusKnotGeometry args={[0.4, 0.1, 100, 16]} />
          <meshStandardMaterial color="#4fc3f7" emissive="#29b6f6" emissiveIntensity={0.5} />
        </mesh>
        {/* Ice crystals being blocked */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Icosahedron key={i} args={[0.1, 0]} position={[(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2]}>
            <meshStandardMaterial color="#e1f5fe" emissive="#81d4fa" emissiveIntensity={0.5} transparent opacity={0.6} />
          </Icosahedron>
        ))}
        {/* Binding sites */}
        {Array.from({ length: 4 }).map((_, i) => (
          <Sphere key={i} args={[0.08, 8, 8]} position={[Math.cos((i * Math.PI) / 2) * 0.5, 0, Math.sin((i * Math.PI) / 2) * 0.5]}>
            <meshStandardMaterial color="#0288d1" emissive="#0277bd" emissiveIntensity={0.8} />
          </Sphere>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#4fc3f7" distance={5} />
    </group>
  )
}

// Silk Production - MaSp spidroin - Spider silk
function SilkProductionModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  // Generate silk strand points
  const silkPoints = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (let i = 0; i < 50; i++) {
      const t = i / 50
      points.push(new THREE.Vector3(
        Math.sin(t * Math.PI * 4) * 0.3,
        t * 2 - 1,
        Math.cos(t * Math.PI * 4) * 0.3
      ))
    }
    return points
  }, [])

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Spinneret gland */}
        <Sphere args={[0.3, 16, 16]} position={[0, -1, 0]}>
          <meshStandardMaterial color="#9e9e9e" emissive="#757575" emissiveIntensity={0.4} />
        </Sphere>
        {/* Silk strand */}
        <mesh>
          <tubeGeometry args={[new THREE.CatmullRomCurve3(silkPoints), 50, 0.02, 8, false]} />
          <meshStandardMaterial color="#e0e0e0" emissive="#bdbdbd" emissiveIntensity={0.5} />
        </mesh>
        {/* Protein molecules */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Box key={i} args={[0.08, 0.15, 0.08]} position={[(Math.random() - 0.5) * 0.4, -0.8 + i * 0.1, (Math.random() - 0.5) * 0.4]} rotation={[Math.random(), Math.random(), Math.random()]}>
            <meshStandardMaterial color="#fafafa" emissive="#e0e0e0" emissiveIntensity={0.3} />
          </Box>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#e0e0e0" distance={5} />
    </group>
  )
}

// Venom Synthesis - PLA2 phospholipase - Venom production
function VenomSynthesisModel() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Venom gland */}
        <mesh>
          <capsuleGeometry args={[0.35, 0.6, 16, 16]} />
          <meshStandardMaterial color="#9c27b0" emissive="#7b1fa2" emissiveIntensity={0.4} />
        </mesh>
        {/* Venom duct */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.08, 0.15, 0.5, 8]} />
          <meshStandardMaterial color="#ab47bc" emissive="#8e24aa" emissiveIntensity={0.4} />
        </mesh>
        {/* Venom molecules */}
        {Array.from({ length: 10 }).map((_, i) => (
          <Icosahedron key={i} args={[0.06, 0]} position={[(Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.5]}>
            <meshStandardMaterial color="#e040fb" emissive="#d500f9" emissiveIntensity={0.8} />
          </Icosahedron>
        ))}
        {/* Toxic warning aura */}
        <Sphere args={[0.8, 16, 16]}>
          <meshStandardMaterial color="#ce93d8" transparent opacity={0.2} />
        </Sphere>
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#9c27b0" distance={5} />
    </group>
  )
}

// Camouflage - OCA2 melanin pathway - Color changing
function CamouflageModel() {
  const groupRef = useRef<THREE.Group>(null)
  const colorRef = useRef({ hue: 0 })
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    colorRef.current.hue = (state.clock.elapsedTime * 0.1) % 1
  })

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Chameleon-like cell */}
        <Sphere args={[0.5, 32, 32]}>
          <MeshDistortMaterial
            color="#4db6ac"
            emissive="#26a69a"
            emissiveIntensity={0.4}
            distort={0.2}
            speed={3}
          />
        </Sphere>
        {/* Chromatophore cells */}
        {Array.from({ length: 12 }).map((_, i) => {
          const colors = ["#ef5350", "#42a5f5", "#66bb6a", "#ffca28", "#ab47bc"]
          return (
            <Sphere key={i} args={[0.1, 8, 8]} position={[Math.cos((i / 12) * Math.PI * 2) * 0.6, Math.sin((i / 12) * Math.PI * 2) * 0.6, 0]}>
              <meshStandardMaterial 
                color={colors[i % colors.length]} 
                emissive={colors[i % colors.length]} 
                emissiveIntensity={0.5}
              />
            </Sphere>
          )
        })}
        {/* Pattern texture */}
        <Sphere args={[0.55, 16, 16]}>
          <meshStandardMaterial color="#80cbc4" transparent opacity={0.3} wireframe />
        </Sphere>
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#26a69a" distance={5} />
    </group>
  )
}

// ============================================
// NEW DETAILED MODELS - MARINE (8)
// ============================================

// Pressure Adaptation - Deep sea fish with compressed body
function PressureAdaptationModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })
  return (
    <group ref={groupRef}>
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Deep sea fish body - flattened */}
        <Sphere args={[0.5, 32, 32]} scale={[1.2, 0.6, 0.8]}>
          <meshStandardMaterial color="#1a237e" emissive="#0d47a1" emissiveIntensity={0.3} metalness={0.4} roughness={0.6} />
        </Sphere>
        {/* Pressure-resistant skull */}
        <Sphere args={[0.25, 16, 16]} position={[0.4, 0, 0]}>
          <meshStandardMaterial color="#283593" emissive="#1565c0" emissiveIntensity={0.4} />
        </Sphere>
        {/* Pressure rings showing compression */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Torus key={i} args={[0.3 + i * 0.15, 0.02, 8, 32]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#4fc3f7" emissive="#29b6f6" emissiveIntensity={0.5} transparent opacity={0.6 - i * 0.1} />
          </Torus>
        ))}
        {/* Bioluminescent spots for deep sea */}
        {[...Array(6)].map((_, i) => (
          <Sphere key={i} args={[0.05, 8, 8]} position={[Math.cos(i) * 0.4, Math.sin(i) * 0.3, 0.3]}>
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1} />
          </Sphere>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={0.8} color="#1565c0" />
    </group>
  )
}

// Jet Propulsion - Squid with water jets
function JetPropulsionModel() {
  const groupRef = useRef<THREE.Group>(null)
  const jetRefs = useRef<THREE.Mesh[]>([])
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    jetRefs.current.forEach((jet, i) => {
      if (jet) {
        const pulse = Math.sin(state.clock.elapsedTime * 4 + i) * 0.3
        jet.scale.y = 1 + pulse
      }
    })
  })
  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        {/* Squid mantle */}
        <Cone args={[0.4, 1, 16]} position={[0, 0.3, 0]}>
          <meshStandardMaterial color="#e91e63" emissive="#c2185b" emissiveIntensity={0.3} />
        </Cone>
        {/* Squid head */}
        <Sphere args={[0.3, 16, 16]} position={[0, -0.3, 0]}>
          <meshStandardMaterial color="#f48fb1" emissive="#ec407a" emissiveIntensity={0.3} />
        </Sphere>
        {/* Water jet streams */}
        {[-0.3, 0.3].map((x, i) => (
          <Cylinder key={i} ref={(el) => { if (el) jetRefs.current[i] = el }} args={[0.05, 0.15, 0.8, 8]} position={[x, -0.8, 0]} rotation={[0, 0, x > 0 ? 0.3 : -0.3]}>
            <meshStandardMaterial color="#00bcd4" emissive="#00e5ff" emissiveIntensity={0.8} transparent opacity={0.7} />
          </Cylinder>
        ))}
        {/* Tentacles */}
        {[...Array(8)].map((_, i) => (
          <Cylinder key={i} args={[0.03, 0.01, 0.6, 6]} position={[Math.cos(i * Math.PI / 4) * 0.2, -0.7, Math.sin(i * Math.PI / 4) * 0.2]} rotation={[0.5, 0, i * 0.2]}>
            <meshStandardMaterial color="#f8bbd9" />
          </Cylinder>
        ))}
      </Float>
      <pointLight position={[0, -1, 1]} intensity={1} color="#00bcd4" />
    </group>
  )
}

// Ink Production - Cuttlefish with ink cloud
function InkProductionModel() {
  const groupRef = useRef<THREE.Group>(null)
  const inkParticles = useMemo(() => 
    [...Array(30)].map(() => ({
      pos: new THREE.Vector3((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5),
      scale: 0.05 + Math.random() * 0.1
    })), [])
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
  })
  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Cuttlefish body */}
        <Sphere args={[0.35, 32, 32]} scale={[1.5, 0.8, 1]}>
          <meshStandardMaterial color="#5d4037" emissive="#4e342e" emissiveIntensity={0.2} />
        </Sphere>
        {/* Ink sac */}
        <Sphere args={[0.15, 16, 16]} position={[0, -0.2, 0.2]}>
          <meshStandardMaterial color="#212121" emissive="#000000" emissiveIntensity={0} />
        </Sphere>
        {/* Ink cloud particles */}
        {inkParticles.map((p, i) => (
          <Sphere key={i} args={[p.scale, 8, 8]} position={[p.pos.x - 0.5, p.pos.y - 0.3, p.pos.z]}>
            <meshStandardMaterial color="#1a1a1a" emissive="#333333" emissiveIntensity={0.2} transparent opacity={0.6} />
          </Sphere>
        ))}
        {/* Eyes */}
        <Sphere args={[0.08, 8, 8]} position={[0.25, 0.1, 0.3]}>
          <meshStandardMaterial color="#ffc107" emissive="#ff9800" emissiveIntensity={0.5} />
        </Sphere>
      </Float>
      <pointLight position={[0, 0, 2]} intensity={0.5} color="#4e342e" />
    </group>
  )
}

// Electric Organ - Electric eel with electrocytes
function ElectricOrganModel() {
  const groupRef = useRef<THREE.Group>(null)
  const sparkRefs = useRef<THREE.Mesh[]>([])
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    sparkRefs.current.forEach((spark, i) => {
      if (spark && spark.material && !Array.isArray(spark.material)) {
        (spark.material as THREE.MeshStandardMaterial).opacity = 0.3 + Math.sin(state.clock.elapsedTime * 10 + i * 2) * 0.7
      }
    })
  })
  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Eel body */}
        <Cylinder args={[0.15, 0.1, 1.5, 16]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#37474f" emissive="#263238" emissiveIntensity={0.2} />
        </Cylinder>
        {/* Electrocyte stacks */}
        {[...Array(8)].map((_, i) => (
          <Box key={i} args={[0.12, 0.25, 0.08]} position={[-0.5 + i * 0.14, 0, 0]}>
            <meshStandardMaterial color="#ffd54f" emissive="#ffca28" emissiveIntensity={0.6} />
          </Box>
        ))}
        {/* Electric sparks */}
        {[...Array(6)].map((_, i) => (
          <mesh key={i} ref={(el) => { if (el) sparkRefs.current[i] = el }} position={[(Math.random() - 0.5) * 1, (Math.random() - 0.5) * 0.5, 0.3]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={2} transparent />
          </mesh>
        ))}
      </Float>
      <pointLight position={[0, 0, 1]} intensity={2} color="#ffeb3b" />
    </group>
  )
}

// Coral Symbiosis - Coral polyp with zooxanthellae
function CoralSymbiosisModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
  })
  return (
    <group ref={groupRef}>
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Coral base */}
        <Cylinder args={[0.5, 0.6, 0.3, 8]} position={[0, -0.5, 0]}>
          <meshStandardMaterial color="#ffab91" emissive="#ff8a65" emissiveIntensity={0.2} />
        </Cylinder>
        {/* Coral polyps (tentacles) */}
        {[...Array(12)].map((_, i) => (
          <group key={i} position={[Math.cos(i * Math.PI / 6) * 0.35, -0.2, Math.sin(i * Math.PI / 6) * 0.35]}>
            <Cylinder args={[0.04, 0.02, 0.4, 6]} position={[0, 0.2, 0]}>
              <meshStandardMaterial color="#ff8a80" emissive="#ff5252" emissiveIntensity={0.3} />
            </Cylinder>
            {/* Tentacle tip */}
            <Sphere args={[0.05, 8, 8]} position={[0, 0.45, 0]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffcdd2" emissiveIntensity={0.4} />
            </Sphere>
          </group>
        ))}
        {/* Zooxanthellae (symbiotic algae) - glowing green spheres inside */}
        {[...Array(8)].map((_, i) => (
          <Sphere key={i} args={[0.06, 8, 8]} position={[Math.cos(i * Math.PI / 4) * 0.2, -0.4, Math.sin(i * Math.PI / 4) * 0.2]}>
            <meshStandardMaterial color="#69f0ae" emissive="#00e676" emissiveIntensity={0.8} />
          </Sphere>
        ))}
      </Float>
      <pointLight position={[0, 1, 1]} intensity={1} color="#ff8a65" />
    </group>
  )
}

// Chromatophore System - Octopus skin cells changing color
function ChromatophoreSystemModel() {
  const groupRef = useRef<THREE.Group>(null)
  const cellRefs = useRef<THREE.Mesh[]>([])
  const colors = ["#f44336", "#2196f3", "#ffeb3b", "#4caf50", "#9c27b0"]
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
    cellRefs.current.forEach((cell, i) => {
      if (cell) {
        const expand = 0.8 + Math.sin(state.clock.elapsedTime * 3 + i * 0.5) * 0.4
        cell.scale.setScalar(expand)
      }
    })
  })
  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Skin surface */}
        <Sphere args={[0.6, 32, 32]}>
          <meshStandardMaterial color="#8d6e63" emissive="#6d4c41" emissiveIntensity={0.2} />
        </Sphere>
        {/* Chromatophore cells */}
        {[...Array(20)].map((_, i) => {
          const theta = Math.random() * Math.PI * 2
          const phi = Math.random() * Math.PI
          const x = 0.62 * Math.sin(phi) * Math.cos(theta)
          const y = 0.62 * Math.sin(phi) * Math.sin(theta)
          const z = 0.62 * Math.cos(phi)
          return (
            <Sphere key={i} ref={(el) => { if (el) cellRefs.current[i] = el }} args={[0.08, 8, 8]} position={[x, y, z]}>
              <meshStandardMaterial color={colors[i % 5]} emissive={colors[i % 5]} emissiveIntensity={0.6} />
            </Sphere>
          )
        })}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#9c27b0" />
    </group>
  )
}

// Osmoregulation - Fish gill with ion channels
function OsmoregulationModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
  })
  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.15} floatIntensity={0.25}>
        {/* Gill arch */}
        <Torus args={[0.5, 0.08, 8, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#ef5350" emissive="#e53935" emissiveIntensity={0.3} />
        </Torus>
        {/* Gill filaments */}
        {[...Array(16)].map((_, i) => (
          <Cylinder key={i} args={[0.015, 0.01, 0.4, 6]} position={[Math.cos(i * Math.PI / 8) * 0.5, 0, Math.sin(i * Math.PI / 8) * 0.5]} rotation={[Math.PI / 2, 0, i * Math.PI / 8]}>
            <meshStandardMaterial color="#ff8a80" emissive="#ff5252" emissiveIntensity={0.4} />
          </Cylinder>
        ))}
        {/* Ion channel proteins (glowing dots) */}
        {[...Array(12)].map((_, i) => (
          <Sphere key={i} args={[0.04, 8, 8]} position={[Math.cos(i * Math.PI / 6) * 0.35, Math.sin(i * Math.PI / 6) * 0.1, Math.sin(i * Math.PI / 6) * 0.35]}>
            <meshStandardMaterial color="#00e5ff" emissive="#00bcd4" emissiveIntensity={0.8} />
          </Sphere>
        ))}
        {/* Water flow arrows */}
        {[0.3, -0.3].map((y, i) => (
          <Cone key={i} args={[0.08, 0.2, 8]} position={[0.7, y, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <meshStandardMaterial color="#4dd0e1" emissive="#26c6da" emissiveIntensity={0.5} transparent opacity={0.7} />
          </Cone>
        ))}
      </Float>
      <pointLight position={[0, 0, 1.5]} intensity={1} color="#26c6da" />
    </group>
  )
}

// ============================================
// NEW DETAILED MODELS - INSECT (8)
// ============================================

// Exoskeleton - Layered chitin armor
function ExoskeletonModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
  })
  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.15} floatIntensity={0.2}>
        {/* Layered armor plates */}
        {[0, 1, 2].map((i) => (
          <Box key={i} args={[0.8 - i * 0.15, 0.1, 0.6 - i * 0.1]} position={[0, i * 0.15, 0]}>
            <meshStandardMaterial color={i === 0 ? "#5d4037" : i === 1 ? "#6d4c41" : "#8d6e63"} emissive="#4e342e" emissiveIntensity={0.2} metalness={0.7} roughness={0.3} />
          </Box>
        ))}
        {/* Chitin structure pattern */}
        {[...Array(6)].map((_, i) => (
          <Box key={i} args={[0.05, 0.4, 0.05]} position={[-0.3 + i * 0.12, 0.1, 0.25]}>
            <meshStandardMaterial color="#4e342e" metalness={0.8} roughness={0.2} />
          </Box>
        ))}
        {/* Joint segments */}
        {[-0.5, 0.5].map((x, i) => (
          <Sphere key={i} args={[0.1, 16, 16]} position={[x, 0.15, 0]}>
            <meshStandardMaterial color="#3e2723" metalness={0.6} roughness={0.4} />
          </Sphere>
        ))}
      </Float>
      <pointLight position={[0, 1, 1]} intensity={0.8} color="#8d6e63" />
    </group>
  )
}

// Compound Eyes - Hexagonal ommatidium array
function CompoundEyesModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
  })
  const hexPositions = useMemo(() => {
    const positions: [number, number, number][] = []
    for (let ring = 0; ring < 4; ring++) {
      const count = ring === 0 ? 1 : ring * 6
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2
        const r = ring * 0.12
        positions.push([Math.cos(angle) * r, Math.sin(angle) * r, 0])
      }
    }
    return positions
  }, [])
  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Eye dome */}
        <Sphere args={[0.6, 32, 32]} scale={[1, 1, 0.6]}>
          <meshStandardMaterial color="#212121" metalness={0.9} roughness={0.1} />
        </Sphere>
        {/* Ommatidia (hexagonal facets) */}
        {hexPositions.map((pos, i) => (
          <group key={i} position={[pos[0], pos[1], 0.35]}>
            <Cylinder args={[0.05, 0.05, 0.1, 6]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#9c27b0" emissive="#7b1fa2" emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
            </Cylinder>
          </group>
        ))}
        {/* Lens highlight */}
        <Sphere args={[0.55, 16, 16]} scale={[1, 1, 0.5]} position={[0, 0, 0.1]}>
          <meshStandardMaterial color="#e1bee7" transparent opacity={0.3} />
        </Sphere>
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1.5} color="#9c27b0" />
    </group>
  )
}

// Metamorphosis - Caterpillar to butterfly transformation
function MetamorphosisModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
  })
  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Chrysalis */}
        <Sphere args={[0.3, 32, 32]} scale={[0.8, 1.2, 0.8]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#8bc34a" emissive="#689f38" emissiveIntensity={0.3} transparent opacity={0.7} />
        </Sphere>
        {/* Emerging butterfly wings */}
        {[-1, 1].map((side, i) => (
          <group key={i} position={[side * 0.3, 0.1, 0]} rotation={[0, 0, side * 0.3]}>
            <Sphere args={[0.4, 16, 16]} scale={[1.5, 0.8, 0.1]}>
              <meshStandardMaterial color="#e91e63" emissive="#c2185b" emissiveIntensity={0.4} transparent opacity={0.8} />
            </Sphere>
            {/* Wing pattern */}
            <Sphere args={[0.15, 8, 8]} position={[side * 0.2, 0, 0.05]}>
              <meshStandardMaterial color="#ffeb3b" emissive="#ffc107" emissiveIntensity={0.5} />
            </Sphere>
          </group>
        ))}
        {/* Transformation particles */}
        {[...Array(10)].map((_, i) => (
          <Sphere key={i} args={[0.03, 6, 6]} position={[(Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8]}>
            <meshStandardMaterial color="#fff59d" emissive="#ffee58" emissiveIntensity={1} />
          </Sphere>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#e91e63" />
    </group>
  )
}

// Flight Muscles - Insect thorax with oscillating wings
function FlightMusclesModel() {
  const groupRef = useRef<THREE.Group>(null)
  const wingRefs = useRef<THREE.Group[]>([])
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    wingRefs.current.forEach((wing, i) => {
      if (wing) {
        wing.rotation.z = Math.sin(state.clock.elapsedTime * 20) * 0.5 * (i === 0 ? 1 : -1)
      }
    })
  })
  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
        {/* Thorax */}
        <Sphere args={[0.3, 32, 32]} scale={[1.2, 1, 0.8]}>
          <meshStandardMaterial color="#37474f" emissive="#263238" emissiveIntensity={0.2} />
        </Sphere>
        {/* Dorsal flight muscles (visible through) */}
        <Box args={[0.4, 0.15, 0.2]} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#ef5350" emissive="#e53935" emissiveIntensity={0.4} />
        </Box>
        {/* Wings */}
        {[0, 1].map((i) => (
          <group key={i} ref={(el) => { if (el) wingRefs.current[i] = el }} position={[i === 0 ? -0.3 : 0.3, 0.15, 0]}>
            <Sphere args={[0.5, 16, 16]} scale={[1, 0.05, 0.6]}>
              <meshStandardMaterial color="#90caf9" emissive="#64b5f6" emissiveIntensity={0.3} transparent opacity={0.6} />
            </Sphere>
            {/* Wing veins */}
            <Cylinder args={[0.01, 0.01, 0.4, 4]} position={[i === 0 ? -0.2 : 0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#1565c0" />
            </Cylinder>
          </group>
        ))}
      </Float>
      <pointLight position={[0, 1, 1]} intensity={1} color="#64b5f6" />
    </group>
  )
}

// Pheromone Communication - Moth with scent plume
function PheromoneCommunicationModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
  })
  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Moth body */}
        <Sphere args={[0.2, 16, 16]} scale={[1, 1.5, 1]}>
          <meshStandardMaterial color="#8d6e63" emissive="#6d4c41" emissiveIntensity={0.2} />
        </Sphere>
        {/* Feathery antennae (pheromone receptors) */}
        {[-1, 1].map((side, i) => (
          <group key={i} position={[side * 0.15, 0.35, 0]}>
            <Cylinder args={[0.02, 0.01, 0.4, 6]} rotation={[0.3, 0, side * 0.5]}>
              <meshStandardMaterial color="#d7ccc8" />
            </Cylinder>
            {[...Array(8)].map((_, j) => (
              <Cylinder key={j} args={[0.005, 0.005, 0.1, 4]} position={[side * (j * 0.02), 0.05 + j * 0.04, 0]} rotation={[0, 0, side * 0.8]}>
                <meshStandardMaterial color="#bcaaa4" />
              </Cylinder>
            ))}
          </group>
        ))}
        {/* Pheromone plume */}
        {[...Array(15)].map((_, i) => (
          <Sphere key={i} args={[0.04 + i * 0.01, 8, 8]} position={[-0.3 - i * 0.1, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3]}>
            <meshStandardMaterial color="#f48fb1" emissive="#ec407a" emissiveIntensity={0.6} transparent opacity={0.4 - i * 0.02} />
          </Sphere>
        ))}
      </Float>
      <pointLight position={[-1, 0, 1]} intensity={1} color="#ec407a" />
    </group>
  )
}

// Hive Mind Behavior - Connected bee network
function HiveMindBehaviorModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
  })
  const beePositions: [number, number, number][] = [[0, 0, 0], [0.5, 0.3, 0], [-0.5, 0.3, 0], [0.3, -0.4, 0.2], [-0.3, -0.4, -0.2], [0, 0.5, -0.3]]
  return (
    <group ref={groupRef}>
      <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.2}>
        {/* Bees */}
        {beePositions.map((pos, i) => (
          <group key={i} position={pos}>
            <Sphere args={[0.1, 12, 12]} scale={[1.2, 0.8, 0.8]}>
              <meshStandardMaterial color="#ffc107" emissive="#ff9800" emissiveIntensity={0.3} />
            </Sphere>
            {/* Stripes */}
            <Torus args={[0.08, 0.02, 8, 16]} rotation={[Math.PI / 2, 0, 0]} position={[0.03, 0, 0]}>
              <meshStandardMaterial color="#212121" />
            </Torus>
          </group>
        ))}
        {/* Neural connections between bees */}
        {beePositions.slice(1).map((pos, i) => (
          <Cylinder key={i} args={[0.01, 0.01, new THREE.Vector3(...pos).distanceTo(new THREE.Vector3(...beePositions[0])), 4]} 
            position={[(pos[0] + beePositions[0][0]) / 2, (pos[1] + beePositions[0][1]) / 2, (pos[2] + beePositions[0][2]) / 2]}
            rotation={[Math.atan2(pos[1], pos[0]), 0, Math.atan2(pos[2], Math.sqrt(pos[0] ** 2 + pos[1] ** 2))]}>
            <meshStandardMaterial color="#ffeb3b" emissive="#ffc107" emissiveIntensity={0.8} transparent opacity={0.6} />
          </Cylinder>
        ))}
      </Float>
      <pointLight position={[0, 0.5, 1]} intensity={1} color="#ffc107" />
    </group>
  )
}

// Super Strength - Beetle with leverage mechanics
function SuperStrengthModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
  })
  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.25}>
        {/* Beetle body */}
        <Sphere args={[0.35, 32, 32]} scale={[1.3, 0.8, 1]}>
          <meshStandardMaterial color="#1b5e20" emissive="#2e7d32" emissiveIntensity={0.3} metalness={0.7} roughness={0.3} />
        </Sphere>
        {/* Horn (for leverage) */}
        <Cone args={[0.08, 0.5, 8]} position={[0.3, 0.2, 0]} rotation={[0, 0, -0.5]}>
          <meshStandardMaterial color="#33691e" emissive="#558b2f" emissiveIntensity={0.2} metalness={0.8} roughness={0.2} />
        </Cone>
        {/* Powerful legs */}
        {[...Array(6)].map((_, i) => {
          const side = i < 3 ? -1 : 1
          const pos = i % 3
          return (
            <Cylinder key={i} args={[0.04, 0.02, 0.4, 6]} position={[side * 0.3, -0.15, -0.2 + pos * 0.2]} rotation={[0.5, 0, side * 0.8]}>
              <meshStandardMaterial color="#2e7d32" metalness={0.6} roughness={0.4} />
            </Cylinder>
          )
        })}
        {/* Weight being lifted */}
        <Box args={[0.3, 0.3, 0.3]} position={[0, 0.6, 0]}>
          <meshStandardMaterial color="#757575" metalness={0.8} roughness={0.2} />
        </Box>
      </Float>
      <pointLight position={[0, 1, 1]} intensity={1} color="#4caf50" />
    </group>
  )
}

// ============================================
// NEW DETAILED MODELS - OTHER CATEGORIES
// ============================================

// Desiccation Resistance - Tardigrade tun state
function DesiccationResistanceModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
  })
  return (
    <group ref={groupRef}>
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.15}>
        {/* Tardigrade barrel body (tun state - dehydrated) */}
        <Sphere args={[0.4, 32, 32]} scale={[1, 0.8, 0.8]}>
          <meshStandardMaterial color="#a1887f" emissive="#8d6e63" emissiveIntensity={0.2} />
        </Sphere>
        {/* Retracted legs */}
        {[...Array(8)].map((_, i) => (
          <Sphere key={i} args={[0.08, 8, 8]} position={[Math.cos(i * Math.PI / 4) * 0.35, -0.2, Math.sin(i * Math.PI / 4) * 0.3]}>
            <meshStandardMaterial color="#8d6e63" />
          </Sphere>
        ))}
        {/* Trehalose glass coating (protective) */}
        <Sphere args={[0.45, 16, 16]}>
          <meshStandardMaterial color="#ffcc80" transparent opacity={0.3} />
        </Sphere>
        {/* Dehydration lines */}
        {[...Array(5)].map((_, i) => (
          <Torus key={i} args={[0.3 - i * 0.03, 0.01, 8, 32]} position={[0, -0.2 + i * 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#6d4c41" />
          </Torus>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={0.8} color="#a1887f" />
    </group>
  )
}

// Alkaliphilic - Sodium/pH regulation
function AlkaliphilicModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
  })
  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Cell membrane */}
        <Sphere args={[0.5, 32, 32]}>
          <meshStandardMaterial color="#5c6bc0" emissive="#3f51b5" emissiveIntensity={0.3} transparent opacity={0.7} />
        </Sphere>
        {/* Na+/H+ antiporter channels */}
        {[...Array(6)].map((_, i) => (
          <Cylinder key={i} args={[0.06, 0.06, 0.2, 8]} position={[Math.cos(i * Math.PI / 3) * 0.5, Math.sin(i * Math.PI / 3) * 0.5, 0]} rotation={[0, 0, i * Math.PI / 3]}>
            <meshStandardMaterial color="#7986cb" emissive="#5c6bc0" emissiveIntensity={0.5} />
          </Cylinder>
        ))}
        {/* pH indicator gradient */}
        <Sphere args={[0.3, 16, 16]}>
          <meshStandardMaterial color="#9fa8da" emissive="#7986cb" emissiveIntensity={0.4} />
        </Sphere>
        {/* OH- ions (alkaline) */}
        {[...Array(8)].map((_, i) => (
          <Sphere key={i} args={[0.04, 6, 6]} position={[(Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8]}>
            <meshStandardMaterial color="#e8eaf6" emissive="#c5cae9" emissiveIntensity={0.8} />
          </Sphere>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#5c6bc0" />
    </group>
  )
}

// Chemosynthetic Models
function SulfurOxidationModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
  })
  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Sulfur oxidizing bacterium */}
        <Cylinder args={[0.2, 0.2, 0.6, 16]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#fdd835" emissive="#f9a825" emissiveIntensity={0.4} />
        </Cylinder>
        {/* Sulfur granules inside */}
        {[...Array(5)].map((_, i) => (
          <Sphere key={i} args={[0.08, 8, 8]} position={[(Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.4]}>
            <meshStandardMaterial color="#ffeb3b" emissive="#ffc107" emissiveIntensity={0.6} />
          </Sphere>
        ))}
        {/* H2S molecules incoming */}
        {[...Array(4)].map((_, i) => (
          <group key={i} position={[-0.6 - i * 0.2, (Math.random() - 0.5) * 0.3, 0]}>
            <Sphere args={[0.06, 8, 8]}>
              <meshStandardMaterial color="#ffff00" emissive="#ffeb3b" emissiveIntensity={0.8} />
            </Sphere>
          </group>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1.5} color="#ffc107" />
    </group>
  )
}

function IronOxidationModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
  })
  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Fe2+ (ferrous) - incoming */}
        {[...Array(4)].map((_, i) => (
          <Icosahedron key={i} args={[0.1, 0]} position={[-0.6, -0.3 + i * 0.2, 0]}>
            <meshStandardMaterial color="#78909c" emissive="#607d8b" emissiveIntensity={0.4} metalness={0.9} roughness={0.1} />
          </Icosahedron>
        ))}
        {/* Oxidation reaction zone */}
        <Torus args={[0.3, 0.08, 8, 32]}>
          <meshStandardMaterial color="#ff7043" emissive="#ff5722" emissiveIntensity={0.6} />
        </Torus>
        {/* Fe3+ (ferric) - oxidized rust */}
        {[...Array(4)].map((_, i) => (
          <Icosahedron key={i} args={[0.1, 0]} position={[0.6, -0.3 + i * 0.2, 0]}>
            <meshStandardMaterial color="#bf360c" emissive="#e64a19" emissiveIntensity={0.5} metalness={0.7} roughness={0.3} />
          </Icosahedron>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1.2} color="#ff5722" />
    </group>
  )
}

function HydrogenMetabolismModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.25
  })
  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Hydrogenase enzyme */}
        <Icosahedron args={[0.4, 1]}>
          <meshStandardMaterial color="#0288d1" emissive="#0277bd" emissiveIntensity={0.4} />
        </Icosahedron>
        {/* NiFe active site */}
        <Sphere args={[0.1, 16, 16]} position={[0, 0, 0.3]}>
          <meshStandardMaterial color="#ffc107" emissive="#ff9800" emissiveIntensity={0.8} metalness={0.9} roughness={0.1} />
        </Sphere>
        {/* H2 molecules */}
        {[...Array(6)].map((_, i) => (
          <group key={i} position={[(Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2]}>
            <Sphere args={[0.04, 8, 8]} position={[-0.03, 0, 0]}>
              <meshStandardMaterial color="#e3f2fd" emissive="#bbdefb" emissiveIntensity={0.6} />
            </Sphere>
            <Sphere args={[0.04, 8, 8]} position={[0.03, 0, 0]}>
              <meshStandardMaterial color="#e3f2fd" emissive="#bbdefb" emissiveIntensity={0.6} />
            </Sphere>
          </group>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1.2} color="#03a9f4" />
    </group>
  )
}

function MethaneOxidationModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
  })
  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Methane monooxygenase enzyme */}
        <Sphere args={[0.35, 32, 32]}>
          <meshStandardMaterial color="#00897b" emissive="#00796b" emissiveIntensity={0.4} />
        </Sphere>
        {/* CH4 molecules */}
        {[...Array(4)].map((_, i) => (
          <group key={i} position={[-0.7 + i * 0.15, (Math.random() - 0.5) * 0.4, 0]}>
            <Sphere args={[0.06, 8, 8]}>
              <meshStandardMaterial color="#212121" />
            </Sphere>
            {[...Array(4)].map((_, j) => (
              <Sphere key={j} args={[0.025, 6, 6]} position={[Math.cos(j * Math.PI / 2) * 0.08, Math.sin(j * Math.PI / 2) * 0.08, 0]}>
                <meshStandardMaterial color="#e0e0e0" />
              </Sphere>
            ))}
          </group>
        ))}
        {/* CO2 output */}
        <group position={[0.6, 0, 0]}>
          <Sphere args={[0.05, 8, 8]}>
            <meshStandardMaterial color="#424242" />
          </Sphere>
          <Sphere args={[0.035, 6, 6]} position={[-0.08, 0, 0]}>
            <meshStandardMaterial color="#ef5350" />
          </Sphere>
          <Sphere args={[0.035, 6, 6]} position={[0.08, 0, 0]}>
            <meshStandardMaterial color="#ef5350" />
          </Sphere>
        </group>
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#26a69a" />
    </group>
  )
}

function AmmoniaOxidationModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
  })
  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Ammonia monooxygenase */}
        <Box args={[0.5, 0.4, 0.3]} rotation={[0, 0, 0.2]}>
          <meshStandardMaterial color="#7cb342" emissive="#689f38" emissiveIntensity={0.4} />
        </Box>
        {/* NH3 molecules */}
        {[...Array(3)].map((_, i) => (
          <group key={i} position={[-0.6, -0.2 + i * 0.2, 0]}>
            <Sphere args={[0.06, 8, 8]}>
              <meshStandardMaterial color="#42a5f5" emissive="#2196f3" emissiveIntensity={0.5} />
            </Sphere>
            {[...Array(3)].map((_, j) => (
              <Sphere key={j} args={[0.025, 6, 6]} position={[Math.cos(j * 2 * Math.PI / 3) * 0.07, Math.sin(j * 2 * Math.PI / 3) * 0.07, 0]}>
                <meshStandardMaterial color="#e0e0e0" />
              </Sphere>
            ))}
          </group>
        ))}
        {/* NO2- output */}
        <group position={[0.6, 0, 0]}>
          <Sphere args={[0.05, 8, 8]}>
            <meshStandardMaterial color="#42a5f5" />
          </Sphere>
          <Sphere args={[0.04, 6, 6]} position={[-0.07, 0, 0]}>
            <meshStandardMaterial color="#ef5350" />
          </Sphere>
          <Sphere args={[0.04, 6, 6]} position={[0.07, 0, 0]}>
            <meshStandardMaterial color="#ef5350" />
          </Sphere>
        </group>
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1} color="#8bc34a" />
    </group>
  )
}

function ArseniteOxidationModel() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
  })
  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Arsenite oxidase enzyme */}
        <Icosahedron args={[0.35, 1]}>
          <meshStandardMaterial color="#7b1fa2" emissive="#6a1b9a" emissiveIntensity={0.4} />
        </Icosahedron>
        {/* As3+ (arsenite) - toxic incoming */}
        {[...Array(3)].map((_, i) => (
          <Icosahedron key={i} args={[0.08, 0]} position={[-0.6, -0.2 + i * 0.2, 0]}>
            <meshStandardMaterial color="#ce93d8" emissive="#ba68c8" emissiveIntensity={0.6} />
          </Icosahedron>
        ))}
        {/* As5+ (arsenate) - less toxic output */}
        {[...Array(3)].map((_, i) => (
          <Icosahedron key={i} args={[0.08, 0]} position={[0.6, -0.2 + i * 0.2, 0]}>
            <meshStandardMaterial color="#e1bee7" emissive="#ce93d8" emissiveIntensity={0.4} />
          </Icosahedron>
        ))}
        {/* Electrons released */}
        {[...Array(5)].map((_, i) => (
          <Sphere key={i} args={[0.03, 6, 6]} position={[(Math.random() - 0.5) * 0.4, 0.5 + i * 0.1, 0]}>
            <meshStandardMaterial color="#ffeb3b" emissive="#ffc107" emissiveIntensity={1} />
          </Sphere>
        ))}
      </Float>
      <pointLight position={[0, 0, 2]} intensity={1.2} color="#9c27b0" />
    </group>
  )
}

// Simple placeholder models for remaining traits (can be enhanced later)
const CAMPhotosynthesisModel = C4PhotosynthesisModel
const SalinityToleranceModel = HalophilicModel
const RapidCellDivisionModel = FastGrowthModel
const DeepRootSystemModel = DeepRootModel
const UVBProtectionModel = UVProtectionModel
const AntibioticProductionModel = BioplasticProductionModel
const PlasticDegradationModel = LigninDecompositionModel
const PsychedelicCompoundsModel = BioluminescenceModel
const MycorrhizalSymbiosisModel = SymbiosisModel
const SporeDormancyModel = SporeFormationModel
const BiofuelProductionModel = OxygenProductionModel
const CRISPRSelfRepairModel = SelfRepairModel
const QuorumSensingModel = BiosensorModel
const GeneticKillSwitchModel = SelfRepairModel
const CarbonCaptureEnhancedModel = C4PhotosynthesisModel
const BiosensorArsenicModel = BiosensorModel
const BioplasticPHAModel = BioplasticProductionModel
const HeavyMetalBioremediationModel = MetalAccumulationModel
const LimbRegenerationModel = RegenerationModel
const AntifreezeProteinsModel = AntifreezeProteinModel
const SpiderSilkModel = SilkProductionModel
const EcholocationModel = BiosensorModel
const HibernationModel = PsychrophilicModel
const InfraredVisionModel = BiosensorModel
const MagneticNavigationModel = BiosensorModel
const VenomousBiteModel = VenomSynthesisModel
const CRISPRImmunityModel = SelfRepairModel
const AntimicrobialPeptidesModel = VenomSynthesisModel
const AntiviralRNASilencingModel = SelfRepairModel
const OxidativeBurstModel = OxygenProductionModel
const HypersensitiveResponseModel = VenomSynthesisModel
const SystemicAcquiredResistanceModel = BiofilmResistanceModel
const ElectroreceptionModel = ElectricOrganModel
const DistributedNeuralNetworkModel = MyceliumNetworkModel
const PhotoreceptorDiversityModel = CompoundEyesModel
const MagnetoreceptionModel = BiosensorModel
const LateralLineSystemModel = OsmoregulationModel
const RapidLearningModel = BiosensorModel

// ============================================
// MAIN COMPONENT
// ============================================

// Complete trait models mapping - ALL 73 TRAITS
const traitModels: Record<string, React.FC> = {
  // Extremophile (8)
  Thermophilic: ThermophilicModel,
  Radioresistance: RadioresistanceModel,
  Psychrophilic: PsychrophilicModel,
  Halophilic: HalophilicModel,
  Acidophilic: AcidophilicModel,
  Barophilic: BarophilicModel,
  "Desiccation Resistance": DesiccationResistanceModel,
  Alkaliphilic: AlkaliphilicModel,
  
  // Plant (8)
  "C4 Photosynthesis": C4PhotosynthesisModel,
  "CAM Photosynthesis": CAMPhotosynthesisModel,
  "Drought Resistance": DroughtResistanceModel,
  "Nitrogen Fixation": NitrogenFixationModel,
  "Rapid Cell Division": RapidCellDivisionModel,
  "Deep Root System": DeepRootSystemModel,
  "UV-B Protection": UVBProtectionModel,
  "Salinity Tolerance": SalinityToleranceModel,
  // Legacy names
  "Fast Growth": FastGrowthModel,
  "Deep Root": DeepRootModel,
  "UV Protection": UVProtectionModel,
  
  // Marine (8)
  Bioluminescence: BioluminescenceModel,
  "Pressure Adaptation": PressureAdaptationModel,
  "Jet Propulsion": JetPropulsionModel,
  "Ink Production": InkProductionModel,
  "Electric Organ": ElectricOrganModel,
  "Coral Symbiosis": CoralSymbiosisModel,
  "Chromatophore System": ChromatophoreSystemModel,
  Osmoregulation: OsmoregulationModel,
  
  // Insect (8)
  Exoskeleton: ExoskeletonModel,
  "Compound Eyes": CompoundEyesModel,
  Metamorphosis: MetamorphosisModel,
  "Flight Muscles": FlightMusclesModel,
  "Pheromone Communication": PheromoneCommunicationModel,
  "Hive Mind Behavior": HiveMindBehaviorModel,
  "Venom Synthesis": VenomSynthesisModel,
  "Super Strength": SuperStrengthModel,
  
  // Fungal (7)
  "Mycelium Network": MyceliumNetworkModel,
  "Lignin Decomposition": LigninDecompositionModel,
  "Mycorrhizal Symbiosis": MycorrhizalSymbiosisModel,
  "Spore Dormancy": SporeDormancyModel,
  "Antibiotic Production": AntibioticProductionModel,
  "Plastic Degradation": PlasticDegradationModel,
  "Psychedelic Compounds": PsychedelicCompoundsModel,
  // Legacy names
  Symbiosis: SymbiosisModel,
  "Spore Formation": SporeFormationModel,
  
  // Synthetic (8)
  "Biosensor (Arsenic)": BiosensorArsenicModel,
  "Bioplastic (PHA)": BioplasticPHAModel,
  "Heavy Metal Bioremediation": HeavyMetalBioremediationModel,
  "Biofuel Production": BiofuelProductionModel,
  "CRISPR Self-Repair": CRISPRSelfRepairModel,
  "Quorum Sensing": QuorumSensingModel,
  "Genetic Kill Switch": GeneticKillSwitchModel,
  "Carbon Capture Enhanced": CarbonCaptureEnhancedModel,
  // Legacy names
  Biosensor: BiosensorModel,
  "Bioplastic Production": BioplasticProductionModel,
  "Metal Accumulation": MetalAccumulationModel,
  "Oxygen Production": OxygenProductionModel,
  "Self-Repair": SelfRepairModel,
  "Biofilm Resistance": BiofilmResistanceModel,
  
  // Animal (8)
  "Limb Regeneration": LimbRegenerationModel,
  "Antifreeze Proteins": AntifreezeProteinsModel,
  "Spider Silk": SpiderSilkModel,
  Echolocation: EcholocationModel,
  Hibernation: HibernationModel,
  "Infrared Vision": InfraredVisionModel,
  "Magnetic Navigation": MagneticNavigationModel,
  "Venomous Bite": VenomousBiteModel,
  // Legacy names
  Regeneration: RegenerationModel,
  "Antifreeze Protein": AntifreezeProteinModel,
  "Silk Production": SilkProductionModel,
  Camouflage: CamouflageModel,
  
  // Chemosynthetic (6)
  "Sulfur Oxidation": SulfurOxidationModel,
  "Iron Oxidation": IronOxidationModel,
  "Hydrogen Metabolism": HydrogenMetabolismModel,
  "Methane Oxidation": MethaneOxidationModel,
  "Ammonia Oxidation": AmmoniaOxidationModel,
  "Arsenite Oxidation": ArseniteOxidationModel,
  
  // Immune Defense (6)
  "CRISPR Immunity": CRISPRImmunityModel,
  "Antimicrobial Peptides": AntimicrobialPeptidesModel,
  "Antiviral RNA Silencing": AntiviralRNASilencingModel,
  "Oxidative Burst": OxidativeBurstModel,
  "Hypersensitive Response": HypersensitiveResponseModel,
  "Systemic Acquired Resistance": SystemicAcquiredResistanceModel,
  
  // Neural/Sensory (6)
  Electroreception: ElectroreceptionModel,
  "Distributed Neural Network": DistributedNeuralNetworkModel,
  "Photoreceptor Diversity": PhotoreceptorDiversityModel,
  Magnetoreception: MagnetoreceptionModel,
  "Lateral Line System": LateralLineSystemModel,
  "Rapid Learning": RapidLearningModel,
}

interface TraitVisualizer3DProps {
  selectedTraits: string[]
  activePreview?: string | null
  lastSelected?: string | null // Most recently selected trait
}

export function TraitVisualizer3D({ selectedTraits, activePreview, lastSelected }: TraitVisualizer3DProps) {
  // Priority: 1. Active hover preview, 2. Last selected trait, 3. First selected trait
  const displayTrait = activePreview || lastSelected || selectedTraits[0]
  const ModelComponent = displayTrait ? traitModels[displayTrait] : null

  if (!ModelComponent) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/50 to-background rounded-xl border border-border">
        <div className="text-center text-muted-foreground">
          <div className="text-4xl mb-2">🧬</div>
          <p className="text-sm">Select a trait to see 3D visualization</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background border border-border relative">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <ModelComponent />
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          minDistance={2} 
          maxDistance={8}
          autoRotate={false}
        />
      </Canvas>
      <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-lg border border-border">
        <span className="text-xs text-muted-foreground">
          {displayTrait} • Drag to rotate
        </span>
      </div>
    </div>
  )
}
