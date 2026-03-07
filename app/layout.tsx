import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { DemoBootstrap } from "@/components/demo-bootstrap";
import { FloatingCta } from "@/components/floating-cta";
import { ThemeProvider } from "@/components/theme-provider";
import { BRAND } from "@/lib/data";
import { getSiteUrl } from "@/lib/seo";

const siteUrl = getSiteUrl();

const defaultTitle = `${BRAND.name} — Turnos, urgencias y portal del cliente`;
const defaultDescription = `Demo web de ${BRAND.name}: agenda con disponibilidad real, triage de urgencias y portal para clientes.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s · ${BRAND.name}`
  },
  description: defaultDescription,
  applicationName: BRAND.name,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    title: defaultTitle,
    description: defaultDescription,
    siteName: BRAND.name,
    url: siteUrl,
    images: ["/opengraph-image"]
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/opengraph-image"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const localBusinessSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VeterinaryCare",
    name: BRAND.name,
    url: siteUrl
  };

  if (BRAND.address) {
    localBusinessSchema.address = {
      "@type": "PostalAddress",
      streetAddress: BRAND.address
    };
  }

  if (BRAND.phone) {
    localBusinessSchema.telephone = BRAND.phone;
  }

  if (BRAND.hours) {
    localBusinessSchema.openingHours = BRAND.hours;
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-graphite-950 antialiased dark:bg-graphite-950 dark:text-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <ThemeProvider>
          <Suspense fallback={null}>
            <DemoBootstrap />
            <Nav />
          </Suspense>
          <main className="min-h-[60vh]">{children}</main>
          <FloatingCta />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
