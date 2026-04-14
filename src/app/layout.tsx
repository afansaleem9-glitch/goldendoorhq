import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F3F4F6]">
        <NavBar />
        <main className="flex-1 pt-[60px]">{children}</main>
      </body>
    </html>
  );
}
