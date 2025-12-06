# Digital Arboretum 🧬

An AI-powered synthetic biology platform for designing life from code.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)
![Claude AI](https://img.shields.io/badge/Claude-Sonnet%204-CC785C?logo=anthropic)

## 🌟 Overview

Digital Arboretum bridges computational biology and synthetic life. Design chimeric organisms by combining traits from bacteria, plants, fungi, marine life, and more — then simulate their survival on extreme planetary environments like Mars, Europa, and Titan.

## ✨ Features

### 🧬 AI DNA Designer
- **60+ biological traits** across 9 categories (Extremophile, Plant, Marine, Insect, Fungal, Synthetic, Animal, Chemosynthetic, Immune/Neural)
- **Custom trait creation** — describe any trait and AI generates the genetic sequence
- **Smart structure detection** — automatically generates DNA, RNA, Protein, or Plasmid based on selected traits
- **Real-time 3D visualization** with Three.js

### 🌍 Planetary Environment Simulator
- Simulate organism survival on **Mars**, **Europa**, **Titan**, and **Venus**
- AI analyzes trait-environment compatibility
- Detailed survival probability with critical factors and recommendations

### 🔄 Evolutionary Optimizer
- Genetic algorithm simulation across **100-500 generations**
- Configurable population size, mutation rate, and selection pressure
- Track fitness history, emergent traits, and evolutionary trade-offs

### 🧪 Synthesis Interface
- Generate real-world DNA synthesis plans
- Codon optimization for target expression systems (E. coli, Yeast, Mammalian, Plant)
- Assembly methods: Gibson, Golden Gate, Traditional Cloning
- Risk assessment and vendor recommendations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Anthropic API key (for Claude AI)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd embodied_cognition
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19 + Tailwind CSS 4 |
| Components | Radix UI + shadcn/ui |
| 3D Graphics | Three.js + React Three Fiber |
| AI | Claude Sonnet 4 (Anthropic) |
| Charts | Recharts |
| Analytics | Vercel Analytics |

## 📁 Project Structure

```
embodied_cognition/
├── app/
│   ├── api/
│   │   ├── generate-dna/    # DNA sequence generation
│   │   ├── simulate/        # Environment simulation
│   │   ├── evolve/          # Evolutionary optimization
│   │   └── synthesize/      # Synthesis planning
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── dna-designer.tsx     # Main trait selector
│   ├── environment-simulator.tsx
│   ├── evolutionary-optimizer.tsx
│   ├── synthesis-interface.tsx
│   ├── hero-section.tsx
│   ├── navigation.tsx
│   ├── dna-helix.tsx        # 3D DNA visualization
│   ├── trait-visualizer-3d.tsx
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── organism-context.tsx # Global state management
│   ├── traits-data.ts       # 60+ trait definitions
│   └── utils.ts
└── public/
```

## 🔬 How It Works

1. **Design** — Select biological traits from different kingdoms or create custom traits
2. **Generate** — Claude AI creates realistic genetic sequences (DNA/RNA/Protein)
3. **Simulate** — Test organism viability in extreme planetary environments
4. **Evolve** — Run evolutionary optimization to improve fitness
5. **Synthesize** — Generate actionable DNA synthesis plans

## 🎯 Use Cases

- **Astrobiology Research** — Design organisms for space colonization
- **Synthetic Biology Education** — Learn about genetic engineering concepts
- **Speculative Design** — Explore chimeric organism possibilities
- **Bioart Projects** — Create fictional organisms with scientific grounding

## 📄 License

This project was created for the Cursor Hackathon.

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com) for Claude AI
- [Vercel](https://vercel.com) for Next.js
- [shadcn/ui](https://ui.shadcn.com) for UI components
- Trait data sourced from real biological research

---

**Bridging code and biology** 🧬✨
