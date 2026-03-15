import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventHub | Élite",
  description: "Conexión exclusiva para eventos de alto impacto",
};

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="mesh-gradient"></div>
        <AuthProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#0a0a0a',
                color: '#fff',
                border: '1px solid rgba(168, 85, 247, 0.2)',
              },
            }}
          />
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            <footer className="py-10 text-center border-t border-white/5 bg-black/20 backdrop-blur-sm">
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.4em] italic">
                Creado por <span className="text-purple-500">Jehison Bustamante</span>
              </p>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
