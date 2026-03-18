"use client";

import * as React from "react";
import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { SERVICES } from "@/lib/data";
import { getSeedPreview, loadAppointments, loadPet, loadTriage } from "@/lib/storage";
import type { Appointment, TriageCase, Vaccine } from "@/lib/types";

type AgendaItem = {
  id: string;
  petName: string;
  service: string;
  label: string;
};

const AGENDA_PLACEHOLDERS: AgendaItem[] = [
  { id: "placeholder-a", petName: "Luna", service: "Control general", label: "Hoy · 10:30" },
  { id: "placeholder-b", petName: "Milo", service: "Vacunación", label: "Mañana · 16:00" }
];

function toDateTimeMs(item: Appointment) {
  return new Date(`${item.dateISO}T${item.time}:00`).getTime();
}

function formatAppt(appt: Appointment): AgendaItem {
  const when = new Date(`${appt.dateISO}T${appt.time}:00`);
  const service = SERVICES.find((s) => s.id === appt.serviceId)?.name ?? "Consulta";

  return {
    id: appt.id,
    petName: appt.petName,
    service,
    label: when.toLocaleString("es-UY", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    })
  };
}

function getTopTriage(items: TriageCase[]) {
  const rank = { alta: 3, media: 2, baja: 1 };
  const sorted = [...items].sort((a, b) => {
    const byPriority = rank[b.priority] - rank[a.priority];
    if (byPriority !== 0) return byPriority;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return sorted[0];
}

function getNextVaccine(vaccines: Vaccine[]) {
  const candidates = vaccines
    .filter((v) => v.nextDueISO)
    .sort((a, b) => new Date(a.nextDueISO as string).getTime() - new Date(b.nextDueISO as string).getTime());

  return candidates[0];
}

function getPriorityTone(priority: string): "bad" | "warn" | "neutral" {
  if (priority === "ALTA") return "bad";
  if (priority === "MEDIA") return "warn";
  return "neutral";
}

export function HeroVisual() {
  const seed = React.useMemo(() => getSeedPreview(), []);
  const [agenda, setAgenda] = React.useState<AgendaItem[]>(() => seed.appointments.slice(0, 2).map(formatAppt));
  const [triage, setTriage] = React.useState(() => ({
    petName: getTopTriage(seed.triage)?.petName ?? "Nina",
    symptom: getTopTriage(seed.triage)?.symptoms[0] ?? "dificultad para respirar",
    priority: getTopTriage(seed.triage)?.priority.toUpperCase() ?? "ALTA"
  }));
  const [pet, setPet] = React.useState(() => {
    const vaccine = getNextVaccine(seed.pet.vaccines);
    return {
      petName: seed.pet.petName,
      vaccine: vaccine?.name ?? "Séxtuple anual",
      dueLabel: vaccine?.nextDueISO ? `Vence el ${vaccine.nextDueISO}` : "Vence en 5 días"
    };
  });

  React.useEffect(() => {
    const now = Date.now();
    const appointments = loadAppointments()
      .filter((item) => item.status !== "cancelado" && toDateTimeMs(item) >= now)
      .sort((a, b) => toDateTimeMs(a) - toDateTimeMs(b))
      .slice(0, 2)
      .map(formatAppt);

    if (appointments.length > 0) {
      setAgenda(
        appointments.length === 1
          ? [...appointments, { id: "placeholder-b", petName: "Nuevo paciente", service: "Consulta", label: "Disponible hoy" }]
          : appointments
      );
    }

    const topTriage = getTopTriage(loadTriage());
    if (topTriage) {
      setTriage({
        petName: topTriage.petName,
        symptom: topTriage.symptoms[0] ?? "síntomas reportados",
        priority: topTriage.priority.toUpperCase()
      });
    }

    const petProfile = loadPet();
    const vaccine = getNextVaccine(petProfile.vaccines);

    if (vaccine?.nextDueISO) {
      const days = Math.ceil((new Date(vaccine.nextDueISO).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const dueLabel = days < 0 ? "Vencida" : days === 0 ? "Vence hoy" : `Vence en ${days} días`;

      setPet({
        petName: petProfile.petName,
        vaccine: vaccine.name,
        dueLabel
      });
    }
  }, []);

  return (
    <div className="grid gap-3 sm:gap-4">
      <Card className="min-h-[220px] p-4 transition-transform duration-200 hover:-translate-y-0.5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wide text-black/60 dark:text-white/70">Agenda · Próximos turnos</p>
          <Link href="/agenda" className="text-xs font-semibold text-cyanSoft-700 hover:underline dark:text-cyanSoft-300">Ver agenda</Link>
        </div>
        <div className="grid gap-2">
          {agenda.map((item) => (
            <div key={item.id} className="rounded-xl border border-black/10 bg-black/[0.02] px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="text-sm font-semibold">{item.petName}</div>
              <div className="text-xs text-black/65 dark:text-white/70">{item.service}</div>
              <div className="mt-1 text-xs font-medium text-black/70 dark:text-white/75">{item.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <Card className="min-h-[164px] p-4 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-black/60 dark:text-white/70">Triage</p>
            <Badge tone={getPriorityTone(triage.priority)}>{triage.priority}</Badge>
          </div>
          <div className="text-sm font-semibold">{triage.petName}</div>
          <p className="mt-1 text-xs text-black/65 dark:text-white/70">Síntoma principal: {triage.symptom}</p>
          <Link href="/urgencias" className="mt-3 inline-block text-xs font-semibold text-cyanSoft-700 hover:underline dark:text-cyanSoft-300">Abrir urgencias</Link>
        </Card>

        <Card className="min-h-[164px] p-4 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-black/60 dark:text-white/70">Mi Mascota</p>
            <Badge tone="warn">Próxima vacuna</Badge>
          </div>
          <div className="text-sm font-semibold">{pet.petName}</div>
          <p className="mt-1 text-xs text-black/65 dark:text-white/70">{pet.vaccine}</p>
          <p className="mt-1 text-xs font-medium text-black/70 dark:text-white/75">{pet.dueLabel}</p>
          <Link href="/mi-mascota" className="mt-3 inline-block text-xs font-semibold text-cyanSoft-700 hover:underline dark:text-cyanSoft-300">Ver ficha</Link>
        </Card>
      </div>
    </div>
  );
}
