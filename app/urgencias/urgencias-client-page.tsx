"use client";

import * as React from "react";
import type { PetSpecies, TriageCase, TriagePriority } from "@/lib/types";
import { getSeedPreview, loadTriage, saveTriage } from "@/lib/storage";
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

const SEED_CASES = getSeedPreview().triage;

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

function getVisibleCases(items: TriageCase[]) {
  return items.length > 0 ? items : SEED_CASES;
}

export default function UrgenciasPage() {
  const [petName, setPetName] = React.useState("");
  const [species, setSpecies] = React.useState<PetSpecies>("Perro");
  const [ownerName, setOwnerName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [freeText, setFreeText] = React.useState("");
  const [cases, setCases] = React.useState<TriageCase[]>(() => getVisibleCases(SEED_CASES));
  const [created, setCreated] = React.useState<TriageCase | null>(null);

  React.useEffect(() => {
    setCases(getVisibleCases(loadTriage()));
  }, []);

  function when(iso: string) {
    const diffMin = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    if (diffMin < 60) return `Hace ${diffMin} min`;
    const diffH = Math.round(diffMin / 60);
    if (diffH < 24) return `Hace ${diffH} h`;
    return `Hace ${Math.round(diffH / 24)} d`;
  }

  const recentCases = React.useMemo(() => cases.slice(0, 5), [cases]);

  const snapshot = React.useMemo(() => ({
    alta: recentCases.filter(c => c.priority === "alta").length,
    media: recentCases.filter(c => c.priority === "media").length,
    baja: recentCases.filter(c => c.priority === "baja").length
  }), [recentCases]);

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

  function speciesAccent(currentSpecies: PetSpecies) {
    if (currentSpecies === "Gato") return "Paciente felino";
    if (currentSpecies === "Perro") return "Paciente canino";
    return "Paciente en observación";
  }

  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Urgencias"
        title="Evaluación rápida (triage)"
        desc="Indicá síntomas y obtené una prioridad orientativa al instante, con una cola reciente que ayuda a entender cómo se organiza la atención urgente en la clínica."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="grid gap-1 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">Tiempo de respuesta</div>
            <div className="text-2xl font-black">Prioridad en menos de 3 min</div>
            <p className="text-sm text-black/65">El formulario ordena síntomas clave y sugiere el próximo paso para decidir si conviene venir ya, hoy o con turno.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid gap-2 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">Cola visible</div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge tone="bad">Alta: {snapshot.alta}</Badge>
              <Badge tone="warn">Media: {snapshot.media}</Badge>
              <Badge tone="good">Baja: {snapshot.baja}</Badge>
            </div>
            <p className="text-sm text-black/65">Los casos recientes muestran qué se prioriza primero y qué puede resolverse con evaluación en el día.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid gap-1 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">Aclaración clínica</div>
            <div className="text-base font-bold">Orientación inicial, no reemplaza la revisión veterinaria.</div>
            <p className="text-sm text-black/65">Si hay dificultad para respirar, sangrado intenso, convulsiones o pérdida de conocimiento, la indicación es acudir de inmediato.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex items-center justify-between">
            <div className="grid">
              <div className="text-sm font-extrabold">Formulario de triage</div>
              <div className="text-sm text-black/60">Marcá síntomas y agregá contexto para calcular la prioridad.</div>
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

            <Field label="Detalle (opcional)" hint="Sumá contexto útil para la evaluación inicial.">
              <Textarea value={freeText} onChange={e => setFreeText(e.target.value)} placeholder="Ej: empezó hace 1 hora, no quiere comer, está más quieta de lo normal..." />
            </Field>

            <div className="flex flex-wrap gap-2">
              <Button onClick={submit} disabled={!canSubmit()} className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">
                Calcular prioridad
              </Button>
              <LeadCTA interest="urgencias" label="Escribir por WhatsApp" variant="outline" />
              <CommercialImplementationCTA location="urgencias" />
            </div>
            <div className="text-xs text-black/45">La recomendación ayuda a definir el siguiente paso con rapidez y criterio clínico inicial.</div>

            {created ? (
              <Card className="bg-white ring-1 ring-black/5">
                <CardContent className="grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-extrabold">Resultado</div>
                    <Badge tone={tone(created.priority)}>{created.priority.toUpperCase()}</Badge>
                  </div>
                  <p className="text-sm text-black/70">{created.recommendedAction}</p>
                  <div className="text-xs text-black/50">
                    Consejo: ante cualquier empeoramiento, escribinos por WhatsApp para coordinar atención prioritaria.
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold">Casos recientes</div>
                <div className="text-sm text-black/60">Ejemplos recientes con prioridad, contexto clínico breve y acción sugerida.</div>
              </div>
              <Badge tone="neutral">{recentCases.length} visibles</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {recentCases.map(c => (
              <div key={c.id} className="grid gap-2 rounded-2xl border border-black/10 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold">{c.petName}</div>
                    <div className="text-xs text-black/55">{speciesAccent(c.species)} · {c.ownerName} · {when(c.createdAt)}</div>
                  </div>
                  <Badge tone={tone(c.priority)}>{c.priority.toUpperCase()}</Badge>
                </div>
                <div className="text-xs font-medium text-black/55">{c.symptoms.slice(0, 3).map(id => SYMPTOMS.find(s => s.id === id)?.label ?? id).join(" · ")}</div>
                {c.freeText ? <div className="text-sm text-black/70">{c.freeText}</div> : null}
                <div className="rounded-xl bg-black/[0.03] px-3 py-2 text-xs text-black/70">{c.recommendedAction}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
