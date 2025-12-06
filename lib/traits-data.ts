// Comprehensive trait categories for synthetic biology design

export interface TraitReference {
  title: string
  url: string
  type: "wikipedia" | "paper" | "database" | "article"
}

export interface Trait {
  name: string
  description: string
  gene: string
  chineseName: string
  color: string
  source?: string // Source organism
  mechanism?: string // How it works
  references?: TraitReference[] // Scientific references
}

export interface TraitCategory {
  id: string
  name: string
  chineseName: string
  icon: string
  color: string
  description: string
  traits: Trait[]
}

export const traitCategories: TraitCategory[] = [
  // ============================================
  // EXTREMOPHILE TRAITS - Survive extreme environments
  // ============================================
  {
    id: "extremophile",
    name: "Extremophile",
    chineseName: "極端微生物",
    icon: "🦠",
    color: "from-orange-500 to-red-500",
    description: "Survive extreme environments like Mars or Europa",
    traits: [
      {
        name: "Thermophilic",
        description: "Survives extreme heat up to 122°C via heat shock proteins that refold denatured proteins",
        gene: "HSP70",
        chineseName: "嗜熱",
        color: "from-orange-500 to-red-500",
        source: "Thermus aquaticus",
        mechanism: "Chaperone proteins prevent protein aggregation at high temperatures",
        references: [
          { title: "Thermus aquaticus - Wikipedia", url: "https://en.wikipedia.org/wiki/Thermus_aquaticus", type: "wikipedia" },
          { title: "Heat Shock Protein 70 (HSP70)", url: "https://en.wikipedia.org/wiki/Hsp70", type: "wikipedia" },
          { title: "NCBI Gene: HSP70", url: "https://www.ncbi.nlm.nih.gov/gene/3303", type: "database" },
        ],
      },
      {
        name: "Radioresistance",
        description: "Withstands 5,000+ Gy radiation via efficient DNA repair mechanisms",
        gene: "RecA/DdrB",
        chineseName: "耐輻射",
        color: "from-purple-500 to-blue-500",
        source: "Deinococcus radiodurans",
        mechanism: "Multiple genome copies + enhanced RecA-mediated recombination repair",
        references: [
          { title: "Deinococcus radiodurans - Wikipedia", url: "https://en.wikipedia.org/wiki/Deinococcus_radiodurans", type: "wikipedia" },
          { title: "RecA protein and DNA repair", url: "https://en.wikipedia.org/wiki/RecA", type: "wikipedia" },
          { title: "Extreme radiation resistance mechanisms", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3319128/", type: "paper" },
        ],
      },
      {
        name: "Psychrophilic",
        description: "Active metabolism at -20°C via cold-adapted enzymes and antifreeze compounds",
        gene: "CspA/AFP",
        chineseName: "嗜冷",
        color: "from-cyan-400 to-blue-400",
        source: "Psychromonas ingrahamii",
        mechanism: "Cold shock proteins + increased membrane fluidity",
        references: [
          { title: "Psychrophile - Wikipedia", url: "https://en.wikipedia.org/wiki/Psychrophile", type: "wikipedia" },
          { title: "Cold shock proteins", url: "https://en.wikipedia.org/wiki/Cold_shock_protein", type: "wikipedia" },
          { title: "Psychromonas ingrahamii genome", url: "https://www.ncbi.nlm.nih.gov/genome/?term=Psychromonas+ingrahamii", type: "database" },
        ],
      },
      {
        name: "Halophilic",
        description: "Thrives in 25%+ salt concentration via compatible solute accumulation",
        gene: "OsmC/BetA",
        chineseName: "嗜鹽",
        color: "from-amber-400 to-orange-400",
        source: "Halobacterium salinarum",
        mechanism: "K+ accumulation + glycine betaine synthesis for osmotic balance",
        references: [
          { title: "Halophile - Wikipedia", url: "https://en.wikipedia.org/wiki/Halophile", type: "wikipedia" },
          { title: "Halobacterium salinarum", url: "https://en.wikipedia.org/wiki/Halobacterium_salinarum", type: "wikipedia" },
          { title: "Compatible solutes in halophiles", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3591759/", type: "paper" },
        ],
      },
      {
        name: "Acidophilic",
        description: "Survives pH < 3 via proton pumps and acid-stable membrane proteins",
        gene: "AtpB/Slp",
        chineseName: "嗜酸",
        color: "from-pink-500 to-purple-500",
        source: "Acidithiobacillus ferrooxidans",
        mechanism: "Reversed membrane potential + cytoplasmic buffering",
        references: [
          { title: "Acidophile - Wikipedia", url: "https://en.wikipedia.org/wiki/Acidophile", type: "wikipedia" },
          { title: "Acidithiobacillus ferrooxidans", url: "https://en.wikipedia.org/wiki/Acidithiobacillus_ferrooxidans", type: "wikipedia" },
          { title: "Acid resistance mechanisms", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3067274/", type: "paper" },
        ],
      },
      {
        name: "Barophilic",
        description: "Functions at 1,100+ atm pressure via pressure-resistant proteins",
        gene: "OmpH/TorA",
        chineseName: "嗜壓",
        color: "from-slate-500 to-zinc-600",
        source: "Pyrococcus yayanosii",
        mechanism: "Compact protein cores + unsaturated membrane lipids",
        references: [
          { title: "Piezophile - Wikipedia", url: "https://en.wikipedia.org/wiki/Piezophile", type: "wikipedia" },
          { title: "Pyrococcus yayanosii", url: "https://en.wikipedia.org/wiki/Pyrococcus_yayanosii", type: "wikipedia" },
          { title: "Deep-sea microbial adaptation", url: "https://www.nature.com/articles/nrmicro2747", type: "paper" },
        ],
      },
      {
        name: "Desiccation Resistance",
        description: "Survives complete dehydration via trehalose glass formation",
        gene: "LEA/TPS",
        chineseName: "抗乾燥",
        color: "from-yellow-600 to-amber-700",
        source: "Tardigrade (Ramazzottius varieornatus)",
        mechanism: "Late embryogenesis abundant proteins + trehalose vitrification",
        references: [
          { title: "Tardigrade - Wikipedia", url: "https://en.wikipedia.org/wiki/Tardigrade", type: "wikipedia" },
          { title: "LEA Proteins", url: "https://en.wikipedia.org/wiki/Late_embryogenesis_abundant_protein", type: "wikipedia" },
          { title: "Tardigrade genome adaptations", url: "https://www.nature.com/articles/ncomms12808", type: "paper" },
        ],
      },
      {
        name: "Alkaliphilic",
        description: "Grows at pH 10+ via sodium-dependent energy coupling",
        gene: "MrpA/AtpD",
        chineseName: "嗜鹼",
        color: "from-indigo-400 to-blue-500",
        source: "Natronomonas pharaonis",
        mechanism: "Na+/H+ antiporters maintain internal pH homeostasis",
        references: [
          { title: "Alkaliphile - Wikipedia", url: "https://en.wikipedia.org/wiki/Alkaliphile", type: "wikipedia" },
          { title: "Natronomonas pharaonis", url: "https://en.wikipedia.org/wiki/Natronomonas_pharaonis", type: "wikipedia" },
          { title: "Alkaliphilic adaptation mechanisms", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3147459/", type: "paper" },
        ],
      },
    ],
  },

  // ============================================
  // PLANT TRAITS - Photosynthesis and growth
  // ============================================
  {
    id: "plant",
    name: "Plant",
    chineseName: "植物特性",
    icon: "🌱",
    color: "from-green-500 to-emerald-500",
    description: "Photosynthesis, growth, and plant adaptations",
    traits: [
      {
        name: "C4 Photosynthesis",
        description: "35% more efficient CO₂ fixation via spatial separation of carbon capture",
        gene: "PEPC/PPDK",
        chineseName: "C4光合作用",
        color: "from-green-400 to-emerald-500",
        source: "Zea mays (Corn)",
        mechanism: "Bundle sheath cells concentrate CO₂ around RuBisCO, eliminating photorespiration",
        references: [
          { title: "C4 carbon fixation - Wikipedia", url: "https://en.wikipedia.org/wiki/C4_carbon_fixation", type: "wikipedia" },
          { title: "PEP carboxylase", url: "https://en.wikipedia.org/wiki/Phosphoenolpyruvate_carboxylase", type: "wikipedia" },
          { title: "C4 photosynthesis evolution", url: "https://www.nature.com/articles/nplants201684", type: "paper" },
        ],
      },
      {
        name: "CAM Photosynthesis",
        description: "Nocturnal CO₂ capture for extreme water conservation",
        gene: "PEPC/MDH",
        chineseName: "CAM光合作用",
        color: "from-lime-500 to-green-600",
        source: "Agave americana",
        mechanism: "Temporal separation - stomata open at night, CO₂ stored as malate",
        references: [
          { title: "CAM photosynthesis - Wikipedia", url: "https://en.wikipedia.org/wiki/Crassulacean_acid_metabolism", type: "wikipedia" },
          { title: "Agave americana", url: "https://en.wikipedia.org/wiki/Agave_americana", type: "wikipedia" },
          { title: "CAM pathway regulation", url: "https://www.annualreviews.org/doi/10.1146/annurev-arplant-042817-040238", type: "paper" },
        ],
      },
      {
        name: "Drought Resistance",
        description: "Survives 6+ months without water via ABA-mediated stomatal closure",
        gene: "DREB2A/P5CS",
        chineseName: "抗旱",
        color: "from-amber-500 to-yellow-600",
        source: "Selaginella lepidophylla (Resurrection plant)",
        mechanism: "Proline accumulation + LEA proteins protect cellular structures",
        references: [
          { title: "Selaginella lepidophylla - Wikipedia", url: "https://en.wikipedia.org/wiki/Selaginella_lepidophylla", type: "wikipedia" },
          { title: "DREB transcription factors", url: "https://en.wikipedia.org/wiki/DREB", type: "wikipedia" },
          { title: "Plant drought tolerance mechanisms", url: "https://www.frontiersin.org/articles/10.3389/fpls.2014.00108/full", type: "paper" },
        ],
      },
      {
        name: "Nitrogen Fixation",
        description: "Converts atmospheric N₂ to bioavailable ammonia",
        gene: "nifHDK",
        chineseName: "固氮",
        color: "from-blue-400 to-cyan-500",
        source: "Rhizobium leguminosarum",
        mechanism: "Nitrogenase enzyme complex reduces N₂ in anaerobic nodule environment",
        references: [
          { title: "Nitrogen fixation - Wikipedia", url: "https://en.wikipedia.org/wiki/Nitrogen_fixation", type: "wikipedia" },
          { title: "Nitrogenase", url: "https://en.wikipedia.org/wiki/Nitrogenase", type: "wikipedia" },
          { title: "Rhizobium-legume symbiosis", url: "https://www.nature.com/articles/nrmicro3074", type: "paper" },
        ],
      },
      {
        name: "Rapid Cell Division",
        description: "10x faster growth via accelerated cell cycle",
        gene: "CycD3/CDK",
        chineseName: "快速生長",
        color: "from-lime-400 to-green-500",
        source: "Bamboo (Phyllostachys edulis)",
        mechanism: "Upregulated cyclin-CDK complexes shorten G1 phase",
        references: [
          { title: "Bamboo - Wikipedia", url: "https://en.wikipedia.org/wiki/Bamboo", type: "wikipedia" },
          { title: "Cyclin-dependent kinase", url: "https://en.wikipedia.org/wiki/Cyclin-dependent_kinase", type: "wikipedia" },
          { title: "Bamboo rapid growth mechanisms", url: "https://www.nature.com/articles/ng.2569", type: "paper" },
        ],
      },
      {
        name: "Deep Root System",
        description: "Roots penetrate 20+ meters for deep water access",
        gene: "DRO1/DEEPER1",
        chineseName: "深根系",
        color: "from-amber-700 to-orange-800",
        source: "Prosopis juliflora (Mesquite)",
        mechanism: "Auxin-regulated gravitropism enhanced in root tips",
        references: [
          { title: "Prosopis juliflora - Wikipedia", url: "https://en.wikipedia.org/wiki/Prosopis_juliflora", type: "wikipedia" },
          { title: "Root gravitropism", url: "https://en.wikipedia.org/wiki/Gravitropism", type: "wikipedia" },
          { title: "DEEPER ROOTING 1 gene", url: "https://www.nature.com/articles/ng.2725", type: "paper" },
        ],
      },
      {
        name: "UV-B Protection",
        description: "Produces flavonoid sunscreen compounds absorbing 280-315nm",
        gene: "CHS/F3H",
        chineseName: "紫外防護",
        color: "from-violet-400 to-purple-500",
        source: "Arabidopsis thaliana",
        mechanism: "Chalcone synthase pathway produces UV-absorbing anthocyanins",
        references: [
          { title: "Flavonoid - Wikipedia", url: "https://en.wikipedia.org/wiki/Flavonoid", type: "wikipedia" },
          { title: "Chalcone synthase", url: "https://en.wikipedia.org/wiki/Chalcone_synthase", type: "wikipedia" },
          { title: "UV-B protection in plants", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3550641/", type: "paper" },
        ],
      },
      {
        name: "Salinity Tolerance",
        description: "Grows in seawater (3.5% salt) via ion compartmentalization",
        gene: "SOS1/NHX1",
        chineseName: "耐鹽",
        color: "from-teal-400 to-cyan-500",
        source: "Salicornia europaea (Glasswort)",
        mechanism: "Na+ sequestration in vacuoles + K+ retention in cytoplasm",
        references: [
          { title: "Salicornia europaea - Wikipedia", url: "https://en.wikipedia.org/wiki/Salicornia_europaea", type: "wikipedia" },
          { title: "SOS pathway in plants", url: "https://en.wikipedia.org/wiki/SOS_response", type: "wikipedia" },
          { title: "Salt tolerance mechanisms", url: "https://www.annualreviews.org/doi/10.1146/annurev.arplant.59.032607.092911", type: "paper" },
        ],
      },
    ],
  },

  // ============================================
  // MARINE TRAITS - Ocean organism adaptations
  // ============================================
  {
    id: "marine",
    name: "Marine",
    chineseName: "海洋生物",
    icon: "🐙",
    color: "from-blue-500 to-cyan-600",
    description: "Adaptations from ocean-dwelling organisms",
    traits: [
      {
        name: "Bioluminescence",
        description: "Produces blue-green light (480nm) via luciferin-luciferase reaction",
        gene: "LUC/GFP",
        chineseName: "生物發光",
        color: "from-cyan-300 to-blue-400",
        source: "Aequorea victoria (Jellyfish)",
        mechanism: "Ca²+-triggered coelenterazine oxidation + GFP energy transfer",
        references: [
          { title: "Bioluminescence - Wikipedia", url: "https://en.wikipedia.org/wiki/Bioluminescence", type: "wikipedia" },
          { title: "Green Fluorescent Protein (GFP)", url: "https://en.wikipedia.org/wiki/Green_fluorescent_protein", type: "wikipedia" },
          { title: "Nobel Prize: Discovery of GFP", url: "https://www.nobelprize.org/prizes/chemistry/2008/summary/", type: "article" },
        ],
      },
      {
        name: "Pressure Adaptation",
        description: "Functions at 11,000m depth (1,100 atm) in hadal zones",
        gene: "TMAO/PV",
        chineseName: "深海適應",
        color: "from-indigo-600 to-blue-800",
        source: "Mariana snailfish (Pseudoliparis swirei)",
        mechanism: "TMAO stabilizes proteins + piezolyte accumulation",
        references: [
          { title: "Deep-sea fish - Wikipedia", url: "https://en.wikipedia.org/wiki/Deep-sea_fish", type: "wikipedia" },
          { title: "Trimethylamine N-oxide", url: "https://en.wikipedia.org/wiki/Trimethylamine_N-oxide", type: "wikipedia" },
          { title: "Mariana snailfish adaptation", url: "https://www.nature.com/articles/s41559-019-0864-8", type: "paper" },
        ],
      },
      {
        name: "Jet Propulsion",
        description: "Rapid water expulsion for 25+ km/h movement",
        gene: "MYH/TnI",
        chineseName: "噴射推進",
        color: "from-blue-400 to-indigo-500",
        source: "Dosidicus gigas (Humboldt Squid)",
        mechanism: "Specialized mantle muscles with fast-twitch fibers",
        references: [
          { title: "Humboldt squid - Wikipedia", url: "https://en.wikipedia.org/wiki/Humboldt_squid", type: "wikipedia" },
          { title: "Cephalopod locomotion", url: "https://en.wikipedia.org/wiki/Cephalopod_locomotion", type: "wikipedia" },
          { title: "Squid jet propulsion mechanics", url: "https://jeb.biologists.org/content/217/17/3111", type: "paper" },
        ],
      },
      {
        name: "Ink Production",
        description: "Melanin-based defensive cloud + tyrosinase toxins",
        gene: "TYR/DCT",
        chineseName: "墨汁生產",
        color: "from-slate-700 to-zinc-800",
        source: "Sepia officinalis (Cuttlefish)",
        mechanism: "Ink sac synthesizes eumelanin + mucus proteins",
        references: [
          { title: "Cephalopod ink - Wikipedia", url: "https://en.wikipedia.org/wiki/Cephalopod_ink", type: "wikipedia" },
          { title: "Common cuttlefish", url: "https://en.wikipedia.org/wiki/Common_cuttlefish", type: "wikipedia" },
          { title: "Cephalopod ink biochemistry", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4425457/", type: "paper" },
        ],
      },
      {
        name: "Electric Organ",
        description: "Generates 600V bioelectric discharge for defense/hunting",
        gene: "SCN4A/KCNA",
        chineseName: "電器官",
        color: "from-yellow-400 to-amber-500",
        source: "Electrophorus electricus (Electric Eel)",
        mechanism: "Modified muscle cells (electrocytes) stacked in series",
        references: [
          { title: "Electric eel - Wikipedia", url: "https://en.wikipedia.org/wiki/Electric_eel", type: "wikipedia" },
          { title: "Electric organ", url: "https://en.wikipedia.org/wiki/Electric_organ_(biology)", type: "wikipedia" },
          { title: "Electric eel genome", url: "https://www.science.org/doi/10.1126/science.1254432", type: "paper" },
        ],
      },
      {
        name: "Coral Symbiosis",
        description: "Hosts photosynthetic zooxanthellae for energy",
        gene: "NPC2/CAH",
        chineseName: "珊瑚共生",
        color: "from-pink-400 to-orange-400",
        source: "Acropora millepora",
        mechanism: "Nutrient exchange pathway with Symbiodinium dinoflagellates",
        references: [
          { title: "Coral - Wikipedia", url: "https://en.wikipedia.org/wiki/Coral", type: "wikipedia" },
          { title: "Zooxanthellae", url: "https://en.wikipedia.org/wiki/Zooxanthellae", type: "wikipedia" },
          { title: "Coral-algae symbiosis", url: "https://www.nature.com/articles/nrmicro2635", type: "paper" },
        ],
      },
      {
        name: "Chromatophore System",
        description: "Instant color/texture change for camouflage",
        gene: "OCA2/MITF",
        chineseName: "色素細胞系統",
        color: "from-purple-400 to-pink-500",
        source: "Octopus vulgaris",
        mechanism: "Neural control of pigment-filled chromatophore expansion",
        references: [
          { title: "Chromatophore - Wikipedia", url: "https://en.wikipedia.org/wiki/Chromatophore", type: "wikipedia" },
          { title: "Common octopus", url: "https://en.wikipedia.org/wiki/Common_octopus", type: "wikipedia" },
          { title: "Cephalopod camouflage", url: "https://royalsocietypublishing.org/doi/10.1098/rstb.2017.0372", type: "paper" },
        ],
      },
      {
        name: "Osmoregulation",
        description: "Maintains internal salinity in fresh/saltwater",
        gene: "AQP/NKCC",
        chineseName: "滲透調節",
        color: "from-teal-400 to-blue-400",
        source: "Anguilla anguilla (European Eel)",
        mechanism: "Gill chloride cells + kidney function switches",
        references: [
          { title: "Osmoregulation - Wikipedia", url: "https://en.wikipedia.org/wiki/Osmoregulation", type: "wikipedia" },
          { title: "European eel", url: "https://en.wikipedia.org/wiki/European_eel", type: "wikipedia" },
          { title: "Fish osmoregulation mechanisms", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2921099/", type: "paper" },
        ],
      },
    ],
  },

  // ============================================
  // INSECT TRAITS - Arthropod adaptations
  // ============================================
  {
    id: "insect",
    name: "Insect",
    chineseName: "昆蟲特性",
    icon: "🦋",
    color: "from-amber-500 to-yellow-600",
    description: "Highly efficient insect biological systems",
    traits: [
      {
        name: "Exoskeleton",
        description: "Chitin-based armor 5x stronger than steel by weight",
        gene: "CHS1/KNK",
        chineseName: "外骨骼",
        color: "from-amber-600 to-orange-700",
        source: "Dynastes hercules (Hercules Beetle)",
        mechanism: "Layered chitin-protein matrix with mineral reinforcement",
        references: [
          { title: "Exoskeleton - Wikipedia", url: "https://en.wikipedia.org/wiki/Exoskeleton", type: "wikipedia" },
          { title: "Chitin", url: "https://en.wikipedia.org/wiki/Chitin", type: "wikipedia" },
          { title: "Insect cuticle structure", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4093970/", type: "paper" },
        ],
      },
      {
        name: "Compound Eyes",
        description: "360° vision with 30,000 ommatidia detecting UV + polarized light",
        gene: "RH1/NorpA",
        chineseName: "複眼",
        color: "from-purple-400 to-violet-500",
        source: "Dragonfly (Aeshna cyanea)",
        mechanism: "Multiple photoreceptor types in hexagonal array",
        references: [
          { title: "Compound eye - Wikipedia", url: "https://en.wikipedia.org/wiki/Compound_eye", type: "wikipedia" },
          { title: "Dragonfly vision", url: "https://en.wikipedia.org/wiki/Dragonfly#Vision", type: "wikipedia" },
          { title: "Insect compound eye optics", url: "https://www.annualreviews.org/doi/10.1146/annurev-ento-010814-020932", type: "paper" },
        ],
      },
      {
        name: "Metamorphosis",
        description: "Complete body restructuring via imaginal disc development",
        gene: "EcR/USP",
        chineseName: "變態發育",
        color: "from-pink-400 to-rose-500",
        source: "Danaus plexippus (Monarch Butterfly)",
        mechanism: "Ecdysone + juvenile hormone cascades control tissue remodeling",
        references: [
          { title: "Metamorphosis - Wikipedia", url: "https://en.wikipedia.org/wiki/Metamorphosis", type: "wikipedia" },
          { title: "Imaginal disc", url: "https://en.wikipedia.org/wiki/Imaginal_disc", type: "wikipedia" },
          { title: "Insect metamorphosis hormones", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4109955/", type: "paper" },
        ],
      },
      {
        name: "Flight Muscles",
        description: "200Hz wingbeat via asynchronous flight muscle",
        gene: "MHC/TnC",
        chineseName: "飛行肌",
        color: "from-sky-400 to-blue-500",
        source: "Apis mellifera (Honeybee)",
        mechanism: "Stretch-activated Ca²+ release enables rapid oscillation",
        references: [
          { title: "Insect flight - Wikipedia", url: "https://en.wikipedia.org/wiki/Insect_flight", type: "wikipedia" },
          { title: "Asynchronous muscle", url: "https://en.wikipedia.org/wiki/Asynchronous_muscle", type: "wikipedia" },
          { title: "Flight muscle mechanics", url: "https://jeb.biologists.org/content/208/21/4063", type: "paper" },
        ],
      },
      {
        name: "Pheromone Communication",
        description: "Chemical signaling detectable at 10km distance",
        gene: "OR/OBP",
        chineseName: "費洛蒙通訊",
        color: "from-rose-400 to-pink-500",
        source: "Bombyx mori (Silk Moth)",
        mechanism: "Specialized olfactory receptors bind specific pheromone molecules",
        references: [
          { title: "Pheromone - Wikipedia", url: "https://en.wikipedia.org/wiki/Pheromone", type: "wikipedia" },
          { title: "Bombykol", url: "https://en.wikipedia.org/wiki/Bombykol", type: "wikipedia" },
          { title: "Insect pheromone signaling", url: "https://www.annualreviews.org/doi/10.1146/annurev.ento.48.091801.112645", type: "paper" },
        ],
      },
      {
        name: "Hive Mind Behavior",
        description: "Collective decision-making via waggle dance communication",
        gene: "FOR/AMFOR",
        chineseName: "蜂群智能",
        color: "from-yellow-400 to-amber-500",
        source: "Apis mellifera (Honeybee)",
        mechanism: "foraging gene expression modulates social behavior",
        references: [
          { title: "Waggle dance - Wikipedia", url: "https://en.wikipedia.org/wiki/Waggle_dance", type: "wikipedia" },
          { title: "Swarm intelligence", url: "https://en.wikipedia.org/wiki/Swarm_intelligence", type: "wikipedia" },
          { title: "Honeybee collective behavior", url: "https://www.science.org/doi/10.1126/science.1185693", type: "paper" },
        ],
      },
      {
        name: "Venom Synthesis",
        description: "Complex neurotoxin cocktail for prey immobilization",
        gene: "PLA2/SVSP",
        chineseName: "毒液合成",
        color: "from-green-500 to-emerald-600",
        source: "Paraponera clavata (Bullet Ant)",
        mechanism: "Specialized glands produce poneratoxin + phospholipases",
        references: [
          { title: "Insect venom - Wikipedia", url: "https://en.wikipedia.org/wiki/Insect_sting", type: "wikipedia" },
          { title: "Bullet ant", url: "https://en.wikipedia.org/wiki/Paraponera_clavata", type: "wikipedia" },
          { title: "Ant venom composition", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4273673/", type: "paper" },
        ],
      },
      {
        name: "Super Strength",
        description: "Lifts 1,141x body weight via optimized muscle attachment",
        gene: "ACT/MYO",
        chineseName: "超級力量",
        color: "from-red-500 to-orange-600",
        source: "Onthophagus taurus (Horned Dung Beetle)",
        mechanism: "High muscle-to-body ratio + lever-arm mechanics",
        references: [
          { title: "Dung beetle - Wikipedia", url: "https://en.wikipedia.org/wiki/Dung_beetle", type: "wikipedia" },
          { title: "Onthophagus taurus", url: "https://en.wikipedia.org/wiki/Onthophagus_taurus", type: "wikipedia" },
          { title: "Beetle strength mechanisms", url: "https://royalsocietypublishing.org/doi/10.1098/rspb.2010.0257", type: "paper" },
        ],
      },
    ],
  },

  // ============================================
  // FUNGAL TRAITS - Mycelium and decomposition
  // ============================================
  {
    id: "fungal",
    name: "Fungal",
    chineseName: "真菌特性",
    icon: "🍄",
    color: "from-amber-600 to-orange-700",
    description: "Mycelium networks and decomposition systems",
    traits: [
      {
        name: "Mycelium Network",
        description: "Forms km-scale underground network transferring nutrients",
        gene: "HYD/MYC1",
        chineseName: "菌絲網絡",
        color: "from-amber-500 to-orange-600",
        source: "Armillaria ostoyae (Honey Fungus)",
        mechanism: "Hyphal tip growth + anastomosis creates interconnected web",
        references: [
          { title: "Mycelium - Wikipedia", url: "https://en.wikipedia.org/wiki/Mycelium", type: "wikipedia" },
          { title: "Armillaria ostoyae", url: "https://en.wikipedia.org/wiki/Armillaria_ostoyae", type: "wikipedia" },
          { title: "Wood Wide Web", url: "https://www.nature.com/articles/388579a0", type: "paper" },
        ],
      },
      {
        name: "Lignin Decomposition",
        description: "Breaks down wood via manganese peroxidase enzymes",
        gene: "LiP/MnP",
        chineseName: "木質素分解",
        color: "from-amber-700 to-yellow-800",
        source: "Phanerochaete chrysosporium (White Rot)",
        mechanism: "Lignin peroxidase generates reactive radicals",
        references: [
          { title: "White rot fungus - Wikipedia", url: "https://en.wikipedia.org/wiki/White-rot_fungus", type: "wikipedia" },
          { title: "Lignin peroxidase", url: "https://en.wikipedia.org/wiki/Lignin_peroxidase", type: "wikipedia" },
          { title: "Lignin degradation enzymes", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3459108/", type: "paper" },
        ],
      },
      {
        name: "Mycorrhizal Symbiosis",
        description: "90% of plant species benefit from fungal nutrient exchange",
        gene: "SYM/PT",
        chineseName: "菌根共生",
        color: "from-green-500 to-teal-600",
        source: "Rhizophagus irregularis",
        mechanism: "Arbuscular interface exchanges P, N for plant sugars",
        references: [
          { title: "Mycorrhiza - Wikipedia", url: "https://en.wikipedia.org/wiki/Mycorrhiza", type: "wikipedia" },
          { title: "Arbuscular mycorrhiza", url: "https://en.wikipedia.org/wiki/Arbuscular_mycorrhiza", type: "wikipedia" },
          { title: "Mycorrhizal nutrient exchange", url: "https://www.nature.com/articles/nrmicro.2017.21", type: "paper" },
        ],
      },
      {
        name: "Spore Dormancy",
        description: "Spores remain viable for 250+ million years",
        gene: "SPO/TRE",
        chineseName: "孢子休眠",
        color: "from-stone-500 to-zinc-600",
        source: "Aspergillus fumigatus",
        mechanism: "Trehalose vitrification + melanin UV protection",
        references: [
          { title: "Fungal spore - Wikipedia", url: "https://en.wikipedia.org/wiki/Spore#Fungal_spores", type: "wikipedia" },
          { title: "Aspergillus fumigatus", url: "https://en.wikipedia.org/wiki/Aspergillus_fumigatus", type: "wikipedia" },
          { title: "Fungal spore longevity", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3168443/", type: "paper" },
        ],
      },
      {
        name: "Antibiotic Production",
        description: "Synthesizes penicillin-class β-lactam antibiotics",
        gene: "PCBAB/IPNS",
        chineseName: "抗生素生產",
        color: "from-blue-400 to-indigo-500",
        source: "Penicillium chrysogenum",
        mechanism: "Non-ribosomal peptide synthetase pathway",
        references: [
          { title: "Penicillin - Wikipedia", url: "https://en.wikipedia.org/wiki/Penicillin", type: "wikipedia" },
          { title: "Penicillium chrysogenum", url: "https://en.wikipedia.org/wiki/Penicillium_chrysogenum", type: "wikipedia" },
          { title: "Penicillin biosynthesis", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3411169/", type: "paper" },
        ],
      },
      {
        name: "Plastic Degradation",
        description: "Breaks down polyurethane and polyethylene",
        gene: "PETase/MHETase",
        chineseName: "塑膠降解",
        color: "from-teal-400 to-cyan-500",
        source: "Pestalotiopsis microspora",
        mechanism: "Esterase enzymes cleave polymer bonds",
        references: [
          { title: "Plastic-eating fungi - Wikipedia", url: "https://en.wikipedia.org/wiki/Pestalotiopsis_microspora", type: "wikipedia" },
          { title: "PETase enzyme", url: "https://en.wikipedia.org/wiki/PETase", type: "wikipedia" },
          { title: "Fungi degrading plastics", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5893933/", type: "paper" },
        ],
      },
      {
        name: "Psychedelic Compounds",
        description: "Produces psilocybin affecting serotonin receptors",
        gene: "PsiD/PsiK",
        chineseName: "致幻化合物",
        color: "from-violet-400 to-purple-600",
        source: "Psilocybe cubensis",
        mechanism: "Four-enzyme biosynthetic pathway from tryptophan",
        references: [
          { title: "Psilocybin - Wikipedia", url: "https://en.wikipedia.org/wiki/Psilocybin", type: "wikipedia" },
          { title: "Psilocybe cubensis", url: "https://en.wikipedia.org/wiki/Psilocybe_cubensis", type: "wikipedia" },
          { title: "Psilocybin biosynthesis pathway", url: "https://onlinelibrary.wiley.com/doi/10.1002/anie.201705489", type: "paper" },
        ],
      },
    ],
  },

  // ============================================
  // SYNTHETIC/ENGINEERED TRAITS
  // ============================================
  {
    id: "synthetic",
    name: "Synthetic",
    chineseName: "合成特性",
    icon: "⚗️",
    color: "from-violet-500 to-purple-600",
    description: "Engineered pathways and biosensors",
    traits: [
      {
        name: "Biosensor (Arsenic)",
        description: "Detects 10 ppb arsenic via GFP reporter system",
        gene: "ArsR/GFP",
        chineseName: "砷生物感測器",
        color: "from-green-400 to-cyan-500",
        source: "Engineered E. coli",
        mechanism: "ArsR repressor releases GFP promoter upon As binding",
        references: [
          { title: "Biosensor - Wikipedia", url: "https://en.wikipedia.org/wiki/Biosensor", type: "wikipedia" },
          { title: "ArsR protein family", url: "https://en.wikipedia.org/wiki/ArsR", type: "wikipedia" },
          { title: "Arsenic biosensors review", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3936391/", type: "paper" },
        ],
      },
      {
        name: "Bioplastic (PHA)",
        description: "Produces biodegradable polyhydroxyalkanoate polymers",
        gene: "phaCAB",
        chineseName: "PHA生物塑料",
        color: "from-blue-400 to-indigo-500",
        source: "Cupriavidus necator",
        mechanism: "Three-enzyme pathway polymerizes acetyl-CoA",
        references: [
          { title: "Polyhydroxyalkanoates - Wikipedia", url: "https://en.wikipedia.org/wiki/Polyhydroxyalkanoates", type: "wikipedia" },
          { title: "Cupriavidus necator", url: "https://en.wikipedia.org/wiki/Cupriavidus_necator", type: "wikipedia" },
          { title: "PHA biosynthesis", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3918869/", type: "paper" },
        ],
      },
      {
        name: "Heavy Metal Bioremediation",
        description: "Accumulates Cd, Pb, Hg via metallothionein binding",
        gene: "MT/phyC",
        chineseName: "重金屬修復",
        color: "from-zinc-400 to-slate-500",
        source: "Thlaspi caerulescens",
        mechanism: "Metal-binding proteins + phytochelatin synthesis",
        references: [
          { title: "Bioremediation - Wikipedia", url: "https://en.wikipedia.org/wiki/Bioremediation", type: "wikipedia" },
          { title: "Metallothionein", url: "https://en.wikipedia.org/wiki/Metallothionein", type: "wikipedia" },
          { title: "Phytoremediation of heavy metals", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3945755/", type: "paper" },
        ],
      },
      {
        name: "Biofuel Production",
        description: "Converts glucose to isobutanol at 22g/L titer",
        gene: "kivD/ADH",
        chineseName: "生物燃料",
        color: "from-amber-400 to-orange-500",
        source: "Engineered S. cerevisiae",
        mechanism: "Valine biosynthesis pathway redirected to alcohols",
        references: [
          { title: "Biofuel - Wikipedia", url: "https://en.wikipedia.org/wiki/Biofuel", type: "wikipedia" },
          { title: "Isobutanol", url: "https://en.wikipedia.org/wiki/Isobutanol", type: "wikipedia" },
          { title: "Microbial biofuel production", url: "https://www.nature.com/articles/nature07942", type: "paper" },
        ],
      },
      {
        name: "CRISPR Self-Repair",
        description: "Autonomous genome editing for damage correction",
        gene: "Cas9/gRNA",
        chineseName: "CRISPR自修復",
        color: "from-rose-400 to-pink-500",
        source: "Engineered construct",
        mechanism: "Guide RNA targets damage sites for HDR repair",
        references: [
          { title: "CRISPR gene editing - Wikipedia", url: "https://en.wikipedia.org/wiki/CRISPR_gene_editing", type: "wikipedia" },
          { title: "Cas9", url: "https://en.wikipedia.org/wiki/Cas9", type: "wikipedia" },
          { title: "CRISPR-based gene drives", url: "https://www.science.org/doi/10.1126/science.aaa3327", type: "paper" },
        ],
      },
      {
        name: "Quorum Sensing",
        description: "Population-density dependent gene activation",
        gene: "LuxI/LuxR",
        chineseName: "群體感應",
        color: "from-purple-400 to-violet-500",
        source: "Vibrio fischeri",
        mechanism: "AHL signaling molecules trigger synchronized behavior",
        references: [
          { title: "Quorum sensing - Wikipedia", url: "https://en.wikipedia.org/wiki/Quorum_sensing", type: "wikipedia" },
          { title: "Vibrio fischeri", url: "https://en.wikipedia.org/wiki/Aliivibrio_fischeri", type: "wikipedia" },
          { title: "LuxI/LuxR system", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4093948/", type: "paper" },
        ],
      },
      {
        name: "Genetic Kill Switch",
        description: "Programmed cell death outside containment",
        gene: "CcdB/CcdA",
        chineseName: "基因殺死開關",
        color: "from-red-500 to-rose-600",
        source: "Engineered safety system",
        mechanism: "Toxin-antitoxin system activates without antitoxin signal",
        references: [
          { title: "Kill switch (genetics) - Wikipedia", url: "https://en.wikipedia.org/wiki/Kill_switch_(genetics)", type: "wikipedia" },
          { title: "Toxin-antitoxin system", url: "https://en.wikipedia.org/wiki/Toxin-antitoxin_system", type: "wikipedia" },
          { title: "Synthetic biology biosafety", url: "https://www.nature.com/articles/nchembio.1512", type: "paper" },
        ],
      },
      {
        name: "Carbon Capture Enhanced",
        description: "10x CO₂ fixation via synthetic RuBisCO variants",
        gene: "RbcL+/PRK",
        chineseName: "碳捕獲增強",
        color: "from-green-500 to-teal-600",
        source: "Engineered cyanobacteria",
        mechanism: "Carboxysome encapsulation + improved RuBisCO specificity",
        references: [
          { title: "RuBisCO - Wikipedia", url: "https://en.wikipedia.org/wiki/RuBisCO", type: "wikipedia" },
          { title: "Carboxysome", url: "https://en.wikipedia.org/wiki/Carboxysome", type: "wikipedia" },
          { title: "Improving CO2 fixation", url: "https://www.science.org/doi/10.1126/science.aap9559", type: "paper" },
        ],
      },
    ],
  },

  // ============================================
  // ANIMAL TRAITS - Vertebrate adaptations
  // ============================================
  {
    id: "animal",
    name: "Animal",
    chineseName: "動物特性",
    icon: "🐾",
    color: "from-rose-500 to-pink-600",
    description: "Traits from the animal kingdom",
    traits: [
      {
        name: "Limb Regeneration",
        description: "Regrows complete limbs via dedifferentiation + blastema",
        gene: "WNT/FGF/BMP",
        chineseName: "肢體再生",
        color: "from-pink-400 to-rose-500",
        source: "Ambystoma mexicanum (Axolotl)",
        mechanism: "Wound epidermis signals cells to dedifferentiate and reform",
        references: [
          { title: "Regeneration (biology) - Wikipedia", url: "https://en.wikipedia.org/wiki/Regeneration_(biology)", type: "wikipedia" },
          { title: "Axolotl", url: "https://en.wikipedia.org/wiki/Axolotl", type: "wikipedia" },
          { title: "Axolotl regeneration mechanisms", url: "https://www.nature.com/articles/s41586-021-03819-w", type: "paper" },
        ],
      },
      {
        name: "Antifreeze Proteins",
        description: "Prevents ice crystal growth at -6°C via thermal hysteresis",
        gene: "AFP-III/AFGP",
        chineseName: "抗凍蛋白",
        color: "from-cyan-300 to-blue-400",
        source: "Dissostichus mawsoni (Antarctic Toothfish)",
        mechanism: "Protein binds ice crystal surface, inhibiting growth",
        references: [
          { title: "Antifreeze protein - Wikipedia", url: "https://en.wikipedia.org/wiki/Antifreeze_protein", type: "wikipedia" },
          { title: "Antarctic toothfish", url: "https://en.wikipedia.org/wiki/Antarctic_toothfish", type: "wikipedia" },
          { title: "Antifreeze protein mechanisms", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4213443/", type: "paper" },
        ],
      },
      {
        name: "Spider Silk",
        description: "Tensile strength 1.1 GPa, stronger than steel",
        gene: "MaSp1/MaSp2",
        chineseName: "蜘蛛絲",
        color: "from-gray-300 to-slate-400",
        source: "Nephila clavipes (Golden Orb Weaver)",
        mechanism: "Liquid protein crystallizes into β-sheet nanostructures during extrusion",
        references: [
          { title: "Spider Silk - Wikipedia", url: "https://en.wikipedia.org/wiki/Spider_silk", type: "wikipedia" },
          { title: "Spidroin proteins", url: "https://en.wikipedia.org/wiki/Spidroin", type: "wikipedia" },
          { title: "Spider silk structure and function", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1691398/", type: "paper" },
        ],
      },
      {
        name: "Echolocation",
        description: "Ultrasonic navigation at 200kHz with 0.3mm resolution",
        gene: "Prestin/CDH23",
        chineseName: "回聲定位",
        color: "from-violet-400 to-purple-500",
        source: "Rhinolophus ferrumequinum (Horseshoe Bat)",
        mechanism: "Cochlear amplification via prestin motor protein",
        references: [
          { title: "Echolocation - Wikipedia", url: "https://en.wikipedia.org/wiki/Animal_echolocation", type: "wikipedia" },
          { title: "Prestin protein", url: "https://en.wikipedia.org/wiki/Prestin", type: "wikipedia" },
          { title: "Bat echolocation evolution", url: "https://www.nature.com/articles/nature08117", type: "paper" },
        ],
      },
      {
        name: "Hibernation",
        description: "Metabolic rate drops 98% for 6+ months survival",
        gene: "UCP1/HP",
        chineseName: "冬眠",
        color: "from-blue-500 to-indigo-600",
        source: "Ursus arctos (Brown Bear)",
        mechanism: "Torpor cycles + brown fat thermogenesis for arousal",
        references: [
          { title: "Hibernation - Wikipedia", url: "https://en.wikipedia.org/wiki/Hibernation", type: "wikipedia" },
          { title: "Brown bear", url: "https://en.wikipedia.org/wiki/Brown_bear", type: "wikipedia" },
          { title: "Bear hibernation physiology", url: "https://www.science.org/doi/10.1126/science.1200970", type: "paper" },
        ],
      },
      {
        name: "Infrared Vision",
        description: "Detects thermal radiation 0.001°C sensitivity",
        gene: "TRPA1/TRPV1",
        chineseName: "紅外線視覺",
        color: "from-red-400 to-orange-500",
        source: "Crotalus atrox (Western Diamondback)",
        mechanism: "Pit organ TRP ion channels respond to IR heating",
        references: [
          { title: "Infrared sensing in snakes - Wikipedia", url: "https://en.wikipedia.org/wiki/Infrared_sensing_in_snakes", type: "wikipedia" },
          { title: "Western diamondback rattlesnake", url: "https://en.wikipedia.org/wiki/Western_diamondback_rattlesnake", type: "wikipedia" },
          { title: "Snake pit organ thermosensation", url: "https://www.nature.com/articles/nature08943", type: "paper" },
        ],
      },
      {
        name: "Magnetic Navigation",
        description: "Senses Earth's magnetic field for 10,000km migration",
        gene: "CRY4/MagR",
        chineseName: "磁場導航",
        color: "from-slate-500 to-blue-600",
        source: "Columba livia (Homing Pigeon)",
        mechanism: "Cryptochrome radical pairs + magnetite in beak",
        references: [
          { title: "Magnetoreception - Wikipedia", url: "https://en.wikipedia.org/wiki/Magnetoreception", type: "wikipedia" },
          { title: "Homing pigeon", url: "https://en.wikipedia.org/wiki/Homing_pigeon", type: "wikipedia" },
          { title: "Bird magnetic navigation", url: "https://www.nature.com/articles/s41586-021-03618-1", type: "paper" },
        ],
      },
      {
        name: "Venomous Bite",
        description: "Neurotoxic cocktail for prey immobilization",
        gene: "3FTx/PLA2",
        chineseName: "毒咬",
        color: "from-green-600 to-emerald-700",
        source: "Dendroaspis polylepis (Black Mamba)",
        mechanism: "α-neurotoxins block acetylcholine receptors",
        references: [
          { title: "Snake venom - Wikipedia", url: "https://en.wikipedia.org/wiki/Snake_venom", type: "wikipedia" },
          { title: "Black mamba", url: "https://en.wikipedia.org/wiki/Black_mamba", type: "wikipedia" },
          { title: "Snake venom evolution", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4717530/", type: "paper" },
        ],
      },
    ],
  },

  // ============================================
  // CHEMOSYNTHETIC TRAITS - Energy from chemicals
  // ============================================
  {
    id: "chemosynthetic",
    name: "Chemosynthetic",
    chineseName: "化能合成",
    icon: "⚡",
    color: "from-yellow-500 to-orange-600",
    description: "Derive energy from chemical reactions, not sunlight",
    traits: [
      {
        name: "Sulfur Oxidation",
        description: "Generates ATP from H₂S oxidation at hydrothermal vents",
        gene: "SoxB/DsrAB",
        chineseName: "硫氧化",
        color: "from-yellow-500 to-amber-600",
        source: "Thiomicrospira crunogena",
        mechanism: "Sox multienzyme system oxidizes thiosulfate",
        references: [
          { title: "Chemosynthesis - Wikipedia", url: "https://en.wikipedia.org/wiki/Chemosynthesis", type: "wikipedia" },
          { title: "Sulfur-oxidizing bacteria", url: "https://en.wikipedia.org/wiki/Sulfur-oxidizing_bacteria", type: "wikipedia" },
          { title: "Sox pathway", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2168397/", type: "paper" },
        ],
      },
      {
        name: "Iron Oxidation",
        description: "Extracts energy from Fe²⁺ to Fe³⁺ conversion",
        gene: "Cyc2/MtoA",
        chineseName: "鐵氧化",
        color: "from-orange-500 to-red-600",
        source: "Acidithiobacillus ferrooxidans",
        mechanism: "Outer membrane cytochromes transfer electrons",
        references: [
          { title: "Iron-oxidizing bacteria - Wikipedia", url: "https://en.wikipedia.org/wiki/Iron-oxidizing_bacteria", type: "wikipedia" },
          { title: "Acidithiobacillus ferrooxidans", url: "https://en.wikipedia.org/wiki/Acidithiobacillus_ferrooxidans", type: "wikipedia" },
          { title: "Bacterial iron oxidation", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3426383/", type: "paper" },
        ],
      },
      {
        name: "Hydrogen Metabolism",
        description: "Uses H₂ as sole energy source via hydrogenase",
        gene: "HupL/HoxH",
        chineseName: "氫代謝",
        color: "from-sky-400 to-blue-500",
        source: "Cupriavidus necator",
        mechanism: "NiFe-hydrogenase catalyzes H₂ oxidation",
        references: [
          { title: "Hydrogenase - Wikipedia", url: "https://en.wikipedia.org/wiki/Hydrogenase", type: "wikipedia" },
          { title: "Knallgas bacteria", url: "https://en.wikipedia.org/wiki/Knallgas_bacteria", type: "wikipedia" },
          { title: "Microbial hydrogen metabolism", url: "https://www.nature.com/articles/nrmicro2527", type: "paper" },
        ],
      },
      {
        name: "Methane Oxidation",
        description: "Consumes CH₄ as carbon and energy source",
        gene: "pMMO/sMMO",
        chineseName: "甲烷氧化",
        color: "from-teal-400 to-cyan-500",
        source: "Methylococcus capsulatus",
        mechanism: "Particulate methane monooxygenase converts CH₄ to CH₃OH",
        references: [
          { title: "Methanotroph - Wikipedia", url: "https://en.wikipedia.org/wiki/Methanotroph", type: "wikipedia" },
          { title: "Methane monooxygenase", url: "https://en.wikipedia.org/wiki/Methane_monooxygenase", type: "wikipedia" },
          { title: "Methanotroph ecology", url: "https://www.nature.com/articles/nrmicro2143", type: "paper" },
        ],
      },
      {
        name: "Ammonia Oxidation",
        description: "Nitrification pathway for energy from NH₃",
        gene: "AmoA/HAO",
        chineseName: "氨氧化",
        color: "from-lime-400 to-green-500",
        source: "Nitrosomonas europaea",
        mechanism: "Ammonia monooxygenase converts NH₃ to NO₂⁻",
        references: [
          { title: "Nitrification - Wikipedia", url: "https://en.wikipedia.org/wiki/Nitrification", type: "wikipedia" },
          { title: "Nitrosomonas europaea", url: "https://en.wikipedia.org/wiki/Nitrosomonas_europaea", type: "wikipedia" },
          { title: "Ammonia oxidation mechanisms", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3147376/", type: "paper" },
        ],
      },
      {
        name: "Arsenite Oxidation",
        description: "Detoxifies arsenic while gaining energy",
        gene: "AioA/AoxB",
        chineseName: "亞砷酸氧化",
        color: "from-violet-500 to-purple-600",
        source: "Alkalilimnicola ehrlichii",
        mechanism: "Periplasmic arsenite oxidase couples to electron chain",
        references: [
          { title: "Arsenite oxidase - Wikipedia", url: "https://en.wikipedia.org/wiki/Arsenite_oxidase", type: "wikipedia" },
          { title: "Arsenic metabolism", url: "https://en.wikipedia.org/wiki/Arsenic_biochemistry", type: "wikipedia" },
          { title: "Microbial arsenic cycling", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3264080/", type: "paper" },
        ],
      },
    ],
  },

  // ============================================
  // IMMUNE/DEFENSE TRAITS
  // ============================================
  {
    id: "immune",
    name: "Immune Defense",
    chineseName: "免疫防禦",
    icon: "🛡️",
    color: "from-red-500 to-rose-600",
    description: "Pathogen resistance and immune mechanisms",
    traits: [
      {
        name: "CRISPR Immunity",
        description: "Adaptive immune memory against viral DNA",
        gene: "Cas9/Cas12",
        chineseName: "CRISPR免疫",
        color: "from-blue-400 to-indigo-500",
        source: "Streptococcus pyogenes",
        mechanism: "Spacer-derived crRNA guides Cas nuclease to foreign DNA",
        references: [
          { title: "CRISPR - Wikipedia", url: "https://en.wikipedia.org/wiki/CRISPR", type: "wikipedia" },
          { title: "Cas9", url: "https://en.wikipedia.org/wiki/Cas9", type: "wikipedia" },
          { title: "Nobel Prize: CRISPR-Cas9", url: "https://www.nobelprize.org/prizes/chemistry/2020/summary/", type: "article" },
        ],
      },
      {
        name: "Antimicrobial Peptides",
        description: "Broad-spectrum defensins disrupt pathogen membranes",
        gene: "DEF/CAMP",
        chineseName: "抗菌肽",
        color: "from-green-400 to-teal-500",
        source: "Homo sapiens",
        mechanism: "Cationic peptides insert into bacterial membranes",
        references: [
          { title: "Antimicrobial peptides - Wikipedia", url: "https://en.wikipedia.org/wiki/Antimicrobial_peptides", type: "wikipedia" },
          { title: "Defensin", url: "https://en.wikipedia.org/wiki/Defensin", type: "wikipedia" },
          { title: "AMPs mechanisms of action", url: "https://www.nature.com/articles/nrmicro3326", type: "paper" },
        ],
      },
      {
        name: "Antiviral RNA Silencing",
        description: "siRNA pathway destroys viral RNA genomes",
        gene: "DCL2/AGO2",
        chineseName: "抗病毒RNA沉默",
        color: "from-purple-400 to-violet-500",
        source: "Arabidopsis thaliana",
        mechanism: "Dicer processes viral dsRNA, AGO cleaves targets",
        references: [
          { title: "RNA interference - Wikipedia", url: "https://en.wikipedia.org/wiki/RNA_interference", type: "wikipedia" },
          { title: "Dicer enzyme", url: "https://en.wikipedia.org/wiki/Dicer", type: "wikipedia" },
          { title: "Antiviral RNAi in plants", url: "https://www.nature.com/articles/nrmicro3326", type: "paper" },
        ],
      },
      {
        name: "Oxidative Burst",
        description: "Generates reactive oxygen species to kill pathogens",
        gene: "RBOHD/NOX",
        chineseName: "氧化爆發",
        color: "from-orange-400 to-red-500",
        source: "Plant defense response",
        mechanism: "NADPH oxidase produces superoxide in apoplast",
        references: [
          { title: "Oxidative burst - Wikipedia", url: "https://en.wikipedia.org/wiki/Oxidative_burst", type: "wikipedia" },
          { title: "NADPH oxidase", url: "https://en.wikipedia.org/wiki/NADPH_oxidase", type: "wikipedia" },
          { title: "ROS in plant immunity", url: "https://www.annualreviews.org/doi/10.1146/annurev-arplant-050718-100208", type: "paper" },
        ],
      },
      {
        name: "Hypersensitive Response",
        description: "Rapid programmed cell death to contain infection",
        gene: "NBS-LRR/R",
        chineseName: "過敏反應",
        color: "from-rose-500 to-pink-600",
        source: "Nicotiana tabacum",
        mechanism: "R gene recognition triggers localized cell suicide",
        references: [
          { title: "Hypersensitive response - Wikipedia", url: "https://en.wikipedia.org/wiki/Hypersensitive_response", type: "wikipedia" },
          { title: "R gene (plant)", url: "https://en.wikipedia.org/wiki/R_gene", type: "wikipedia" },
          { title: "Plant immune receptors", url: "https://www.science.org/doi/10.1126/science.aad2339", type: "paper" },
        ],
      },
      {
        name: "Systemic Acquired Resistance",
        description: "Whole-organism immunity after local infection",
        gene: "NPR1/PR1",
        chineseName: "系統性獲得抗性",
        color: "from-emerald-400 to-green-500",
        source: "Arabidopsis thaliana",
        mechanism: "Salicylic acid induces pathogenesis-related proteins",
        references: [
          { title: "Systemic acquired resistance - Wikipedia", url: "https://en.wikipedia.org/wiki/Systemic_acquired_resistance", type: "wikipedia" },
          { title: "Salicylic acid in plants", url: "https://en.wikipedia.org/wiki/Salicylic_acid", type: "wikipedia" },
          { title: "SAR signaling pathway", url: "https://www.annualreviews.org/doi/10.1146/annurev-phyto-082718-100211", type: "paper" },
        ],
      },
    ],
  },

  // ============================================
  // NEURAL/SENSORY TRAITS
  // ============================================
  {
    id: "neural",
    name: "Neural/Sensory",
    chineseName: "神經感知",
    icon: "🧠",
    color: "from-purple-500 to-indigo-600",
    description: "Advanced nervous system and sensory capabilities",
    traits: [
      {
        name: "Electroreception",
        description: "Detects bioelectric fields at 0.01 μV/cm sensitivity",
        gene: "CaV1.3/BK",
        chineseName: "電感知",
        color: "from-yellow-400 to-amber-500",
        source: "Carcharhinus leucas (Bull Shark)",
        mechanism: "Ampullae of Lorenzini contain electroreceptor cells",
        references: [
          { title: "Electroreception - Wikipedia", url: "https://en.wikipedia.org/wiki/Electroreception", type: "wikipedia" },
          { title: "Ampullae of Lorenzini", url: "https://en.wikipedia.org/wiki/Ampullae_of_Lorenzini", type: "wikipedia" },
          { title: "Shark electroreception", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3056639/", type: "paper" },
        ],
      },
      {
        name: "Distributed Neural Network",
        description: "500M neurons in tentacles for autonomous limb control",
        gene: "Oct-POU/Hox",
        chineseName: "分散神經網絡",
        color: "from-pink-400 to-rose-500",
        source: "Octopus vulgaris",
        mechanism: "Arm ganglia process local information independently",
        references: [
          { title: "Octopus nervous system - Wikipedia", url: "https://en.wikipedia.org/wiki/Cephalopod_nervous_system", type: "wikipedia" },
          { title: "Common octopus", url: "https://en.wikipedia.org/wiki/Common_octopus", type: "wikipedia" },
          { title: "Octopus arm autonomy", url: "https://www.sciencedirect.com/science/article/pii/S0896627318302046", type: "paper" },
        ],
      },
      {
        name: "Photoreceptor Diversity",
        description: "16 types of color receptors (vs human 3) for UV to IR vision",
        gene: "RH1-16/Arr",
        chineseName: "光感受器多樣性",
        color: "from-violet-400 to-purple-500",
        source: "Gonodactylus smithii (Mantis Shrimp)",
        mechanism: "Multiple opsin genes tune to different wavelengths",
        references: [
          { title: "Mantis shrimp vision - Wikipedia", url: "https://en.wikipedia.org/wiki/Mantis_shrimp#Eyes", type: "wikipedia" },
          { title: "Opsin", url: "https://en.wikipedia.org/wiki/Opsin", type: "wikipedia" },
          { title: "Mantis shrimp color vision", url: "https://www.science.org/doi/10.1126/science.1245824", type: "paper" },
        ],
      },
      {
        name: "Magnetoreception",
        description: "Navigates using Earth's magnetic field inclination",
        gene: "CRY1/IscA",
        chineseName: "磁感知",
        color: "from-slate-400 to-zinc-500",
        source: "Salmo salar (Atlantic Salmon)",
        mechanism: "Magnetite crystals + cryptochrome radical pairs",
        references: [
          { title: "Magnetoreception - Wikipedia", url: "https://en.wikipedia.org/wiki/Magnetoreception", type: "wikipedia" },
          { title: "Atlantic salmon", url: "https://en.wikipedia.org/wiki/Atlantic_salmon", type: "wikipedia" },
          { title: "Fish magnetic navigation", url: "https://www.pnas.org/doi/10.1073/pnas.1423164112", type: "paper" },
        ],
      },
      {
        name: "Lateral Line System",
        description: "Detects water movement and pressure changes",
        gene: "Atoh1/Cav1.3",
        chineseName: "側線系統",
        color: "from-cyan-400 to-blue-500",
        source: "Danio rerio (Zebrafish)",
        mechanism: "Hair cells in neuromasts detect water displacement",
        references: [
          { title: "Lateral line - Wikipedia", url: "https://en.wikipedia.org/wiki/Lateral_line", type: "wikipedia" },
          { title: "Zebrafish", url: "https://en.wikipedia.org/wiki/Zebrafish", type: "wikipedia" },
          { title: "Lateral line development", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4153336/", type: "paper" },
        ],
      },
      {
        name: "Rapid Learning",
        description: "Enhanced synaptic plasticity for fast adaptation",
        gene: "BDNF/CREB",
        chineseName: "快速學習",
        color: "from-emerald-400 to-teal-500",
        source: "Corvus corax (Raven)",
        mechanism: "Increased NMDA receptor expression + neurogenesis",
        references: [
          { title: "Corvid intelligence - Wikipedia", url: "https://en.wikipedia.org/wiki/Corvid_intelligence", type: "wikipedia" },
          { title: "Common raven", url: "https://en.wikipedia.org/wiki/Common_raven", type: "wikipedia" },
          { title: "Bird brain intelligence", url: "https://www.science.org/doi/10.1126/science.aaz7000", type: "paper" },
        ],
      },
    ],
  },
]

// Helper function to get all traits as a flat array
export function getAllTraits(): Trait[] {
  return traitCategories.flatMap((category) => category.traits)
}

// Helper function to get trait by name
export function getTraitByName(name: string): Trait | undefined {
  return getAllTraits().find((trait) => trait.name === name)
}

// Helper function to get category by trait name
export function getCategoryByTraitName(traitName: string): TraitCategory | undefined {
  return traitCategories.find((category) =>
    category.traits.some((trait) => trait.name === traitName)
  )
}

// Get total trait count
export function getTotalTraitCount(): number {
  return getAllTraits().length
}

// Get category count
export function getCategoryCount(): number {
  return traitCategories.length
}
