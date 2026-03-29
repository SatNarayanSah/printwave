import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrintWave | Premium Custom Printing Services",
  description: "Create unique custom designs for t-shirts, mugs, posters, and more with PrintWave's professional printing services. Calm, fast, and high quality.",
  keywords: ["custom printing", "t-shirt design", "personalized gifts", "mugs", "posters", "stickers", "PrintWave"],
  authors: [{ name: "PrintWave Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased selection:bg-accent selection:text-white`}>
      <body className="flex flex-col min-h-screen bg-primary-bg overflow-x-hidden">
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

