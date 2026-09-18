import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import Script from "next/script";
import WhatsAppButton from '@/components/whatsapp-button'

import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileActionBar } from "@/components/mobile-action-bar";
import {
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildWebsiteSchema,
} from "@/lib/catalog";
import { buildCartCatalog } from "@/lib/cart-catalog";
import { createMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

import "./globals.css";

// globals.css declares --font-display / --font-body with these families first;
// until now nothing loaded them, so every visitor saw the Impact/Segoe fallbacks.
const displayFont = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas",
});
const bodyFont = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Texas Football Uniforms",
  verification: {
    google: "C8wtjtViAPcmzX9QYIbHkaYWyPMkQ7X9qwFyRJ9JIbs",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
    shortcut: "/icon.svg",
  },
  ...createMetadata({
    title: "Custom Football Uniforms in Texas | Jerseys & Team Kits",
    description:
      "Custom football uniforms, jerseys and team kits for Texas schools, youth leagues and clubs. Min 10 per design, 1 to 2 weeks, free mockup in 24 hours.",
    path: "/",
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = buildOrganizationSchema();
  const localBusinessSchema = buildLocalBusinessSchema();
  const websiteSchema = buildWebsiteSchema();
  // Resolved once, on the server: the cart in the browser stores slugs and
  // quantities only, and reads names, prices and size runs from this.
  const cartCatalog = buildCartCatalog();

  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="pb-14 sm:pb-0">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J277MJQFD0"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-J277MJQFD0');`}
        </Script>
        <Script src="/ga4-events.js" strategy="afterInteractive" />
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","yk7eoybep1");`}
        </Script>
        <CartProvider catalog={cartCatalog}>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script src="https://chat.zeeops.dev/widget.js?siteId=texasfootball" strategy="lazyOnload" />
        {/* WhatsApp: bottom-LEFT, because the ZeeOps chat widget owns
            bottom-right and two round buttons in one corner overlap on a
            phone. In the root layout so every route carries it. */}
        <WhatsAppButton />
        <MobileActionBar />
      </body>
    </html>
  );
}
