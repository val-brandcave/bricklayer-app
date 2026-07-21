import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeScript } from "@/providers/ThemeScript";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SeedProvider } from "@/providers/SeedProvider";
import { MotionProvider } from "@/providers/MotionProvider";
import { AppShell } from "@/components/organisms/AppShell";

export const metadata: Metadata = {
  title: "Bricklayer — appraisal intelligence",
  description:
    "Turn your bank's book of commercial-real-estate appraisals into a queryable data lake with dashboards and an analytics copilot.",
  icons: { icon: "/logo/brick-layer-emblem.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0e1a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <MotionProvider>
            <SeedProvider>
              <AppShell>{children}</AppShell>
            </SeedProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
