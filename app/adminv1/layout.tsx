import type { Metadata } from "next";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Panel admin demo | ${BRAND.name}`,
  description: `Gestioná turnos, triage, pedidos, pacientes y campañas en el panel demo de ${BRAND.name}.`,
  path: "/adminv1"
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
