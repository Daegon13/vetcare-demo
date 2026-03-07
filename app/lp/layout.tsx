import type { Metadata } from "next";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Implementación demo veterinaria | ${BRAND.name}`,
  description: `Solicitá una implementación de la experiencia digital de ${BRAND.name}: turnos, urgencias y portal.`,
  path: "/lp"
});

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
