import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/store";
import { AgeGate, CartDrawer, Header, MobileTabBar, SmoothScroll, Toast } from "@/components/chrome";
import { Footer } from "@/components/footer";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", style: ["normal", "italic"], axes: ["SOFT", "opsz"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3005"),
  title: { default: "Intellobyte Toys — Pleasure, intelligently designed", template: "%s · Intellobyte Toys" },
  description: "India's premium destination for body-safe adult toys from LELO, Satisfyer, Womanizer, Lovense, Aneros and more. Discreet packaging, COD, fast delivery.",
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#140a18" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-dvh overflow-x-clip">
        <StoreProvider>
            <SmoothScroll />
            <Header />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
            <MobileTabBar />
            <Toast />
            <AgeGate />
        </StoreProvider>
      </body>
    </html>
  );
}
