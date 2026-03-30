"use client";

import { useEffect, useRef } from "react";

interface AmbientBackgroundProps {
  isLoading?: boolean;
}

export default function AmbientBackground({ isLoading = false }: AmbientBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create floating particles
    const particleCount = isLoading ? 60 : 35;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      const size = Math.random() * (isLoading ? 4 : 3) + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.setProperty("--drift", `${(Math.random() - 0.5) * (isLoading ? 120 : 80)}px`);

      const hue = Math.random() > 0.5 ? "124, 58, 237" : "59, 130, 246";
      const opacity = isLoading ? Math.random() * 0.6 + 0.3 : Math.random() * 0.3 + 0.1;
      particle.style.background = `rgba(${hue}, ${opacity})`;
      particle.style.boxShadow = `0 0 ${size * 4}px rgba(${hue}, ${isLoading ? 0.5 : 0.2})`;

      const duration = Math.random() * (isLoading ? 8 : 15) + (isLoading ? 5 : 12);
      const delay = Math.random() * -20; // Start immediately
      particle.style.animation = `particleFloat ${duration}s ${delay}s linear infinite`;

      container.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach((p) => p.remove());
    };
  }, [isLoading]);

  return (
    <>
      {/* Ambient gradient orbs with enhanced movement */}
      <div className={`ambient-bg transition-opacity duration-1000 ${isLoading ? "opacity-60" : "opacity-100"}`}>
        <div className="ambient-orb ambient-orb-1" style={{ animationDuration: isLoading ? "12s" : "20s" }} />
        <div className="ambient-orb ambient-orb-2" style={{ animationDuration: isLoading ? "15s" : "25s" }} />
        <div className="ambient-orb ambient-orb-3" style={{ animationDuration: isLoading ? "10s" : "18s" }} />
      </div>

      {/* Floating particles */}
      <div ref={containerRef} className="particles-container" />

      {/* Noise texture overlay */}
      <div className="noise-overlay" />
    </>
  );
}
