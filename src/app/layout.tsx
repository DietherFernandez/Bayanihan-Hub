import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CitizenStateProvider } from "@/components/providers/citizen-state-provider";
import { CivicHeader, CivicFooter } from "@/components/layout/civic-shell";

export const metadata: Metadata = {
  title: {
    default: "GabayPH — Your Everyday Guide to a Better Life",
    template: "%s | GabayPH",
  },
  description:
    "Accessible, trustworthy, and free digital platform connecting Filipinos with verified government services, employment, financial assistance, education, community support, and emergency resources.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B3D91",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-[#0B3D91] focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <CitizenStateProvider>
          <CivicHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <CivicFooter />
        </CitizenStateProvider>
      </body>
    </html>
  );
}
