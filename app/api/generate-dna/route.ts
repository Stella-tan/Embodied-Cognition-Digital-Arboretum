import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { traitCategories } from "@/lib/traits-data";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface TraitInfo {
  name: string;
  gene: string;
  description: string;
  category: string;
  source?: string;
  mechanism?: string;
}

// Build trait database from traits-data.ts
const traitDatabase: Record<string, TraitInfo> = {};
traitCategories.forEach((category) => {
  category.traits.forEach((trait) => {
    traitDatabase[trait.name] = {
      name: trait.name,
      gene: trait.gene,
      description: trait.description,
      category: category.name,
      source: trait.source,
      mechanism: trait.mechanism,
    };
  });
});

// Determine output structure type based on traits
function determineOutputType(traits: string[]): {
  type: "dna" | "rna" | "protein" | "plasmid";
  name: string;
  description: string;
  sequenceType: string;
} {
  // Traits that suggest specific structure types
  const plasmidTraits = [
    "Thermophilic", "Radioresistance", "Halophilic", "Acidophilic", "Barophilic",
    "Psychrophilic", "Desiccation Resistance", "Alkaliphilic",
    "Biosensor (Arsenic)", "Bioplastic (PHA)", "Heavy Metal Bioremediation",
    "CRISPR Immunity", "Quorum Sensing", "Genetic Kill Switch",
    "Sulfur Oxidation", "Iron Oxidation", "Hydrogen Metabolism",
    "Methane Oxidation", "Ammonia Oxidation"
  ];
  
  const proteinTraits = [
    "Spider Silk", "Antifreeze Proteins", "Limb Regeneration", "Venomous Bite",
    "Exoskeleton", "Venom Synthesis", "Super Strength", "Electric Organ",
    "Lignin Decomposition", "Antibiotic Production", "Antimicrobial Peptides",
    "Drought Resistance", "UV-B Protection", "Ink Production"
  ];
  
  const rnaTraits = [
    "Rapid Cell Division", "C4 Photosynthesis", "CAM Photosynthesis",
    "Metamorphosis", "Pheromone Communication", "Hive Mind Behavior",
    "Mycelium Network", "Antiviral RNA Silencing", "Compound Eyes"
  ];

  let plasmidScore = 0;
  let proteinScore = 0;
  let rnaScore = 0;

  traits.forEach((trait) => {
    const cleanTrait = trait.replace("custom:", "");
    if (plasmidTraits.some(t => cleanTrait.includes(t) || t.includes(cleanTrait))) plasmidScore++;
    if (proteinTraits.some(t => cleanTrait.includes(t) || t.includes(cleanTrait))) proteinScore++;
    if (rnaTraits.some(t => cleanTrait.includes(t) || t.includes(cleanTrait))) rnaScore++;
  });

  // Custom traits add to protein
  const customCount = traits.filter((t) => t.startsWith("custom:")).length;
  proteinScore += customCount * 0.5;

  const maxScore = Math.max(plasmidScore, proteinScore, rnaScore);
  
  if (maxScore === 0) {
    return {
      type: "dna",
      name: "Genomic DNA Construct",
      description: "Double-stranded DNA encoding multiple gene cassettes",
      sequenceType: "DNA (A, T, G, C)"
    };
  }
  
  if (plasmidScore === maxScore) {
    return {
      type: "plasmid",
      name: "Circular Plasmid Vector",
      description: "Self-replicating circular DNA for bacterial expression",
      sequenceType: "Circular DNA with oriC"
    };
  }
  
  if (proteinScore === maxScore) {
    return {
      type: "protein",
      name: "Fusion Protein Complex",
      description: "Multi-domain protein with combined functionalities",
      sequenceType: "Amino Acid Sequence"
    };
  }
  
  if (rnaScore === maxScore) {
    return {
      type: "rna",
      name: "mRNA Transcript",
      description: "Modified mRNA for cellular expression with regulatory elements",
      sequenceType: "RNA (A, U, G, C)"
    };
  }

  return {
    type: "dna",
    name: "Genomic DNA Construct",
    description: "Double-stranded DNA encoding multiple gene cassettes",
    sequenceType: "DNA (A, T, G, C)"
  };
}

interface CustomTraitInput {
  name: string;
  gene: string;
  description: string;
}

