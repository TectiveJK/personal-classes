import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Noto_Serif_SC, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { school } from "@/lib/config";
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
    default: `${school.name} · Personal Training`,
    template: `%s · ${school.name}`,
  },
  description:
    "Book a place in Personal Training at Shaolin Temple Greece Cultural Center. Monday to Friday, 8:30–9:30 PM, five students per session.",
  appleWebApp: {
    capable: true,
    title: "Shaolin PT",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${outfit.variable} ${cormorant.variable} ${noto.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
