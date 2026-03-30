"use client";

import { useState } from "react";
import type { DecisionResult } from "./ResultCards";

interface ShareButtonProps {
  result: DecisionResult;
  dilemma: string;
}

export default function ShareButton({ result, dilemma }: ShareButtonProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastExiting, setToastExiting] = useState(false);

  const buildShareText = () => {
    return [
      `🪞 Decision Mirror`,
      ``,
      `❓ Dilemma: ${dilemma}`,
      ``,
      `⚡ Best Decision: ${result.decision}`,
      ``,
      `🧠 Why: ${result.reasoning}`,
      ``,
      `⚖️ Trade-offs: ${result.tradeoffs}`,
      ``,
      `🔮 Long-term: ${result.long_term}`,
      ``,
      `🎯 Action Steps: ${result.action_steps}`,
      ``,
      `---`,
      `Made with Decision Mirror`,
    ].join("\n");
  };

  const handleShare = async () => {
    const text = buildShareText();

    // Try native share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Decision Mirror — My Decision",
          text,
        });
        return;
      } catch {
        // User cancelled or not supported, fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }

    setShowToast(true);
    setToastExiting(false);
    setTimeout(() => {
      setToastExiting(true);
      setTimeout(() => setShowToast(false), 300);
    }, 2200);
  };

  return (
    <>
      <section className="relative z-10 flex justify-center px-4 pb-12">
        <button
          id="share-result-btn"
          type="button"
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium
                     text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                     bg-white/[0.03] hover:bg-white/[0.06]
                     border border-white/[0.06] hover:border-white/[0.12]
                     backdrop-blur-md transition-all duration-300
                     hover:shadow-[0_4px_20px_rgba(124,58,237,0.1)]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share Decision
        </button>
      </section>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div
            className={`glass-card px-5 py-3 flex items-center gap-2 text-sm text-[var(--text-primary)] ${
              toastExiting ? "toast-exit" : "toast-enter"
            }`}
          >
            <span className="text-green-400">✓</span>
            Decision copied to clipboard
          </div>
        </div>
      )}
    </>
  );
}
