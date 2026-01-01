import type { Metadata } from "next";
import { Inter, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-fallback",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Feben's Gallery | Journal & Art",
  description: "A modern personal space for reflections, faith, and art.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${playfair.variable} ${inter.variable} antialiased`}>
        <div className="container">
          <header className="glass-header fade-up">
            <div className="logo serif" style={{ fontSize: '1.5rem', color: 'var(--accent-vibrant)' }}>
              Feben.
            </div>
            <nav className="nav-links">
              <a href="/">Home</a>
              <a href="/journal">Journal</a>
              <a href="/verses">Verses</a>
              <a href="/art">Art</a>
              <a href="/about">About</a>
            </nav>
            <div className="header-actions">
              <ThemeToggle />
            </div>
          </header>
          <main>{children}</main>
          <footer className="fade-up">
            <p className="serif" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Feben Getachew ✧ 2026</p>
            <p style={{ opacity: 0.6 }}>A modern space for quiet thoughts.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
