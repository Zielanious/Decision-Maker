import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Decision Mirror — AI-Powered Decision Clarity",
  description:
    "Stop overthinking. Make better decisions instantly with AI-powered analysis that gives you clarity in seconds.",
  keywords: ["decision making", "AI", "clarity", "analysis", "dilemma solver"],
  openGraph: {
    title: "Decision Mirror — Clarity in Seconds",
    description: "Stop overthinking. Make better decisions instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
