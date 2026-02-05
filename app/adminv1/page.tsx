"use client";

import * as React from "react";
import Link from "next/link";
import { BRAND, DEFAULT_CAMPAIGNS, DEFAULT_PET, SERVICES } from "@/lib/data";
import type { Appointment, AppointmentStatus, Campaign, PetProfile, TriageCase } from "@/lib/types";
import { loadAppointments, loadCampaigns, loadPet, loadTriage, resetDemo, saveAppointments, saveCampaigns, savePet, saveTriage } from "@/lib/storage";
import { cn, uid } from "@/lib/utils";
import { Container, Card, CardContent, CardHeader, Button, Badge, Field, Input, Select, Textarea, LinkButton } from "@/components/ui";
import { SectionHeading } from "@/components/section";

type Tab = "turnos" | "triage" | "mascotas" | "campañas";

function statTone(n: number) {
  return n === 0 ? "neutral" : "good";
}

export default function AdminV1Page() {
  const [tab, setTab] = React.useState<Tab>("turnos");

  const [appts, setAppts] = React.useState<Appointment[]>([]);
  const [triage, setTriage] = React.useState<TriageCase[]>([]);
  const [pet, setPet] = React.useState<PetProfile | null>(null);
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);

  const [q, setQ] = React.useState("");

  // campaign form
  const [cTitle, setCTitle] = React.useState("");
  const [cAudience, setCAudience] = React.useState<Campaign["audience"]>("Clientes");
  const [cChannel, setCChannel] = React.useState<Campaign["channel"]>("WhatsApp");
  const [cMsg, setCMsg] = React.useState("");
  const [cWhen, setCWhen] = React.useState<string>("");

  React.useEffect(() => {
    setAppts(loadAppointments());
    setTriage(loadTriage());
    setPet(loadPet());
    setCampaigns(loadCampaigns());
  }, []);

  function persistAppts(next: Appointment[]) {
    setAppts(next);
    saveAppointments(next);
  }
  function persistTriage(next: TriageCase[]) {
    setTriage(next);
    saveTriage(next);
  }
  function persistPet(next: PetProfile) {
    setPet(next);
    savePet(next);
  }
  function persistCampaigns(next: Campaign[]) {
    setCampaigns(next);
    saveCampaigns(next);
  }

  const apptStats = React.useMemo(() => {
    const total = appts.length;
    const pending = appts.filter(a => a.status === "pendiente").length;
    const confirmed = appts.filter(a => a.status === "confirmado").length;
    const cancelled = appts.filter(a => a.status === "cancelado").length;
    return { total, pending, confirmed, cancelled };
  }, [appts]);

  const triageStats = React.useMemo(() => {
    const total = triage.length;
    const alta = triage.filter(t => t.priority === "alta").length;
    const media = triage.filter(t => t.priority === "media").length;
    const baja = triage.filter(t => t.priority === "baja").length;
    return { total, alta, media, baja };
  }, [triage]);

  function setStatus(id: string, status: AppointmentStatus) {
    persistAppts(appts.map(a => (a.id === id ? { ...a, status } : a)));
  }

  function deleteTriage(id: string) {
    persistTriage(triage.filter(t => t.id !== id));
  }

  function demoReset() {
    resetDemo();
    setAppts([]);
    setTriage([]);
    setPet(DEFAULT_PET);
    setCampaigns(DEFAULT_CAMPAIGNS);
  }

  const filteredAppts = appts
    .slice()
    .sort((a, b) => (a.dateISO + a.time).localeCompare(b.dateISO + b.time))
    .filter(a => {
      if (!q.trim()) return true;
      const s = q.toLowerCase();
      return (
        a.petName.toLowerCase().includes(s) ||
        a.ownerName.toLowerCase().includes(s) ||
        a.phone.toLowerCase().includes(s) ||
        (SERVICES.find(x => x.id === a.serviceId)?.name.toLowerCase().includes(s) ?? false)
      );
    });

  const filteredTriage = triage.filter(t => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return t.petName.toLowerCase().includes(s) || t.ownerName.toLowerCase().includes(s) || t.phone.toLowerCase().includes(s);
  });

  function createCampaign() {
    if (!cTitle.trim() || !cMsg.trim()) return;
    const when = cWhen ? new Date(cWhen).toISOString() : new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
    const item: Campaign = {
      id: uid("c"),
      title: cTitle.trim(),
      audience: cAudience,
      channel: cChannel,
      message: cMsg.trim(),
      scheduledISO: when,
      status: "programada"
    };
    const next = [item, ...campaigns];
    persistCampaigns(next);
    setCTitle(""); setCMsg(""); setCWhen("");
  }

  return (
    <Container className="py-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <SectionHeading
          eyebrow="Admin v1"
          title="Panel de operación (modo demo)"
          desc="Para mostrar “cómo funcionaría”. Estados, triage entrante, perfil de mascota y campañas."
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={demoReset}>Reset demo</Button>
          <LinkButton href="/agenda" variant="outline">Ir a Agenda</LinkButton>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <Card><CardContent className="grid gap-1">
          <div className="text-xs font-semibold text-black/50">Turnos</div>
          <div className="text-2xl font-black">{apptStats.total}</div>
          <div className="flex gap-2 flex-wrap">
            <Badge tone={statTone(apptStats.pending)}>Pend: {apptStats.pending}</Badge>
            <Badge tone={statTone(apptStats.confirmed)}>Conf: {apptStats.confirmed}</Badge>
            <Badge tone={apptStats.cancelled ? "warn" : "neutral"}>Canc: {apptStats.cancelled}</Badge>
          </div>
        </CardContent></Card>

        <Card><CardContent className="grid gap-1">
          <div className="text-xs font-semibold text-black/50">Triage</div>
          <div className="text-2xl font-black">{triageStats.total}</div>
          <div className="flex gap-2 flex-wrap">
            <Badge tone={triageStats.alta ? "bad" : "neutral"}>Alta: {triageStats.alta}</Badge>
            <Badge tone={triageStats.media ? "warn" : "neutral"}>Media: {triageStats.media}</Badge>
            <Badge tone={triageStats.baja ? "good" : "neutral"}>Baja: {triageStats.baja}</Badge>
          </div>
        </CardContent></Card>

        <Card><CardContent className="grid gap-1">
          <div className="text-xs font-semibold text-black/50">Mascota demo</div>
          <div className="text-2xl font-black">{pet?.petName ?? "—"}</div>
          <div className="text-sm text-black/60">{pet?.species ?? ""}</div>
        </CardContent></Card>

        <Card><CardContent className="grid gap-1">
          <div className="text-xs font-semibold text-black/50">Campañas</div>
          <div className="text-2xl font-black">{campaigns.length}</div>
          <div className="text-sm text-black/60">WhatsApp · IG · Email</div>
        </CardContent></Card>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["turnos", "triage", "mascotas", "campañas"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn("rounded-xl px-3 py-2 text-sm font-semibold border",
                tab === t ? "bg-cyanSoft-50 border-cyanSoft-400/60" : "bg-white border-black/10 hover:bg-black/5")}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-80">
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre/teléfono/servicio…" />
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        {tab === "turnos" ? (
          <Card>
            <CardHeader className="flex items-center justify-between gap-4 flex-wrap">
              <div className="grid">
                <div className="text-sm font-extrabold">Turnos</div>
                <div className="text-sm text-black/60">Cambiar estado: pendiente → confirmado → atendido</div>
              </div>
              <div className="text-xs text-black/50">Local: {BRAND.address}</div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {filteredAppts.length === 0 ? (
                <div className="text-sm text-black/60">No hay turnos que coincidan.</div>
              ) : (
                filteredAppts.map(a => (
                  <div key={a.id} className="rounded-2xl border border-black/10 bg-white p-4 grid gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid">
                        <div className="text-sm font-extrabold">{a.petName} <span className="text-black/40">·</span> {a.ownerName}</div>
                        <div className="text-sm text-black/70">
                          {SERVICES.find(s => s.id === a.serviceId)?.name} · {a.dateISO} · {a.time}
                        </div>
                        <div className="text-xs text-black/55">Tel: {a.phone}{a.notes ? ` · Notas: ${a.notes}` : ""}</div>
                      </div>
                      <Badge tone={a.status === "cancelado" ? "bad" : a.status === "confirmado" ? "good" : a.status === "atendido" ? "neutral" : "warn"}>
                        {a.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => setStatus(a.id, "confirmado")} disabled={a.status === "cancelado"}>Confirmar</Button>
                      <Button size="sm" variant="outline" onClick={() => setStatus(a.id, "atendido")} disabled={a.status === "cancelado"}>Atendido</Button>
                      <Button size="sm" className="bg-rose-50 text-rose-800 hover:bg-rose-100" onClick={() => setStatus(a.id, "cancelado")} disabled={a.status === "cancelado"}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ) : null}

        {tab === "triage" ? (
          <Card>
            <CardHeader>
              <div className="text-sm font-extrabold">Triage entrante</div>
              <div className="text-sm text-black/60">Borrar caso simula “atendido” (demo).</div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {filteredTriage.length === 0 ? (
                <div className="text-sm text-black/60">No hay casos.</div>
              ) : (
                filteredTriage.map(t => (
                  <div key={t.id} className="rounded-2xl border border-black/10 bg-white p-4 grid gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid">
                        <div className="text-sm font-extrabold">{t.petName} <span className="text-black/40">·</span> {t.ownerName}</div>
                        <div className="text-xs text-black/55">Tel: {t.phone} · {new Date(t.createdAt).toLocaleString("es-UY")}</div>
                        <div className="text-sm text-black/70">{t.recommendedAction}</div>
                      </div>
                      <Badge tone={t.priority === "alta" ? "bad" : t.priority === "media" ? "warn" : "good"}>{t.priority}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <LinkButton
                        href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Triage: ${t.petName} (${t.priority}). Titular: ${t.ownerName}. Tel: ${t.phone}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        variant="outline"
                      >
                        WhatsApp
                      </LinkButton>
                      <Button size="sm" variant="outline" onClick={() => deleteTriage(t.id)}>Marcar atendido</Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ) : null}

        {tab === "mascotas" ? (
          <Card>
            <CardHeader className="flex items-center justify-between gap-3 flex-wrap">
              <div className="grid">
                <div className="text-sm font-extrabold">Mascota demo</div>
                <div className="text-sm text-black/60">Edición rápida para que el lead vea “perfil”.</div>
              </div>
              <LinkButton href="/mi-mascota" variant="outline">Abrir portal</LinkButton>
            </CardHeader>
            <CardContent className="grid gap-4">
              {!pet ? <div className="text-sm text-black/60">Cargando…</div> : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Nombre">
                    <Input value={pet.petName} onChange={e => persistPet({ ...pet, petName: e.target.value })} />
                  </Field>
                  <Field label="Especie">
                    <Select value={pet.species} onChange={e => persistPet({ ...pet, species: e.target.value as any })}>
                      <option>Perro</option><option>Gato</option><option>Otro</option>
                    </Select>
                  </Field>
                  <Field label="Raza">
                    <Input value={pet.breed ?? ""} onChange={e => persistPet({ ...pet, breed: e.target.value })} />
                  </Field>
                  <Field label="Peso kg">
                    <Input type="number" step="0.1" value={pet.weightKg ?? ""} onChange={e => persistPet({ ...pet, weightKg: e.target.value ? Number(e.target.value) : undefined })} />
                  </Field>
                  <Field label="Alergias">
                    <Textarea value={pet.allergies ?? ""} onChange={e => persistPet({ ...pet, allergies: e.target.value })} />
                  </Field>
                </div>
              )}

              <div className="text-xs text-black/50">
                En una versión real: múltiples mascotas por usuario, adjuntos, recordatorios automáticos y compra de planes.
              </div>
            </CardContent>
          </Card>
        ) : null}

        {tab === "campañas" ? (
          <div className="grid gap-4 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="text-sm font-extrabold">Campañas</div>
                <div className="text-sm text-black/60">Simulación de marketing: programar, copiar y “enviar”.</div>
              </CardHeader>
              <CardContent className="grid gap-3">
                {campaigns.length === 0 ? (
                  <div className="text-sm text-black/60">No hay campañas.</div>
                ) : (
                  campaigns.map(c => (
                    <div key={c.id} className="rounded-2xl border border-black/10 bg-white p-4 grid gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="grid">
                          <div className="text-sm font-extrabold">{c.title}</div>
                          <div className="text-xs text-black/55">
                            {c.audience} · {c.channel} · {new Date(c.scheduledISO).toLocaleString("es-UY")}
                          </div>
                        </div>
                        <Badge tone={c.status === "enviada" ? "good" : c.status === "programada" ? "warn" : "neutral"}>{c.status}</Badge>
                      </div>
                      <p className="text-sm text-black/70 whitespace-pre-line">{c.message}</p>

                      <div className="flex flex-wrap gap-2">
                        {c.channel === "WhatsApp" ? (
                          <LinkButton
                            href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(c.message)}`}
                            target="_blank"
                            rel="noreferrer"
                            variant="outline"
                          >
                            Abrir WhatsApp
                          </LinkButton>
                        ) : null}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => persistCampaigns(campaigns.map(x => (x.id === c.id ? { ...x, status: "enviada" } : x)))}
                        >
                          Marcar enviada
                        </Button>
                        <Button
                          size="sm"
                          className="bg-rose-50 text-rose-800 hover:bg-rose-100"
                          onClick={() => persistCampaigns(campaigns.filter(x => x.id !== c.id))}
                        >
                          Borrar
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="text-sm font-extrabold">Nueva campaña</div>
                <div className="text-sm text-black/60">Guardado local (demo)</div>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Field label="Título">
                  <Input value={cTitle} onChange={e => setCTitle(e.target.value)} placeholder="Ej: Vacunas al día" />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Audiencia">
                    <Select value={cAudience} onChange={e => setCAudience(e.target.value as any)}>
                      <option>Clientes</option>
                      <option>Prospectos</option>
                    </Select>
                  </Field>
                  <Field label="Canal">
                    <Select value={cChannel} onChange={e => setCChannel(e.target.value as any)}>
                      <option>WhatsApp</option>
                      <option>Instagram</option>
                      <option>Email</option>
                    </Select>
                  </Field>
                </div>
                <Field label="Mensaje">
                  <Textarea value={cMsg} onChange={e => setCMsg(e.target.value)} placeholder="Texto de campaña…" />
                </Field>
                <Field label="Fecha/hora (opcional)" hint="si no, mañana">
                  <Input type="datetime-local" value={cWhen} onChange={e => setCWhen(e.target.value)} />
                </Field>
                <Button onClick={createCampaign} className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">
                  Crear campaña
                </Button>
                <div className="text-xs text-black/50">
                  En producción: se integra con WhatsApp Business API, email provider y seguimiento de conversiones.
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>

      <div className="mt-10 text-xs text-black/50">
        Nota: Este panel es demostrativo. En producción: login, roles, auditoría, backups, métricas y calendario real.
      </div>
    </Container>
  );
}
