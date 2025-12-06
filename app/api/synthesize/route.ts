import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface OrganismData {
  sequence?: string;
  traits?: string[];
  gcContent?: number;
  length?: number;
}

interface SynthesisParams {
  targetOrganism: string;
  synthesisMethod: string;
  qualityTier: string;
  includeVerification: boolean;
  codonOptimizeFor: string;
}

interface EvolutionData {
  evolutionSummary?: {
    finalFitness?: number;
    improvementPercent?: number;
  };
  optimizedGenome?: {
    suggestedSequenceChanges?: string[];
    newGCContent?: number;
  };
  verdict?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { organism, params, evolutionResult, simulationResult } = (await request.json()) as {
      organism: OrganismData;
      params: SynthesisParams;
      evolutionResult?: EvolutionData;
      simulationResult?: {
        environment?: string;
        survivalProbability?: number;
        verdict?: string;
      };
    };

    if (!organism || !organism.sequence) {
      return NextResponse.json(
        { error: "No organism sequence provided. Please generate a DNA sequence first." },
        { status: 400 }
      );
    }

    const prompt = `You are a synthetic biology expert and DNA synthesis specialist. Create a comprehensive synthesis plan for manufacturing the provided genetic construct.

ORGANISM SEQUENCE:
- Sequence Length: ${organism.sequence.length} bp
- GC Content: ${organism.gcContent || "Unknown"}%
- Traits Encoded: ${organism.traits?.join(", ") || "Unknown"}
- Sample Sequence (first 100bp): ${organism.sequence.substring(0, 100)}...

SYNTHESIS PARAMETERS:
- Target Expression System: ${params.targetOrganism}
- Synthesis Method: ${params.synthesisMethod}
- Quality Tier: ${params.qualityTier}
- Include Verification: ${params.includeVerification ? "Yes" : "No"}
- Codon Optimization Target: ${params.codonOptimizeFor}

${evolutionResult ? `EVOLUTIONARY OPTIMIZATION DATA:
- Final Fitness: ${evolutionResult.evolutionSummary?.finalFitness || "N/A"}%
- Improvement: ${evolutionResult.evolutionSummary?.improvementPercent || "N/A"}%
- Optimization Status: ${evolutionResult.verdict || "N/A"}
- Suggested Changes: ${evolutionResult.optimizedGenome?.suggestedSequenceChanges?.join("; ") || "None"}` : ""}

${simulationResult ? `SIMULATION DATA:
- Target Environment: ${simulationResult.environment || "N/A"}
- Survival Probability: ${simulationResult.survivalProbability || "N/A"}%
- Viability: ${simulationResult.verdict || "N/A"}` : ""}

INSTRUCTIONS:
Create a detailed synthesis and assembly plan including:
1. Codon optimization analysis for the target expression system
2. Sequence segmentation for synthesis (fragments typically 1-3kb)
3. Assembly strategy (Gibson, Golden Gate, etc.)
4. Quality control checkpoints
5. Risk assessment for synthesis complexity
6. Cost and timeline estimates
7. Recommended synthesis vendors/approaches

Respond in this exact JSON format:
{
  "synthesisOverview": {
    "totalFragments": <number>,
    "averageFragmentSize": <number in bp>,
    "assemblyMethod": "<Gibson Assembly/Golden Gate/Traditional Cloning/etc>",
    "estimatedSuccessRate": <0-100>,
    "complexityScore": "<Low/Medium/High/Very High>",
    "estimatedCost": "<price range in USD>",
    "estimatedTimeline": "<timeline in days/weeks>"
  },
  "codonOptimization": {
    "originalCAI": <0-1 codon adaptation index>,
    "optimizedCAI": <0-1>,
    "rareCodonsRemoved": <number>,
    "gcContentAdjusted": <true/false>,
    "newGCContent": <percentage>,
    "optimizationNotes": "<explanation of changes>"
  },
  "fragments": [
    {
      "id": "<F1, F2, etc>",
      "name": "<descriptive name>",
      "startPosition": <number>,
      "endPosition": <number>,
      "length": <number>,
      "gcContent": <percentage>,
      "synthesisComplexity": "<Easy/Medium/Hard>",
      "overlapWith": "<previous fragment ID or null>",
      "notes": "<any special considerations>"
    }
  ],
  "assemblyPlan": {
    "steps": [
      {"step": 1, "action": "<action description>", "inputs": ["<fragment IDs>"], "output": "<intermediate name>", "duration": "<time>"}
    ],
    "finalConstruct": "<name>",
    "vectorBackbone": "<vector name if applicable>",
    "selectionMarker": "<antibiotic resistance or other marker>"
  },
  "qualityControl": [
    {"checkpoint": "<name>", "method": "<PCR/Sequencing/Restriction digest/etc>", "expectedResult": "<what to look for>", "criticalLevel": "<Critical/Important/Optional>"}
  ],
  "riskAssessment": {
    "overallRisk": "<Low/Medium/High>",
    "risks": [
      {"risk": "<description>", "likelihood": "<Low/Medium/High>", "impact": "<Low/Medium/High>", "mitigation": "<strategy>"}
    ]
  },
  "vendorRecommendations": [
    {"vendor": "<name>", "specialty": "<what they're good at>", "estimatedCost": "<range>", "turnaround": "<time>", "recommended": <true/false>}
  ],
  "regulatoryNotes": ["<any biosafety or regulatory considerations>"],
  "summary": "<3-4 sentence summary of the synthesis plan and key recommendations>"
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

    return NextResponse.json({
      success: true,
      data: parsedResponse,
    });
  } catch (error) {
    console.error("Synthesis Error:", error);
    return NextResponse.json(
      { error: "Failed to generate synthesis plan", details: String(error) },
      { status: 500 }
    );
  }
}





