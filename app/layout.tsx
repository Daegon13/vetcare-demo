import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { DemoBootstrap } from "@/components/demo-bootstrap";
import { FloatingCta } from "@/components/floating-cta";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "VetCare — Turnos, urgencias y portal del cliente",
    template: "%s · VetCare"
  },
  description: "Demo web para veterinaria: turnos, triage, portal ‘Mi Mascota’ y panel admin.",
  applicationName: "VetCare",
  openGraph: {
    type: "website",
    title: "VetCare — Turnos, urgencias y portal del cliente",
    description: "Agenda con disponibilidad real, triage de urgencias y recordatorios por WhatsApp.",
    siteName: "VetCare"
  },
  twitter: {
    card: "summary_large_image",
    title: "VetCare — Turnos, urgencias y portal del cliente",
    description: "Agenda con disponibilidad real, triage de urgencias y recordatorios por WhatsApp."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <DemoBootstrap />
          <Nav />
          <main className="min-h-[60vh]">{children}</main>
          <FloatingCta />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
