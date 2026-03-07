import type { Metadata } from "next";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import AgendaClientPage from "./agenda-client-page";

export const metadata: Metadata = buildPageMetadata({
  title: `Agenda de turnos online | ${BRAND.name}`,
  description: `Reservá turnos en ${BRAND.name} con disponibilidad real por servicio y horario.`,
  path: "/agenda"
});

export default function AgendaPage() {
  return <AgendaClientPage />;
}
