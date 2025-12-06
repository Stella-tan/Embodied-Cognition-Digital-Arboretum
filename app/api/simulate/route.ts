import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface Environment {
  name: string;
  temp: number;
  pressure: number;
  radiation: number;
  water: number;
  challenges: string[];
}

interface OrganismData {
  sequence?: string;
  traits?: string[];
  gcContent?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { environment, organism } = (await request.json()) as {
      environment: Environment;
      organism: OrganismData;
    };

    if (!environment) {
      return NextResponse.json(
        { error: "No environment selected" },
        { status: 400 }
      );
    }

    const prompt = `You are an astrobiologist and synthetic biology expert. Analyze the survival probability of an engineered organism in an extreme environment.

ENVIRONMENT: ${environment.name}
- Temperature: ${environment.temp}°C
- Pressure: ${environment.pressure} atm
- Radiation: ${environment.radiation} mSv/day
- Water availability: ${environment.water}%
- Key challenges: ${environment.challenges.join(", ")}

ORGANISM CHARACTERISTICS:
${organism?.traits?.length ? `- Selected traits: ${organism.traits.join(", ")}` : "- No specific traits selected (baseline organism)"}
${organism?.sequence ? `- DNA sequence length: ${organism.sequence.length} bp` : "- No DNA sequence provided"}
${organism?.gcContent ? `- GC content: ${organism.gcContent}%` : ""}

INSTRUCTIONS:
Perform a detailed survival analysis simulation across 1000 generations. Consider:
1. How well the organism's traits match the environmental challenges
2. Energy availability and metabolic requirements
3. DNA stability under environmental stress
4. Reproductive viability
5. Long-term evolutionary adaptation potential

Respond in this exact JSON format:
{
  "survivalProbability": <0-100>,
  "generationsSimulated": 1000,
  "criticalFactors": [
    {"factor": "<name>", "score": <0-100>, "impact": "<positive/negative/neutral>", "details": "<explanation>"}
  ],
  "adaptations": [
    {"generation": <number>, "adaptation": "<description>", "benefit": "<description>"}
  ],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>"],
  "verdict": "<VIABLE/MARGINAL/NOT_VIABLE>",
  "summary": "<2-3 sentence summary of simulation results>"
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
      environment: environment.name,
    });
  } catch (error) {
    console.error("Simulation Error:", error);
    return NextResponse.json(
      { error: "Failed to run simulation", details: String(error) },
      { status: 500 }
    );
  }
}










