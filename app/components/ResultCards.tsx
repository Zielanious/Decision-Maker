"use client";

import { useState, useEffect } from "react";

export interface DecisionResult {
  decision: string;
  highlight: string;
  reasoning: string;
  tradeoffs: string;
  long_term: string;
  action_steps: string;
}

interface ResultCardsProps {
  result: DecisionResult;
}

const cardConfig = [
  {
    key: "decision" as const,
    title: "Best Decision",
    icon: "⚡",
    gradient: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))",
    borderColor: "rgba(124, 58, 237, 0.25)",
    accentLine: "#7c3aed",
  },
  {
    key: "reasoning" as const,
    title: "Why This Works",
    icon: "🧠",
    gradient: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.04))",
    borderColor: "rgba(59, 130, 246, 0.18)",
    accentLine: "#3b82f6",
  },
  {
    key: "tradeoffs" as const,
    title: "Trade-offs",
    icon: "⚖️",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.10), rgba(245,158,11,0.03))",
    borderColor: "rgba(245, 158, 11, 0.15)",
    accentLine: "#f59e0b",
  },
  {
    key: "long_term" as const,
    title: "Long-term Impact",
    icon: "🔮",
    gradient: "linear-gradient(135deg, rgba(6,182,212,0.10), rgba(6,182,212,0.03))",
    borderColor: "rgba(6, 182, 212, 0.15)",
    accentLine: "#06b6d4",
  },
  {
    key: "action_steps" as const,
    title: "Action Steps",
    icon: "🎯",
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.10), rgba(16,185,129,0.03))",
    borderColor: "rgba(16, 185, 129, 0.15)",
    accentLine: "#10b981",
  },
];

function formatContent(content: string | string[], isActionSteps: boolean, highlight?: string) {
  if (Array.isArray(content)) {
    return (
      <div className="flex flex-col gap-4">
        {content.map((step, i) => (
          <p key={i} className="text-[var(--text-primary)] leading-[1.8] text-sm sm:text-base">
            {String(step).trim()}
          </p>
        ))}
      </div>
    );
  }

  const text = String(content);

  if (isActionSteps) {
    const stepPattern = new RegExp("(?=\\d+\\.\\s)");
    const steps = text.split(stepPattern).filter((s) => s.trim());
    if (steps.length > 1) {
      return (
        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <p key={i} className="text-[var(--text-primary)] leading-[1.8] text-sm sm:text-base">
              {step.trim()}
            </p>
          ))}
        </div>
      );
    }
  }

  // Handle highlighting logic for the main decision
  if (highlight && text.includes(highlight)) {
    const parts = text.split(highlight);
    return (
      <p className="text-[var(--text-primary)] leading-[1.8] text-base sm:text-lg font-medium italic">
        {parts[0]}
        <span className="highlight-breath not-italic">{highlight}</span>
        {parts[1]}
      </p>
    );
  }

  return (
    <p className="text-[var(--text-primary)] leading-[1.8] text-sm sm:text-base">
      {text}
    </p>
  );
}

export default function ResultCards({ result }: ResultCardsProps) {
  const [copiedCard, setCopiedCard] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    const interval = setInterval(() => {
      setVisibleCount((prev) => (prev < cardConfig.length ? prev + 1 : prev));
    }, 400); 
    return () => clearInterval(interval);
  }, [result]);

  const handleCopyCard = async (key: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedCard(key);
      setTimeout(() => setCopiedCard(null), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedCard(key);
      setTimeout(() => setCopiedCard(null), 2000);
    }
  };

  return (
    <section className="relative z-10 px-4 sm:px-8 lg:px-12 pb-32">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-12">
        {cardConfig.map((card, index) => {
          const content = result[card.key];
          if (!content || index >= visibleCount) return null;

          return (
            <div
              key={card.key}
              className="animate-reveal"
            >
              <div
                className="group relative rounded-3xl overflow-hidden glass-card transition-all duration-700"
                style={{
                  background: card.gradient,
                  border: `1px solid ${card.borderColor}`,
                }}
              >
                {/* Accent glow on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
                  style={{ background: card.accentLine }}
                />

                <div className="p-8 sm:p-12 lg:p-16">
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl sm:text-3xl filter drop-shadow-md">{card.icon}</span>
                      <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">
                        {card.title}
                      </h3>
                    </div>

                    <button
                      id={`copy-${card.key}`}
                      type="button"
                      onClick={() => handleCopyCard(card.key, content)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-500
                                 text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)]
                                 px-4 py-2 rounded-full bg-white/5
                                 border border-white/5 hover:border-white/10"
                    >
                      {copiedCard === card.key ? "✓ Copied" : "Copy"}
                    </button>
                  </div>

                  {/* Card content */}
                  {formatContent(
                    content, 
                    card.key === "action_steps", 
                    card.key === "decision" ? result.highlight : undefined
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
