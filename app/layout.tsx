import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { BRAND } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : new URL("http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: `${BRAND.name} — Demo`,
    template: `%s · ${BRAND.name}`
  },
  description: "Demo web para veterinaria: turnos, triage, portal Mi Mascota y panel admin.",
  applicationName: `${BRAND.name} Demo`,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: "/",
    siteName: `${BRAND.name} Demo`,
    title: `${BRAND.name} — Demo`,
    description: "Turnos, triage, recordatorios y seguimiento post-consulta. Sin backend, listo para vender.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${BRAND.name} — Demo` }]
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — Demo`,
    description: "Turnos, triage, recordatorios y seguimiento post-consulta. Sin backend, listo para vender.",
    images: ["/opengraph-image"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Nav />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
