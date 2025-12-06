# Digital Arboretum 🧬

<p align="center">
  <strong>An AI-powered synthetic biology platform for designing life from code.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Claude_Sonnet_4-Anthropic-CC785C?logo=anthropic" alt="Claude Sonnet 4" />
  <img src="https://img.shields.io/badge/Three.js-r181-000000?logo=threedotjs" alt="Three.js" />
</p>

---

## 🌟 Overview

Digital Arboretum bridges computational biology and synthetic life. Design chimeric organisms by combining traits from bacteria, plants, fungi, marine life, and more — then simulate their survival in extreme planetary environments like Mars, Europa, and Titan.

The platform uses **Claude Sonnet 4** to intelligently generate realistic genetic sequences (DNA, RNA, proteins, or plasmids) based on selected biological traits, with real-time 3D visualization powered by Three.js.

---

## ✨ Features

### 🧬 AI DNA Designer
- **73+ biological traits** across 10 categories:
  - 🦠 Extremophile (thermophilic, radioresistance, psychrophilic, etc.)
  - 🌱 Plant (C4/CAM photosynthesis, nitrogen fixation, drought resistance)
  - 🐙 Marine (bioluminescence, pressure adaptation, chromatophores)
  - 🦋 Insect (exoskeleton, compound eyes, metamorphosis, flight muscles)
  - 🍄 Fungal (mycelium networks, lignin decomposition, spore dormancy)
  - ⚗️ Synthetic (biosensors, bioplastics, CRISPR self-repair, kill switches)
  - 🐾 Animal (limb regeneration, spider silk, echolocation, hibernation)
  - ⚡ Chemosynthetic (sulfur/iron/hydrogen/methane oxidation)
  - 🛡️ Immune Defense (CRISPR immunity, antimicrobial peptides, oxidative burst)
  - 🧠 Neural/Sensory (electroreception, distributed neural networks, magnetoreception)
- **Custom trait creation** — describe any trait and AI generates the genetic sequence
- **Smart structure detection** — automatically outputs DNA, RNA, Protein, or Plasmid based on selected traits
- **Real-time 3D visualization** with React Three Fiber

### 🌍 Planetary Environment Simulator
- Simulate organism survival on **Mars**, **Europa**, **Titan**, and **Venus**
- AI analyzes trait-environment compatibility
- Detailed survival probability with critical factors and adaptation recommendations

### 🔄 Evolutionary Optimizer
- Genetic algorithm simulation across **100–500 generations**
- Configurable population size, mutation rate, and selection pressure
- Track fitness history, emergent traits, and evolutionary trade-offs

### 🧪 Synthesis Interface
- Generate real-world DNA synthesis plans
- Codon optimization for target expression systems (E. coli, Yeast, Mammalian, Plant)
- Assembly methods: Gibson Assembly, Golden Gate, Traditional Cloning
- Risk assessment and vendor recommendations

