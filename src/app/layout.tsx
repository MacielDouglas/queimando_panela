import type { Metadata } from "next";
// import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
// import { cn } from "@/lib/utils";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

// const inter = Inter({subsets:['latin'],variable:'--font-sans'});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Queimando Panela",
  description: "Blog culinário amador aberto a todos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh bg-stone-50 text-stone-950 antialiased">
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
