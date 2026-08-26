import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Queimando Panela — Receitas de quem ama cozinhar",
    template: "%s | Queimando Panela",
  },
  description:
    "Blog comunitário para cozinheiros amadores compartilharem receitas. Cada receita recebe análise completa por IA: correção, utensílios, tabela nutricional, substituições e texto apetitoso.",
  metadataBase: new URL("https://queimandopanela.vercel.app"),
  openGraph: {
    title: "Queimando Panela",
    description: "Compartilhe suas receitas e receba uma análise completa por IA.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#FFFCF5] text-zinc-900">{children}</body>
    </html>
  );
}
