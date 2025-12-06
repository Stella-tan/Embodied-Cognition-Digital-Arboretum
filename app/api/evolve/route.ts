import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface EvolutionParams {
  populationSize: number;
  generations: number;
  mutationRate: number;
  selectionPressure: number;
  objectives: string[];
  targetEnvironment?: string;
}

interface OrganismData {
  sequence?: string;
  traits?: string[];
  gcContent?: number;
  length?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { organism, params, simulationResult } = (await request.json()) as {
      organism: OrganismData;
      params: EvolutionParams;
      simulationResult?: {
        environment?: string;
        weaknesses?: string[];
        survivalProbability?: number;
      };
    };

    if (!organism || !organism.traits || organism.traits.length === 0) {
      return NextResponse.json(
        { error: "No organism data provided. Please design an organism first." },
        { status: 400 }
      );
    }

    const prompt = `You are an evolutionary biologist and genetic algorithm expert. Run a simulated evolutionary optimization on a synthetic organism.

CURRENT ORGANISM:
- Traits: ${organism.traits.join(", ")}
- DNA Sequence Length: ${organism.sequence?.length || "Unknown"} bp
- GC Content: ${organism.gcContent || "Unknown"}%

EVOLUTIONARY PARAMETERS:
- Population Size: ${params.populationSize} individuals
- Generations: ${params.generations}
- Mutation Rate: ${(params.mutationRate * 100).toFixed(1)}%
- Selection Pressure: ${params.selectionPressure}/100 (higher = more aggressive selection)
- Optimization Objectives: ${params.objectives.join(", ")}
${params.targetEnvironment ? `- Target Environment: ${params.targetEnvironment}` : ""}

${simulationResult ? `PREVIOUS SIMULATION DATA:
- Environment: ${simulationResult.environment || "Unknown"}
- Current Survival Probability: ${simulationResult.survivalProbability || "Unknown"}%
- Known Weaknesses: ${simulationResult.weaknesses?.join(", ") || "None identified"}` : ""}

INSTRUCTIONS:
Simulate evolutionary optimization across ${params.generations} generations. Model:
1. Natural selection based on fitness scores for each objective
2. Beneficial mutations that emerge over generations
3. Trade-offs between different traits
4. Convergence towards optimal genome configuration
5. Genetic diversity maintenance

Respond in this exact JSON format:
{
  "evolutionSummary": {
    "initialFitness": <0-100>,
    "finalFitness": <0-100>,
    "improvementPercent": <number>,
    "convergenceGeneration": <generation when 95% of final fitness reached>,
    "totalMutationsAccepted": <number>,
    "totalMutationsRejected": <number>
  },
  "fitnessHistory": [
    {"generation": 0, "avgFitness": <number>, "bestFitness": <number>, "diversity": <0-100>},
    {"generation": ${Math.floor(params.generations * 0.25)}, "avgFitness": <number>, "bestFitness": <number>, "diversity": <0-100>},
    {"generation": ${Math.floor(params.generations * 0.5)}, "avgFitness": <number>, "bestFitness": <number>, "diversity": <0-100>},
    {"generation": ${Math.floor(params.generations * 0.75)}, "avgFitness": <number>, "bestFitness": <number>, "diversity": <0-100>},
    {"generation": ${params.generations}, "avgFitness": <number>, "bestFitness": <number>, "diversity": <0-100>}
  ],
  "objectiveScores": [
    {"objective": "<name>", "initialScore": <0-100>, "finalScore": <0-100>, "improvement": "<description>"}
  ],
  "keyMutations": [
    {"generation": <number>, "mutation": "<description>", "effect": "<positive/negative/neutral>", "fitnessImpact": <-100 to +100>, "retained": <true/false>}
  ],
  "emergentTraits": [
    {"trait": "<new trait name>", "generation": <number>, "description": "<how it emerged>", "benefit": "<advantage>"}
  ],
  "tradeOffs": [
    {"enhanced": "<trait>", "reduced": "<trait>", "reason": "<explanation>"}
  ],
  "optimizedGenome": {
    "suggestedSequenceChanges": ["<change 1>", "<change 2>"],
    "newGCContent": <number>,
    "predictedStability": "<high/medium/low>",
    "expressionOptimization": "<description>"
  },
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"],
  "verdict": "<OPTIMIZED/PARTIALLY_OPTIMIZED/STUCK_LOCAL_MINIMUM>",
  "summary": "<3-4 sentence summary of the evolutionary journey and results>"
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
    console.error("Evolution Error:", error);
    return NextResponse.json(
      { error: "Failed to run evolution", details: String(error) },
      { status: 500 }
    );
  }
}





