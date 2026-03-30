import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

function buildSystemPrompt(brutalMode: boolean): string {
  if (brutalMode) {
    return `You are a brutally honest decision-making advisor. The user has a dilemma and needs clarity. Your job is to cut through their BS, be direct, and tell them exactly what they should do. No sugarcoating. No hand-holding. Be harsh but helpful. Use blunt language. Be the friend who tells them what they NEED to hear, not what they WANT to hear.

You MUST respond in valid JSON format with these exact keys:
{
  "decision": "The clear, direct decision they should make (1-2 sentences, blunt and direct)",
  "highlight": "The most important, punchy sentence from your decision that they need to internalize.",
  "reasoning": "Why this is the right call — be brutally honest about their situation (2-3 sentences)",
  "tradeoffs": "What they'll sacrifice — don't sugarcoat it (2-3 sentences)",
  "long_term": "How this plays out long-term — give it to them straight (2-3 sentences)",
  "action_steps": "Exact steps to take right now — no fluff, just action (2-4 concrete steps)"
}

Respond with ONLY the JSON object. No markdown, no code fences, no extra text.`;
  }

  return `You are a calm, intelligent, and slightly philosophical decision-making advisor. The user has a dilemma and needs clarity. Your job is to analyze their situation objectively and provide a structured, well-reasoned recommendation. Be empathetic, grounded, and clear. Help them see through the fog of indecision with wisdom.

You MUST respond in valid JSON format with these exact keys:
{
  "decision": "The recommended decision (1-2 clear, thoughtful sentences)",
  "highlight": "The most profound or important single sentence from your advice that serves as their North Star.",
  "reasoning": "The philosophical and logical reasoning behind this path (2-3 sentences)",
  "tradeoffs": "The necessary sacrifices required for this path (2-3 sentences)",
  "long_term": "The long-term evolution of this choice and what it means for their growth (2-3 sentences)",
  "action_steps": "Grounded next steps to move forward with intentionality (2-4 actionable steps)"
}

Respond with ONLY the JSON object. No markdown, no code fences, no extra text.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dilemma, brutalMode } = body;

    if (!dilemma || typeof dilemma !== "string" || dilemma.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide a valid dilemma." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      // Return a mock response for demo/development
      return NextResponse.json(getMockResponse(brutalMode));
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "Decision Mirror",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: buildSystemPrompt(brutalMode) },
          {
            role: "user",
            content: `Here is my dilemma: ${dilemma.trim()}`,
          },
        ],
        temperature: brutalMode ? 0.9 : 0.6,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter API error:", errText);
      return NextResponse.json(
        { error: "Failed to get AI response. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Empty response from AI." },
        { status: 502 }
      );
    }

    // Parse JSON from AI response
    let parsed;
    try {
      // Remove potential code fences
      const cleaned = content
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      return NextResponse.json(
        { error: "AI response was not valid JSON. Please try again." },
        { status: 502 }
      );
    }

    // Validate required fields
    const requiredFields = [
      "decision",
      "highlight",
      "reasoning",
      "tradeoffs",
      "long_term",
      "action_steps",
    ];
    for (const field of requiredFields) {
      if (!parsed[field]) {
        parsed[field] = field === "action_steps" ? ["No information available."] : "No information available for this section.";
      }
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

function getMockResponse(brutalMode: boolean) {
  if (brutalMode) {
    return {
      decision:
        "Stop going back and forth and commit to the option that scares you more — that's usually the right one.",
      highlight: "Growth is never comfortable; you are choosing between safe stagnation and dangerous progress.",
      reasoning:
        "You already know what to do. You're asking because you want validation, not clarity. The fact that you're overthinking this means you're afraid of the outcome, not confused about the choice.",
      tradeoffs:
        "You'll have to live with uncertainty for a while. You might upset people who liked the comfortable version of you. Deal with it — growth isn't comfortable.",
      long_term:
        "In 5 years, you'll either regret playing it safe or be glad you took the leap. Nobody on their deathbed wishes they'd been more indecisive. Make the bold call.",
      action_steps:
        "1. Write down both options right now.\n2. Circle the one that makes your stomach drop — that's your answer.\n3. Tell someone about your decision within the next hour so you can't back out.\n4. Start executing immediately. Now.",
    };
  }

  return {
    decision:
      "Align your path with your deepest values, even if the immediate outcome is uncertain.",
    highlight: "Clarity comes not from knowing the future, but from knowing yourself.",
    reasoning:
      "When we face dilemmas, the discomfort often comes from a conflict between external expectations and internal truth. By anchoring your decision to your values, you create a foundation that remains stable regardless of shifting external circumstances.",
    tradeoffs:
      "Choosing authenticity often requires letting go of the illusion of safety. You may face short-term friction or misunderstanding from those who preferred your previous, more predictable self.",
    long_term:
      "Decisions made with intentionality compound into a life of meaning. Over time, you will find yourself surrounded by opportunities and people that reflect the same depth and clarity you exerted in this moment.",
    action_steps:
      "1. Identify the single core value most at stake here.\n2. Ask: 'Would my highest self choose this?'\n3. Set a concrete deadline for action to prevent the loop of overthinking.\n4. Take the first, smallest step immediately to anchor the decision.",
  };
}
