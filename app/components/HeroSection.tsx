"use client";

export default function HeroSection() {
  return (
    <section className="relative z-10 flex flex-col items-center pt-20 pb-8 px-4 sm:pt-28 sm:pb-12">
      {/* Full-screen blurred robot background (Updated for blending) */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/robot.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
          filter: "blur(40px) opacity(0.3) saturate(0.8)",
          transform: "scale(1.2)",
          animation: "robotBgDrift 30s ease-in-out infinite",
        }}
      />

      {/* Hero Text */}
      <div className="relative z-10 text-center max-w-5xl animate-reveal">
        {/* Small robot icon/avatar above heading */}
        <div className="flex justify-center mb-10">
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden animate-float animate-glow"
            style={{
              boxShadow:
                "0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(124,58,237,0.15)",
            }}
          >
            <img
              src="/robot.png"
              alt="Decision Mirror AI"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 gradient-text leading-[1] font-[family-name:var(--font-outfit)]">
          Clarity in Seconds
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed opacity-0 animate-reveal" style={{ animationDelay: "0.2s" }}>
          Stop overthinking. Make better decisions instantly.
        </p>
      </div>
    </section>
  );
}
