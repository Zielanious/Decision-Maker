"use client";

import { useState, useCallback, useEffect } from "react";

interface InputSectionProps {
  onSubmit: (dilemma: string) => void;
  isLoading: boolean;
}

export default function InputSection({ onSubmit, isLoading }: InputSectionProps) {
  const [dilemma, setDilemma] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const placeholders = [
    "What’s weighing on your mind?",
    "What decision feels unclear?",
    "What are you avoiding?",
  ];

  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isLoading, placeholders.length]);

  const handleSubmit = useCallback(() => {
    if (dilemma.trim() && !isLoading) {
      onSubmit(dilemma.trim());
    }
  }, [dilemma, isLoading, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="relative z-10 flex flex-col items-center px-4 pb-12">
      <div className="w-full max-w-3xl">
        {/* Glass Input Container */}
        <div className={`glass-card p-6 sm:p-10 transition-all duration-700 ${isFocused ? "animate-glow" : "animate-float"}`}>
          <textarea
            id="dilemma-input"
            value={dilemma}
            onChange={(e) => setDilemma(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholders[placeholderIndex]}
            rows={4}
            className="glass-input resize-none"
            disabled={isLoading}
          />

          <div className="flex items-center justify-end mt-6">
            <button
              id="get-clarity-btn"
              type="button"
              onClick={handleSubmit}
              disabled={!dilemma.trim() || isLoading}
              className="btn-primary group overflow-hidden"
            >
              <div className="relative z-10 flex items-center gap-3">
                {isLoading ? (
                  <div className="loading-spinner border-white/20 border-t-white" />
                ) : (
                  <span className="text-lg">✨</span>
                )}
                <span className="text-sm font-bold uppercase tracking-[0.1em]">
                  {isLoading ? "Consulting..." : "Get Clarity"}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Hint text */}
        <p className="text-center text-xs text-[var(--text-muted)] mt-3 fade-in fade-in-delay-4">
          Press Enter to submit · Shift+Enter for new line
        </p>
      </div>
    </section>
  );
}
