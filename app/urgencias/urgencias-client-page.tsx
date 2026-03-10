"use client";

import * as React from "react";
import type { PetSpecies, TriageCase, TriagePriority } from "@/lib/types";
import { loadTriage, saveTriage } from "@/lib/storage";
import { uid } from "@/lib/utils";
import { Container, Card, CardContent, CardHeader, Field, Input, Select, Textarea, Button, Badge } from "@/components/ui";
import { SectionHeading } from "@/components/section";
import { LeadCTA } from "@/components/LeadCTA";
import { CommercialImplementationCTA } from "@/components/commercial-implementation-cta";

const SYMPTOMS = [
  { id: "respira", label: "Dificultad respiratoria" },
  { id: "sangrado", label: "Sangrado abundante" },
  { id: "convulsiones", label: "Convulsiones" },
  { id: "inconsciente", label: "Desmayo / inconsciente" },
  { id: "trauma", label: "Golpe fuerte / atropello" },
  { id: "vomito_sangre", label: "Vómitos con sangre" },
  { id: "vomito", label: "Vómitos frecuentes" },
  { id: "diarrea", label: "Diarrea" },
  { id: "fiebre", label: "Fiebre / decaimiento" },
  { id: "dolor", label: "Dolor intenso" },
  { id: "cojera", label: "Cojera" },
  { id: "ojo", label: "Ojo irritado / secreción" }
];

function assess(symptoms: string[]): { priority: TriagePriority; action: string } {
  const severe = ["respira", "sangrado", "convulsiones", "inconsciente", "trauma", "vomito_sangre"];
  const moderate = ["vomito", "diarrea", "fiebre", "dolor"];

  const hasSevere = symptoms.some(s => severe.includes(s));
  if (hasSevere) {
    return { priority: "alta", action: "URGENTE: acudir de inmediato o contactar guardia. Evitá esperar. Si podés, avisá por WhatsApp para preparar la atención." };
  }

  const hasModerate = symptoms.some(s => moderate.includes(s));
  if (hasModerate) {
    return { priority: "media", action: "Prioridad media: recomendamos evaluación en el día. Si empeora (respiración, sangrado, desmayo), pasa a urgencia." };
  }

  return { priority: "baja", action: "Prioridad baja: podés agendar turno. Si aparecen signos de urgencia, volvé a evaluar." };
}

export default function UrgenciasPage() {
  const [petName, setPetName] = React.useState("");
  const [species, setSpecies] = React.useState<PetSpecies>("Perro");
  const [ownerName, setOwnerName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [freeText, setFreeText] = React.useState("");
  const [cases, setCases] = React.useState<TriageCase[]>([]);
  const [ready, setReady] = React.useState(false);
  const [created, setCreated] = React.useState<TriageCase | null>(null);

  React.useEffect(() => {
    setCases(loadTriage());
    setReady(true);
  }, []);

  function toggle(id: string) {
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  }

  function canSubmit() {
    return petName.trim() && ownerName.trim() && phone.replace(/\D/g, "").length >= 8 && selected.length > 0;
  }

  function submit() {
    if (!canSubmit()) return;
    const { priority, action } = assess(selected);
    const item: TriageCase = {
      id: uid("tr"),
      createdAt: new Date().toISOString(),
      petName: petName.trim(),
      species,
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      symptoms: selected,
      freeText: freeText.trim() || undefined,
      priority,
      recommendedAction: action
    };
    const next = [item, ...cases];
    setCases(next);
    saveTriage(next);
    setCreated(item);
  }

  function tone(p: TriagePriority) {
    if (p === "alta") return "bad";
    if (p === "media") return "warn";
    return "good";
  }

  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Urgencias"
        title="Evaluación rápida (triage)"
        desc="Contanos síntomas y te mostramos una prioridad estimada para decidir el próximo paso. Esta guía no reemplaza la atención veterinaria profesional."
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex items-center justify-between">
            <div className="grid">
              <div className="text-sm font-extrabold">Formulario de triage</div>
              <div className="text-sm text-black/60">Marcá síntomas y describí si querés</div>
            </div>
            <Badge tone="neutral">2–3 min</Badge>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Mascota">
                <Input value={petName} onChange={e => setPetName(e.target.value)} placeholder="Ej: Minna" />
              </Field>
              <Field label="Especie">
                <Select value={species} onChange={e => setSpecies(e.target.value as PetSpecies)}>
                  <option>Perro</option>
                  <option>Gato</option>
                  <option>Otro</option>
                </Select>
              </Field>
              <Field label="Tu nombre">
                <Input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Ej: Lucía" />
              </Field>
              <Field label="WhatsApp / Teléfono">
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ej: 09 123 456" />
              </Field>
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-extrabold">Síntomas</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {SYMPTOMS.map(s => {
                  const on = selected.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggle(s.id)}
                      className={[
                        "rounded-2xl border p-4 text-left transition",
                        on ? "border-cyanSoft-400/70 bg-cyanSoft-50" : "border-black/10 bg-white hover:bg-black/5"
                      ].join(" ")}
                    >
                      <div className="text-sm font-bold">{s.label}</div>
                      <div className="text-xs text-black/50">{on ? "Seleccionado" : "Tocar para seleccionar"}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Field label="Detalle (opcional)" hint="lo que te preocupe">
              <Textarea value={freeText} onChange={e => setFreeText(e.target.value)} placeholder="Ej: empezó hace 1 hora, no quiere comer..." />
            </Field>

            <div className="flex flex-wrap gap-2">
              <Button onClick={submit} disabled={!canSubmit()} className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">
                Calcular prioridad
              </Button>
              <LeadCTA interest="urgencias" label="Escribir por WhatsApp" variant="outline" />
              <CommercialImplementationCTA />
            </div>
            <div className="text-xs text-black/45">El resultado orienta la decisión inicial y sugiere contacto inmediato cuando corresponde.</div>

            {created ? (
              <Card className="bg-white ring-1 ring-black/5">
                <CardContent className="grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-extrabold">Resultado</div>
                    <Badge tone={tone(created.priority)}>{created.priority.toUpperCase()}</Badge>
                  </div>
                  <p className="text-sm text-black/70">{created.recommendedAction}</p>
                  <div className="text-xs text-black/50">
                    Consejo: ante cualquier empeoramiento, contactanos por WhatsApp para atención prioritaria.
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="text-sm font-extrabold">Casos recientes</div>
            <div className="text-sm text-black/60">Guardados en este dispositivo</div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {!ready ? (
              <div className="grid gap-3">
                <div className="h-16 w-full animate-pulse rounded-2xl bg-black/5" />
                <div className="h-16 w-full animate-pulse rounded-2xl bg-black/5" />
                <div className="h-16 w-full animate-pulse rounded-2xl bg-black/5" />
              </div>
            ) : cases.length === 0 ? (
              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm text-black/60">
                Aún no hay casos recientes en este dispositivo.
              </div>
            ) : (
              cases.slice(0, 6).map(c => (
                <div key={c.id} className="rounded-2xl border border-black/10 bg-white p-4 grid gap-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-extrabold">{c.petName}</div>
                    <Badge tone={tone(c.priority)}>{c.priority}</Badge>
                  </div>
                  <div className="text-xs text-black/55">{c.ownerName} · {c.phone}</div>
                  <div className="text-xs text-black/55">
                    {c.symptoms.slice(0, 2).map(id => SYMPTOMS.find(s => s.id === id)?.label ?? id).join(" · ")}
                    {c.symptoms.length > 2 ? " · ..." : ""}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
