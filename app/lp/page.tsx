import type { Metadata } from "next";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import LandingClientPage from "./lp-client-page";

export const metadata: Metadata = buildPageMetadata({
  title: `Implementación veterinaria | ${BRAND.name}`,
  description: `Solicitá una implementación de la experiencia digital de ${BRAND.name}: turnos, urgencias y portal.`,
  path: "/lp"
});

export default function LandingPage() {
  return <LandingClientPage />;
}
