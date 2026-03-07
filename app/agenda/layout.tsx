import type { Metadata } from "next";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Agenda de turnos online | ${BRAND.name}`,
  description: `Reservá turnos en ${BRAND.name} con disponibilidad real por servicio y horario.`,
  path: "/agenda"
});

export default function AgendaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
