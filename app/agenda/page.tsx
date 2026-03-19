import type { Metadata } from "next";
import { BRAND, SERVICES } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { getSeedPreview } from "@/lib/storage";
import type { ServiceId } from "@/lib/types";
import AgendaClientPage from "./agenda-client-page";

export const metadata: Metadata = buildPageMetadata({
  title: `Agenda de turnos online | ${BRAND.name}`,
  description: `Reservá turnos en ${BRAND.name} con disponibilidad real por servicio y horario.`,
  path: "/agenda"
});

export default async function AgendaPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const rawService = Array.isArray(params.service) ? params.service[0] : params.service;
  const serviceIds = new Set<ServiceId>(SERVICES.map((service) => service.id));
  const seedAppointments = getSeedPreview().appointments;
  const initialServiceId: ServiceId = rawService && serviceIds.has(rawService as ServiceId) ? (rawService as ServiceId) : "consulta";
  const initialDateISO = seedAppointments[0]?.dateISO ?? new Date().toISOString().slice(0, 10);

  return <AgendaClientPage initialAppointments={seedAppointments} initialServiceId={initialServiceId} initialDateISO={initialDateISO} />;
}
