import type { Metadata, Viewport } from "next";
import { Jost, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { SmoothScroll } from "@/components/smooth-scroll";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: { default: "AQUILA — For those who see further", template: "%s — AQUILA" },
  description:
    "A UAE-born sunglasses brand with a refined, understated point of view. Aquila takes its name from the Latin word for eagle — a symbol of vision and perspective.",
  openGraph: { title: "AQUILA", description: "For those who see further.", type: "website" },
};

export const viewport: Viewport = { themeColor: "#453d38" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${jost.variable}`}>
      <body className="min-h-dvh">
        <SmoothScroll />
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
