"use client";

import * as React from "react";
import { BRAND } from "@/lib/data";
import type { PetProfile, Vaccine } from "@/lib/types";
import { loadPet, savePet } from "@/lib/storage";
import { formatDateLong, toWhatsAppLink, uid } from "@/lib/utils";
import { Container, Card, CardContent, CardHeader, Field, Input, Button, Badge } from "@/components/ui";
import { SectionHeading } from "@/components/section";
import { CommercialImplementationCTA } from "@/components/commercial-implementation-cta";

type HistoryItem = { id: string; dateISO: string; title: string; notes: string };

function daysFromToday(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function getDemoHistory(): HistoryItem[] {
  return [
    {
      id: "h_1",
      dateISO: daysFromToday(-16),
      title: "Control general anual",
      notes: "Buen estado general. Se recomendó mantener rutina de actividad y control de peso trimestral."
    },
    {
      id: "h_2",
      dateISO: daysFromToday(-45),
      title: "Refuerzo de vacunación",
      notes: "Aplicación sin eventos adversos. Próxima dosis agendada en calendario preventivo."
    },
    {
      id: "h_3",
      dateISO: daysFromToday(-92),
      title: "Consulta dermatológica",
      notes: "Irritación leve resuelta con higiene tópica. Se indicó seguimiento preventivo."
    }
  ];
}

function soon(dateISO?: string) {
  if (!dateISO) return false;
  const d = new Date(dateISO + "T00:00:00");
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return diff >= 0 && diff <= 1000 * 60 * 60 * 24 * 30;
}

function overdue(dateISO?: string) {
  if (!dateISO) return false;
  const d = new Date(dateISO + "T00:00:00");
  const now = new Date();
  return d.getTime() < now.getTime();
}

export default function MiMascotaPage() {
  const [pet, setPet] = React.useState<PetProfile>(() => loadPet());
  const [history] = React.useState<HistoryItem[]>(getDemoHistory);

  const [vName, setVName] = React.useState("");
  const [vDate, setVDate] = React.useState("");
  const [vNext, setVNext] = React.useState("");

  function persist(next: PetProfile) {
    setPet(next);
    savePet(next);
  }

  function addVaccine() {
    if (!vName.trim() || !vDate) return;
    const v: Vaccine = { id: uid("v"), name: vName.trim(), dateISO: vDate, nextDueISO: vNext || undefined };
    persist({ ...pet, vaccines: [v, ...pet.vaccines] });
    setVName("");
    setVDate("");
    setVNext("");
  }

  function removeVaccine(id: string) {
    persist({ ...pet, vaccines: pet.vaccines.filter(v => v.id !== id) });
  }

  const overdueCount = pet.vaccines.filter(v => overdue(v.nextDueISO)).length;
  const dueSoonCount = pet.vaccines.filter(v => soon(v.nextDueISO)).length;
  const hasOverdue = overdueCount > 0;
  const nextVaccine = pet.vaccines
    .filter(v => !!v.nextDueISO && !overdue(v.nextDueISO))
    .slice()
    .sort((a, b) => (a.nextDueISO ?? "").localeCompare(b.nextDueISO ?? ""))[0];

  const waText = `Hola! Quiero agendar/control para ${pet.petName}.\nEspecie: ${pet.species}.\nVacunas próximas: ${pet.vaccines
    .filter(v => soon(v.nextDueISO))
    .map(v => `${v.name} (${v.nextDueISO})`)
    .join(", ") || "N/A"}`;

  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Portal"
        title="Mi Mascota"
        desc="Una vista clara del portal del tutor con estado general, próximos cuidados e historial clínico esencial de la mascota."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex items-center justify-between">
            <div className="grid">
              <div className="text-sm font-extrabold">Ficha de {pet.petName}</div>
              <div className="text-sm text-black/60">Resumen de salud y seguimiento preventivo</div>
            </div>
            {hasOverdue ? <Badge tone="bad">Hay vacunas vencidas</Badge> : dueSoonCount > 0 ? <Badge tone="warn">Requiere seguimiento</Badge> : <Badge tone="good">Estado general estable</Badge>}
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-black/50">Estado general</div>
                <div className="mt-1 text-sm font-extrabold">{hasOverdue ? "Con vencimientos a regularizar" : dueSoonCount > 0 ? "Con recordatorio cercano" : "Controles al día"}</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-black/50">Próxima vacuna</div>
                <div className="mt-1 text-sm font-extrabold">{nextVaccine?.name ?? "Sin pendientes"}</div>
                <div className="text-xs text-black/55">
                  {nextVaccine?.nextDueISO ? formatDateLong(nextVaccine.nextDueISO) : hasOverdue ? "Hay controles vencidos para revisar" : "No hay vencimientos cargados"}
                </div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-black/50">Vencimientos próximos</div>
                <div className="mt-1 text-sm font-extrabold">{dueSoonCount}</div>
                <div className="text-xs text-black/55">en los próximos 30 días</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-black/50">Vencidas</div>
                <div className="mt-1 text-sm font-extrabold">{overdueCount}</div>
                <div className="text-xs text-black/55">requieren regularización</div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-black/50">Nombre</div>
                <div className="mt-1 text-sm font-semibold">{pet.petName}</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-black/50">Especie</div>
                <div className="mt-1 text-sm font-semibold">{pet.species}</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-black/50">Raza</div>
                <div className="mt-1 text-sm font-semibold">{pet.breed || "No informada"}</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-black/50">Año de nacimiento</div>
                <div className="mt-1 text-sm font-semibold">{pet.birthYear || "No informado"}</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-black/50">Peso</div>
                <div className="mt-1 text-sm font-semibold">{pet.weightKg ? `${pet.weightKg} kg` : "No informado"}</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-black/50">Alergias</div>
                <div className="mt-1 text-sm font-semibold">{pet.allergies || "Sin alergias reportadas"}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => window.open(toWhatsAppLink(BRAND.whatsapp, waText), "_blank")} className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">
                Solicitar recordatorio por WhatsApp
              </Button>
              <CommercialImplementationCTA />
            </div>

            <div className="grid gap-2 rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-sm font-extrabold">Vacunas y vencimientos</div>
              <div className="grid gap-2">
                {pet.vaccines.length === 0 ? (
                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm text-black/60">
                    Esta ficha todavía no tiene vacunas registradas.
                  </div>
                ) : (
                  pet.vaccines.map(v => (
                    <div key={v.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-black/5 px-3 py-2">
                      <div className="grid">
                        <div className="text-sm font-semibold">{v.name}</div>
                        <div className="text-xs text-black/55">
                          Dosis: {formatDateLong(v.dateISO)} {v.nextDueISO ? `· Próx: ${formatDateLong(v.nextDueISO)}` : ""}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {overdue(v.nextDueISO) ? (
                          <Badge tone="bad">Vencida</Badge>
                        ) : soon(v.nextDueISO) ? (
                          <Badge tone="warn">Por vencer</Badge>
                        ) : v.nextDueISO ? (
                          <Badge tone="neutral">Vigente</Badge>
                        ) : (
                          <Badge tone="neutral">Sin próximo</Badge>
                        )}
                        <button
                          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold hover:bg-black/5"
                          onClick={() => removeVaccine(v.id)}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-2 grid gap-3 sm:grid-cols-3">
                <Field label="Nombre vacuna">
                  <Input value={vName} onChange={e => setVName(e.target.value)} placeholder="Ej: Antirrábica" />
                </Field>
                <Field label="Fecha">
                  <Input type="date" value={vDate} onChange={e => setVDate(e.target.value)} />
                </Field>
                <Field label="Próximo vencimiento (opcional)">
                  <Input type="date" value={vNext} onChange={e => setVNext(e.target.value)} />
                </Field>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={addVaccine} variant="outline">Agregar vacuna</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="text-sm font-extrabold">Historial clínico</div>
            <div className="text-sm text-black/60">Últimos eventos registrados</div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {history.map(h => (
              <div key={h.id} className="grid gap-1 rounded-2xl border border-black/10 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-extrabold">{h.title}</div>
                  <Badge tone="neutral">{h.dateISO}</Badge>
                </div>
                <div className="text-xs text-black/55">{formatDateLong(h.dateISO)}</div>
                <p className="text-sm text-black/70">{h.notes}</p>
              </div>
            ))}

            <div className="text-xs text-black/50">Resumen clínico breve para seguimiento cotidiano del tutor.</div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
