"use client";

import * as React from "react";
import { BRAND } from "@/lib/data";
import type { PetProfile, Vaccine } from "@/lib/types";
import { loadPet, savePet } from "@/lib/storage";
import { formatDateLong, toWhatsAppLink, uid } from "@/lib/utils";
import { Container, Card, CardContent, CardHeader, Field, Input, Select, Textarea, Button, Badge } from "@/components/ui";
import { SectionHeading } from "@/components/section";

type HistoryItem = { id: string; dateISO: string; title: string; notes: string };

function soon(dateISO?: string) {
  if (!dateISO) return false;
  const d = new Date(dateISO + "T00:00:00");
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return diff <= 1000 * 60 * 60 * 24 * 30; // 30 días
}

export default function MiMascotaPage() {
  const [pet, setPet] = React.useState<PetProfile | null>(null);
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = React.useState(false);

  const [vName, setVName] = React.useState("");
  const [vDate, setVDate] = React.useState("");
  const [vNext, setVNext] = React.useState("");

  React.useEffect(() => {
    const p = loadPet();
    setPet(p);
  }, []);

  React.useEffect(() => {
    (async () => {
      setLoadingHistory(true);
      try {
        const res = await fetch("/api/history", { cache: "no-store" });
        const json = (await res.json()) as { items: HistoryItem[] };
        setHistory(json.items ?? []);
      } finally {
        setLoadingHistory(false);
      }
    })();
  }, []);

  function persist(next: PetProfile) {
    setPet(next);
    savePet(next);
  }

  function update<K extends keyof PetProfile>(key: K, value: PetProfile[K]) {
    if (!pet) return;
    persist({ ...pet, [key]: value });
  }

  function addVaccine() {
    if (!pet) return;
    if (!vName.trim() || !vDate) return;
    const v: Vaccine = { id: uid("v"), name: vName.trim(), dateISO: vDate, nextDueISO: vNext || undefined };
    persist({ ...pet, vaccines: [v, ...pet.vaccines] });
    setVName(""); setVDate(""); setVNext("");
  }

  function removeVaccine(id: string) {
    if (!pet) return;
    persist({ ...pet, vaccines: pet.vaccines.filter(v => v.id !== id) });
  }

  const dueSoon = pet?.vaccines.some(v => soon(v.nextDueISO)) ?? false;
  const waText = pet
    ? `Hola! Quiero agendar/control para ${pet.petName}.\nEspecie: ${pet.species}.\nVacunas próximas: ${pet.vaccines
        .filter(v => soon(v.nextDueISO))
        .map(v => `${v.name} (${v.nextDueISO})`)
        .join(", ") || "N/A"}`
    : "Hola! Quiero agendar un control.";

  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Portal"
        title="Mi Mascota"
        desc="Perfil simple con vacunas e historial. En una versión real se autentica por WhatsApp o email."
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex items-center justify-between">
            <div className="grid">
              <div className="text-sm font-extrabold">Perfil</div>
              <div className="text-sm text-black/60">guardado en localStorage (demo)</div>
            </div>
            {dueSoon ? <Badge tone="warn">Vacuna por vencer</Badge> : <Badge tone="good">Al día</Badge>}
          </CardHeader>
          <CardContent className="grid gap-4">
            {!pet ? (
              <div className="text-sm text-black/60">Cargando…</div>
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Nombre">
                    <Input value={pet.petName} onChange={e => update("petName", e.target.value)} />
                  </Field>
                  <Field label="Especie">
                    <Select value={pet.species} onChange={e => update("species", e.target.value as any)}>
                      <option>Perro</option>
                      <option>Gato</option>
                      <option>Otro</option>
                    </Select>
                  </Field>
                  <Field label="Raza (opcional)">
                    <Input value={pet.breed ?? ""} onChange={e => update("breed", e.target.value)} />
                  </Field>
                  <Field label="Año nacimiento (opcional)">
                    <Input type="number" value={pet.birthYear ?? ""} onChange={e => update("birthYear", e.target.value ? Number(e.target.value) : undefined)} />
                  </Field>
                  <Field label="Peso kg (opcional)">
                    <Input type="number" step="0.1" value={pet.weightKg ?? ""} onChange={e => update("weightKg", e.target.value ? Number(e.target.value) : undefined)} />
                  </Field>
                  <Field label="Alergias (opcional)">
                    <Input value={pet.allergies ?? ""} onChange={e => update("allergies", e.target.value)} />
                  </Field>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-4 grid gap-2">
                  <div className="text-sm font-extrabold">Vacunas</div>
                  <div className="grid gap-2">
                    {pet.vaccines.length === 0 ? (
                      <div className="text-sm text-black/60">No hay vacunas cargadas.</div>
                    ) : (
                      pet.vaccines.map(v => (
                        <div key={v.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-black/5 px-3 py-2">
                          <div className="grid">
                            <div className="text-sm font-semibold">{v.name}</div>
                            <div className="text-xs text-black/55">
                              Dosis: {v.dateISO} {v.nextDueISO ? `· Próx: ${v.nextDueISO}` : ""}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {soon(v.nextDueISO) ? <Badge tone="warn">Próxima</Badge> : <Badge tone="neutral">OK</Badge>}
                            <button
                              className="rounded-xl bg-white px-3 py-2 text-xs font-semibold border border-black/10 hover:bg-black/5"
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
                    <Button onClick={() => window.open(toWhatsAppLink(BRAND.whatsapp, waText), "_blank")} className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">
                      Recordar por WhatsApp
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="text-sm font-extrabold">Historial clínico (mock)</div>
            <div className="text-sm text-black/60">viene de /api/history</div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {loadingHistory ? (
              <div className="text-sm text-black/60">Cargando historial…</div>
            ) : (
              history.map(h => (
                <div key={h.id} className="rounded-2xl border border-black/10 bg-white p-4 grid gap-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-extrabold">{h.title}</div>
                    <Badge tone="neutral">{h.dateISO}</Badge>
                  </div>
                  <div className="text-xs text-black/55">{formatDateLong(h.dateISO)}</div>
                  <p className="text-sm text-black/70">{h.notes}</p>
                </div>
              ))
            )}

            <div className="text-xs text-black/50">
              En una versión real: historial protegido (login), adjuntos, recetas, y recordatorios automáticos.
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
