import type { Metadata } from "next";
import { Inter, Crimson_Pro, Lateef, DM_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SessionProvider from "@/components/SessionProvider";
import AddToHomeScreen from "@/components/AddToHomeScreen";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const lateef = Lateef({
  variable: "--font-lateef",
  subsets: ["arabic"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KhatamTogether — Shared Quran & Yaseen Journeys",
  description: "Complete the Quran or 40 Yaseen together as a group, dedicated to your loved ones.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "KhatamTogether",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "KhatamTogether",
    description: "Collective Quran and Yaseen completion journeys",
    type: "website",
  },
};

// Inline script prevents flash of wrong theme before React hydrates.
// Runs synchronously in <head> — must stay a plain string, no template vars.
const themeScript = `(function(){
  try {
    var s = localStorage.getItem('qt-theme');
    var dark = s === 'dark' || (!s && window.matchMedia('(prefers-color-scheme:dark)').matches) || (s === 'system' && window.matchMedia('(prefers-color-scheme:dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  } catch(e){}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${crimsonPro.variable} ${lateef.variable} ${dmMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/* Theme script must be first in <head> to prevent FOUC */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-void">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AddToHomeScreen />
        </SessionProvider>
      </body>
    </html>
  );
}