### 💬 AI Chat Assistant
- Integrated chat widget powered by Claude for questions about your organism design
- Context-aware responses based on selected traits

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19 + Tailwind CSS 4 |
| **Components** | Radix UI + shadcn/ui |
| **3D Graphics** | Three.js r181 + React Three Fiber 9 |
| **AI** | Claude Sonnet 4 (Anthropic SDK) |
| **Charts** | Recharts |
| **Analytics** | Vercel Analytics |
| **Fonts** | Inter + JetBrains Mono |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm**, **yarn**, **pnpm**, or **bun**
- **Anthropic API key** for Claude AI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd embodied_cognition
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or: yarn install | pnpm install | bun install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
embodied_cognition/
├── app/
│   ├── api/
│   │   ├── chat/           # AI chat endpoint
│   │   ├── evolve/         # Evolutionary optimization
│   │   ├── generate-dna/   # DNA/RNA/Protein generation
│   │   ├── simulate/       # Environment simulation
│   │   └── synthesize/     # Synthesis planning
│   ├── globals.css         # Dark biotech theme (OKLCH colors)
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Main application page
├── components/
│   ├── chat-widget.tsx           # AI assistant chat
│   ├── dna-designer.tsx          # Main trait selector interface
│   ├── dna-helix.tsx             # 3D DNA helix animation
│   ├── dna-sequence-3d.tsx       # 3D sequence visualization
│   ├── environment-simulator.tsx # Planetary simulation
│   ├── evolutionary-optimizer.tsx
│   ├── features-section.tsx
│   ├── genetic-structure-3d.tsx  # DNA/RNA/Protein 3D models
│   ├── hero-section.tsx
│   ├── navigation.tsx
│   ├── synthesis-interface.tsx
│   ├── trait-info-dialog.tsx     # Scientific references popup
│   ├── trait-visualizer-3d.tsx   # 3D trait preview
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── organism-context.tsx      # Global state (React Context)
│   ├── traits-data.ts            # 73+ trait definitions with references
│   └── utils.ts                  # Utility functions
└── public/
```

---

## 🔬 How It Works

```
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Design    │───▶│   Generate   │───▶│    Simulate     │
│ Select 73+  │    │ Claude AI    │    │ Mars/Europa/    │
│   traits    │    │ creates DNA  │    │ Titan/Venus     │
└─────────────┘    └──────────────┘    └─────────────────┘
                          │
                          ▼
              ┌──────────────────────┐
              │       Evolve         │
              │ Genetic algorithm    │
              │ optimizes fitness    │
              └──────────────────────┘
                          │
                          ▼
              ┌──────────────────────┐
              │     Synthesize       │
              │ Real-world DNA       │
              │ assembly plans       │
              └──────────────────────┘
```

1. **Design** — Select biological traits from 10 categories or create custom traits
2. **Generate** — Claude AI creates realistic genetic sequences (DNA/RNA/Protein/Plasmid)
3. **Simulate** — Test organism viability in extreme planetary environments
4. **Evolve** — Run evolutionary optimization over generations
5. **Synthesize** — Generate actionable DNA synthesis plans for lab work

---

## 🎯 Use Cases

| Domain | Application |
|--------|-------------|
| **Astrobiology Research** | Design organisms for space colonization scenarios |
| **Synthetic Biology Education** | Learn genetic engineering concepts interactively |
| **Speculative Design** | Explore chimeric organism possibilities |
| **Bioart Projects** | Create fictional organisms with scientific grounding |
| **Rapid Prototyping** | Generate starting sequences for real lab work |

---

## 🎨 Design Philosophy

Digital Arboretum features a **dark biotech aesthetic** with bioluminescent green accents, inspired by:
- Deep-sea organisms and hydrothermal vent ecosystems
- Laboratory interfaces and bioinformatics tools
- Modern IDE color schemes (OKLCH color space)

The UI prioritizes:
- Scientific accuracy with peer-reviewed references for each trait
- Real-time 3D feedback as you design
- Bilingual support (English + Traditional Chinese trait names)

---

## 📚 Trait Database

Each trait in the database includes:
- **Scientific name and gene identifiers**
- **Source organism** (e.g., *Deinococcus radiodurans*, *Tardigrade*)
- **Molecular mechanism** explanation
- **Peer-reviewed references** (Wikipedia, NCBI, Nature, etc.)
- **Bilingual naming** (English + Traditional Chinese)

Example trait entry:
```typescript
{
  name: "Radioresistance",
  description: "Withstands 5,000+ Gy radiation via efficient DNA repair",
  gene: "RecA/DdrB",
  chineseName: "耐輻射",
  source: "Deinococcus radiodurans",
  mechanism: "Multiple genome copies + enhanced RecA-mediated repair",
  references: [/* Wikipedia, NCBI, Nature papers */]
}
```

---

## 📄 License

Created for the **Cursor Hackathon** 🏆

---

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com) — Claude AI
- [Vercel](https://vercel.com) — Next.js framework
- [shadcn/ui](https://ui.shadcn.com) — Component library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) — 3D rendering
- Scientific trait data sourced from peer-reviewed research

---

<p align="center">
  <strong>Bridging code and biology</strong> 🧬✨
</p>
