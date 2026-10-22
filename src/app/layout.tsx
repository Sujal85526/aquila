import type { Metadata, Viewport } from "next";
import { Jost, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { Loader } from "@/components/loader";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Eagle } from "@/components/eagle";
import { PageFrame } from "@/components/page-frame";
import { PageTransition } from "@/components/page-transition";

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
        <Loader />
        <noscript><style>{".aq-loader{display:none!important}"}</style></noscript>
        <SmoothScroll>
          <PageTransition />
          <Eagle />
          <Header />
          <PageFrame footer={<Footer />}>
            <main>{children}</main>
          </PageFrame>
          <CartDrawer />
        </SmoothScroll>
      </body>
    </html>
  );
}
