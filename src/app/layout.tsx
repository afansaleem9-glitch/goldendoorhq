import type { Metadata } from "next";
import { Inter } from "next/font/google";
// ClerkProvider disabled until real API keys are configured on Vercel
// import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { AIAssistant } from "@/components/AIAssistant";
import { Toaster } from "@/components/ui/Toaster";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { ChromeGate } from "@/components/ChromeGate";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GoldenDoor CRM",
  description: "Enterprise CRM Platform — GoldenDoor HQ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable}`}>
      <body className="min-h-full flex flex-col bg-[#F3F4F6]">
        <ChromeGate><NavBar /></ChromeGate>
        <main className="flex-1">{children}</main>
        <ChromeGate><AIAssistant /></ChromeGate>
        <ChromeGate><CommandPalette /></ChromeGate>
        <Toaster />
      </body>
    </html>
  );
}
