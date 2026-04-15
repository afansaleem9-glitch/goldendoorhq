import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { AIAssistant } from "@/components/AIAssistant";
import { Toaster } from "@/components/ui/Toaster";
import { CommandPalette } from "@/components/ui/CommandPalette";

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
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#F0A500",
          colorText: "#0B1F3A",
        },
      }}
    >
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full flex flex-col bg-[#F3F4F6]">
          <NavBar />
          <main className="flex-1 pt-[60px]">{children}</main>
          <AIAssistant />
          <CommandPalette />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
