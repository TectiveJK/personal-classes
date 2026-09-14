import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Noto_Serif_SC, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { school } from "@/lib/school";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const noto = Noto_Serif_SC({
  variable: "--font-noto",
  weight: ["600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${school.name} · ${school.city}`,
    template: `%s · ${school.name}`,
  },
  description:
    "Book a private Shaolin session in Athens at Shaolin Temple Greece 希腊少林寺 — Kung Fu, Chen Taiji, Qigong, and Chan with Master Shi Yan Xiang.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${outfit.variable} ${cormorant.variable} ${noto.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