export async function POST(request: NextRequest) {
  try {
    const { traits, customTraits, complexity } = await request.json();

    // Check if we have any traits (predefined or custom)
    const hasTraits = (traits && traits.length > 0) || (customTraits && customTraits.length > 0);
    if (!hasTraits) {
      return NextResponse.json(
        { error: "No traits selected" },
        { status: 400 }
      );
    }

    // Get predefined traits info
    const selectedTraitInfo = (traits || [])
      .map((t: string) => traitDatabase[t])
      .filter(Boolean);

    // Group predefined traits by category
    const traitsByCategory: Record<string, TraitInfo[]> = {};
    selectedTraitInfo.forEach((trait: TraitInfo) => {
      if (!traitsByCategory[trait.category]) {
        traitsByCategory[trait.category] = [];
      }
      traitsByCategory[trait.category].push(trait);
    });

    // Add custom traits to a separate category
    const customTraitsList: CustomTraitInput[] = customTraits || [];
    if (customTraitsList.length > 0) {
      traitsByCategory["Custom"] = customTraitsList.map((ct: CustomTraitInput) => ({
        name: ct.name,
        gene: ct.gene || "CUSTOM",
        description: ct.description,
        category: "Custom",
      }));
    }

    // Determine output structure type
    const allTraitNames = [
      ...(traits || []),
      ...customTraitsList.map((ct: CustomTraitInput) => `custom:${ct.name}`)
    ];
    const outputType = determineOutputType(allTraitNames);

    const traitDescription = Object.entries(traitsByCategory)
      .map(([category, categoryTraits]) => {
        return `${category} Traits:\n${categoryTraits
          .map((t) => `  - ${t.name} (${t.gene}): ${t.description}${t.source ? ` [Source: ${t.source}]` : ""}${t.mechanism ? ` [Mechanism: ${t.mechanism}]` : ""}`)
          .join("\n")}`;
      })
      .join("\n\n");

    const totalTraits = (traits?.length || 0) + (customTraitsList?.length || 0);
    const hasCustom = customTraitsList.length > 0;

    // Customize prompt based on output type
    const outputSpecificInstructions = {
      dna: `Generate a linear DNA sequence (A, T, G, C) encoding all traits in a genomic construct.
Include: promoters, coding sequences, terminators, and enhancers.`,
      rna: `Generate an mRNA sequence (A, U, G, C - note: U instead of T) with:
- 5' cap region (simplified as leader sequence)
- Optimized Kozak sequences for each ORF
- 3' poly-A signal
- Internal ribosome entry sites (IRES) between genes`,
      protein: `Generate an amino acid sequence using single-letter codes (M, A, R, K, L, etc.) for a fusion protein.
Include:
- Signal peptide if secretion is needed
- Functional domains for each trait
- Flexible linker regions (GGGGS repeats) between domains
- Purification tags if applicable`,
      plasmid: `Generate a circular plasmid DNA sequence (A, T, G, C) including:
- Origin of replication (oriC)
- Selection marker (antibiotic resistance)
- Multiple cloning site
- All trait genes in expression cassettes
- Note: sequence should be able to circularize (ends complement)`
    };

    const prompt = `You are an expert synthetic biologist and genetic engineer. Generate a realistic ${outputType.name} for a CHIMERIC organism combining traits from multiple biological kingdoms.

OUTPUT TYPE: ${outputType.name}
OUTPUT DESCRIPTION: ${outputType.description}
SEQUENCE TYPE: ${outputType.sequenceType}

SELECTED TRAITS (${totalTraits} traits from ${Object.keys(traitsByCategory).length} categories${hasCustom ? ", including custom user-defined traits" : ""}):
${traitDescription}

COMPLEXITY LEVEL: ${complexity}% (higher = longer/more complex sequence)

SPECIFIC REQUIREMENTS:
${outputSpecificInstructions[outputType.type]}

The sequence length should be approximately ${outputType.type === "protein" ? Math.floor((300 + complexity * 10) / 3) : 300 + complexity * 10} ${outputType.type === "protein" ? "amino acids" : "bases"}.

Respond in this exact JSON format:
{
  "sequence": "${outputType.type === "protein" ? "MKAL..." : "ATGC..."}",
  "length": <number>,
  "gcContent": ${outputType.type === "protein" ? "null" : "<percentage as number>"},
  "molecularWeight": ${outputType.type === "protein" ? "<kDa as number>" : "null"},
  "regions": [
    {"name": "<region name>", "start": 0, "end": 50, "type": "<promoter/CDS/terminator/domain/linker>", "description": "..."}
  ],
  "analysis": {
    "stability": "<high/medium/low>",
    "expressionLevel": "<high/medium/low>",
    "foldingPrediction": "${outputType.type === "protein" ? "<globular/fibrous/intrinsically_disordered>" : "null"}",
    "codonOptimization": "${outputType.type !== "protein" ? "<percentage>" : "null"}"
  },
  "traitIntegration": [
    {"trait": "<trait name>", "location": "<region in sequence>", "function": "<what this region does>"}
  ],
  "structureType": "${outputType.type}",
  "structureName": "${outputType.name}",
  "explanation": "<3-4 sentences explaining the design strategy, how traits are integrated, and why this structure type was chosen for these traits>"
}

Generate only valid JSON, no markdown or extra text.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse the JSON response
    let parsedResponse;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: responseText },
        { status: 500 }
      );
    }

    // Ensure structure type is included
    parsedResponse.structureType = parsedResponse.structureType || outputType.type;
    parsedResponse.structureName = parsedResponse.structureName || outputType.name;

    return NextResponse.json({
      success: true,
      data: parsedResponse,
      traits: selectedTraitInfo,
      customTraits: customTraitsList,
      categories: Object.keys(traitsByCategory),
      outputType: outputType,
    });
  } catch (error) {
    console.error("DNA Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate DNA sequence", details: String(error) },
      { status: 500 }
    );
  }
}
