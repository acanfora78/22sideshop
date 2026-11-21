import type { Metadata, Viewport } from "next";
import { Anton, Archivo, IBM_Plex_Mono, Instrument_Serif, Permanent_Marker } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { INTRO_STORAGE_KEY, INTRO_TTL_MS } from "@/components/home/intro-config";

// All families are SIL Open Font License — free for commercial use.
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", axes: ["wdth"] });
const plexMono = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-plex-mono", display: "swap" });
const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const marker = Permanent_Marker({ weight: "400", subsets: ["latin"], variable: "--font-permanent-marker", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://22side.example"),
  title: { default: "22SIDE® — No Rules. Just Attitude.", template: "%s — 22SIDE®" },
  description: "22SIDE — streetwear indipendente nato all'ombra del Vesuvio e cresciuto con la cultura underground americana degli anni '90.",
  openGraph: {
    title: "22SIDE® — No Rules. Just Attitude.",
    description: "Streetwear indipendente. Underground NYC — anni '90 reinventati.",
    images: [{ url: "/media/scene-street-figure.jpg", width: 2400, height: 1500 }],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
};

// Runs before first paint: hides the intro overlay for visitors who've seen it recently.
const introScript = `try{var t=+sessionStorage.getItem(${JSON.stringify(INTRO_STORAGE_KEY)});if(t&&Date.now()-t<${INTRO_TTL_MS})document.documentElement.setAttribute('data-intro','seen')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      suppressHydrationWarning
      className={`${anton.variable} ${archivo.variable} ${plexMono.variable} ${instrument.variable} ${marker.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="label sr-only z-[100] bg-dirty px-4 py-3 text-obsidian focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Vai al contenuto
        </a>
        <CartProvider>
          <SmoothScroll>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <CartDrawer />
            <DemoBanner />
          </SmoothScroll>
        </CartProvider>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
