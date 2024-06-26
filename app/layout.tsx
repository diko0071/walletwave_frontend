import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import HeaderDif from "./components/HeaderDif";
import SidebarDif from "./components/SidebarDif";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallet Wave",
  description: "Wallet Wave is a personal finance app that helps you manage your money and track your expenses using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (  
    <html lang="en">
      <body className={`${inter.className}`}>
        <SidebarDif />
        <main className="grid w-full h-full">
          <HeaderDif />
          {children}
          </main>
          <Toaster />
      </body>
    </html>
  );
}