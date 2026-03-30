"use client";

import { useState, useRef, useCallback } from "react";
import AmbientBackground from "./components/AmbientBackground";
import HeroSection from "./components/HeroSection";
import InputSection from "./components/InputSection";
import ResultCards, { DecisionResult } from "./components/ResultCards";
import ShareButton from "./components/ShareButton";

export default function Home() {
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastDilemma, setLastDilemma] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const loadingMessages = [
    "Analyzing your thoughts...",
    "Finding clarity...",
    "Aligning perspective...",
  ];

  const handleSubmit = useCallback(async (dilemma: string) => {
    setIsLoading(true);
    setLoadingStep(0);
    setError(null);
    setResult(null);
    setLastDilemma(dilemma);

    // Intentional delay for immersion
    const loadingInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 800);

    try {
      const [response] = await Promise.all([
        fetch("/api/decide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dilemma }),
        }),
        new Promise((resolve) => setTimeout(resolve, 2500)), // Minimum 2.5s wait
      ]);

      clearInterval(loadingInterval);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResult(data);

      // Scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    } catch (err) {
      clearInterval(loadingInterval);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col animate-reveal">
      <AmbientBackground isLoading={isLoading} />

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 sm:px-10 py-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/20 animate-glow">
            D
          </div>
          <span className="text-sm font-bold text-[var(--text-primary)] tracking-widest uppercase">
            Decision Mirror
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors tracking-widest uppercase"
          >
            v1.2
          </a>
        </div>
      </nav>

      {/* Hero Content */}
      <div className={`transition-all duration-1000 ${isLoading ? "blur-md opacity-30 scale-[0.98]" : "blur-0 opacity-100 scale-100"}`}>
        <HeroSection />
        <InputSection onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm transition-all duration-500">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="h-8 flex items-center justify-center">
              <p className="text-base font-medium text-purple-200/90 tracking-wide animate-pulse">
                {loadingMessages[loadingStep]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="relative z-10 flex justify-center px-4 pb-12">
          <div className="glass-card border-red-500/30 bg-red-500/5 px-6 py-4 max-w-xl w-full text-center">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Results Rendering */}
      <div ref={resultRef} className="relative z-10">
        {result && (
          <div className="animate-reveal">
            <div className="text-center px-4 pt-12 pb-16">
              <div className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                <span className="text-[10px] font-bold tracking-[0.2em] text-purple-400 uppercase">
                  Analysis Complete
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                Your Moment of Clarity
              </h2>
            </div>

            <ResultCards result={result} />
            <div className="flex justify-center pb-20">
              <ShareButton result={result} dilemma={lastDilemma} />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-10 pt-10">
        <p className="text-[10px] font-medium tracking-[0.3em] text-[var(--text-muted)] uppercase">
          Crafted with intentionality · Decision Mirror © {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
