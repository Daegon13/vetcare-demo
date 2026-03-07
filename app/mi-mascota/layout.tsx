import type { Metadata } from "next";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Mi Mascota | ${BRAND.name}`,
  description: `Accedé al portal de ${BRAND.name} para ver vacunas, historial y próximos controles de tu mascota.`,
  path: "/mi-mascota"
});

export default function MiMascotaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
