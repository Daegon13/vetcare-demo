"use client";

import * as React from "react";
import { BRAND, SERVICES, STAFF } from "@/lib/data";
import type { Appointment, AppointmentStatus, Campaign, PetProfile, TriageCase } from "@/lib/types";
import { getSeedPreview, loadAppointments, loadCampaigns, loadPet, loadTriage, resetDemo, saveAppointments, saveCampaigns, savePet, saveTriage } from "@/lib/storage";
import { cn, uid } from "@/lib/utils";
import { Container, Card, CardContent, CardHeader, Button, Badge, Field, Input, Select, Textarea, LinkButton } from "@/components/ui";
import { SectionHeading } from "@/components/section";
import { CommercialImplementationCTA } from "@/components/commercial-implementation-cta";
import { clearLeads, exportLeadsCSV, exportLeadsJSON, getLeads, type LeadEvent } from "@/lib/leads";
import { trackEvent } from "@/lib/analytics";

type Tab = "turnos" | "triage" | "mascotas" | "campañas" | "leads";

function statTone(n: number) {
  return n === 0 ? "neutral" : "good";
}

function formatDateLabel(dateISO: string, time?: string) {
  const value = new Date(`${dateISO}T${time ?? "00:00"}:00`);
  return value.toLocaleString("es-UY", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: time ? "2-digit" : undefined,
    minute: time ? "2-digit" : undefined
  });
}

function formatDateTimeLabel(value: string) {
  return new Date(value).toLocaleString("es-UY", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function AdminV1Page() {
  const [tab, setTab] = React.useState<Tab>("turnos");

  const seed = React.useMemo(() => getSeedPreview(), []);

  const [appts, setAppts] = React.useState<Appointment[]>(seed.appointments);
  const [triage, setTriage] = React.useState<TriageCase[]>(seed.triage);
  const [pet, setPet] = React.useState<PetProfile | null>(seed.pet);
  const [campaigns, setCampaigns] = React.useState<Campaign[]>(seed.campaigns);
  const [leads, setLeads] = React.useState<LeadEvent[]>(seed.leads);
  const ready = true;

  const [q, setQ] = React.useState("");

  const [cTitle, setCTitle] = React.useState("");
  const [cAudience, setCAudience] = React.useState<Campaign["audience"]>("Clientes");
  const [cChannel, setCChannel] = React.useState<Campaign["channel"]>("WhatsApp");
  const [cMsg, setCMsg] = React.useState("");
  const [cWhen, setCWhen] = React.useState<string>("");

  React.useEffect(() => {
    reloadFromStorage();
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
    const attended = appts.filter(a => a.status === "atendido").length;
    const cancelled = appts.filter(a => a.status === "cancelado").length;
    return { total, pending, confirmed, attended, cancelled };
  }, [appts]);

  const triageStats = React.useMemo(() => {
    const total = triage.length;
    const alta = triage.filter(t => t.priority === "alta").length;
    const media = triage.filter(t => t.priority === "media").length;
    const baja = triage.filter(t => t.priority === "baja").length;
    return { total, alta, media, baja };
  }, [triage]);

  const dashboardSummary = React.useMemo(() => {
    const upcomingAppointments = appts
      .filter(appointment => appointment.status !== "cancelado")
      .slice()
      .sort((a, b) => `${a.dateISO}${a.time}`.localeCompare(`${b.dateISO}${b.time}`));
    const firstDate = upcomingAppointments[0]?.dateISO;
    const nextAppointment = upcomingAppointments[0] ?? null;
    const todayAppointments = firstDate ? upcomingAppointments.filter(appointment => appointment.dateISO === firstDate).length : 0;
    const sentCampaigns = campaigns.filter(campaign => campaign.status === "enviada").length;
    const activeCampaigns = campaigns.filter(campaign => campaign.status !== "borrador").length;
    const leadChannels = new Set(leads.map(lead => lead.channel));

    return {
      nextAppointment,
      todayAppointments,
      sentCampaigns,
      activeCampaigns,
      leadChannels: leadChannels.size
    };
  }, [appts, campaigns, leads]);

  const highlightedCases = React.useMemo(() => {
    const priorityOrder = { alta: 0, media: 1, baja: 2 } as const;
    return triage
      .slice()
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority] || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [triage]);

  const vaccinePreview = React.useMemo(() => {
    return pet?.vaccines
      .slice()
      .sort((a, b) => (a.nextDueISO ?? a.dateISO).localeCompare(b.nextDueISO ?? b.dateISO))
      .slice(0, 2) ?? [];
  }, [pet]);

  function setStatus(id: string, status: AppointmentStatus) {
    persistAppts(appts.map(a => (a.id === id ? { ...a, status } : a)));
  }

  function deleteTriage(id: string) {
    persistTriage(triage.filter(t => t.id !== id));
  }

  function reloadFromStorage() {
    setAppts(loadAppointments());
    setTriage(loadTriage());
    setPet(loadPet());
    setCampaigns(loadCampaigns());
    setLeads(getLeads());
  }

  function demoReset() {
    resetDemo();
    reloadFromStorage();
    setQ("");
    setLeads(getLeads());
    trackEvent("demo_reset", { page: "/adminv1" });
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

  const filteredLeads = leads.filter((lead) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return (
      lead.sourcePage.toLowerCase().includes(s) ||
      (lead.utm?.utm_campaign?.toLowerCase().includes(s) ?? false) ||
      (lead.interest ?? []).join(" ").toLowerCase().includes(s)
    );
  });

  function downloadFile(filename: string, content: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function onExportCSV() {
    const csv = exportLeadsCSV();
    downloadFile("vetcare-leads.csv", csv, "text/csv;charset=utf-8");
    trackEvent("leads_exported", { format: "csv", count: leads.length });
  }

  function onExportJSON() {
    const json = exportLeadsJSON();
    downloadFile("vetcare-leads.json", json, "application/json;charset=utf-8");
    trackEvent("leads_exported", { format: "json", count: leads.length });
  }

  function onClearLeads() {
    clearLeads();
    setLeads(getLeads());
    trackEvent("leads_cleared", { location: "adminv1" });
  }

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
    setCTitle("");
    setCMsg("");
    setCWhen("");
  }

  return (
    <Container className="py-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <SectionHeading
          eyebrow="Panel de gestión"
          title="Panel operativo con información clara desde la primera vista"
          desc="Una vista compacta para revisar agenda activa, casos priorizados, seguimiento de pacientes y campañas sin pantallas vacías al ingresar."
        />
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={demoReset}>Restablecer datos</Button>
          <LinkButton href="/adminv1/marketing" variant="outline">Enlaces de marketing</LinkButton>
          <LinkButton href="/agenda" variant="outline">Ir a Agenda</LinkButton>
          <CommercialImplementationCTA location="adminv1" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden border-cyanSoft-400/40 bg-gradient-to-br from-cyanSoft-50 via-white to-white">
          <CardContent className="grid gap-5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="grid gap-2">
                <Badge tone="good">Operación visible</Badge>
                <h2 className="text-2xl font-black text-graphite-950">{BRAND.name} con agenda, pacientes y seguimiento visibles desde el primer vistazo</h2>
                <p className="max-w-2xl text-sm text-black/70">
                  La vista abre con turnos confirmados, pacientes en seguimiento, urgencias priorizadas y campañas activas para revisar la operación sin pasos extra.
                </p>
              </div>
              <div className="rounded-2xl border border-cyanSoft-400/40 bg-white/90 px-4 py-3 text-sm shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-black/45">Próxima atención</div>
                <div className="mt-1 font-extrabold text-graphite-950">
                  {dashboardSummary.nextAppointment ? `${dashboardSummary.nextAppointment.petName} · ${formatDateLabel(dashboardSummary.nextAppointment.dateISO, dashboardSummary.nextAppointment.time)}` : "Agenda activa"}
                </div>
                <div className="text-black/60">
                  {dashboardSummary.nextAppointment
                    ? SERVICES.find(service => service.id === dashboardSummary.nextAppointment?.serviceId)?.name
                    : "Turnos cargados para hoy y próximos días."}
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-semibold text-black/50">Atención de hoy</div>
                <div className="mt-1 text-2xl font-black">{dashboardSummary.todayAppointments}</div>
                <div className="text-sm text-black/65">turnos activos en la jornada con seguimiento por WhatsApp y mostrador.</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-semibold text-black/50">Triage priorizado</div>
                <div className="mt-1 text-2xl font-black">{triageStats.alta + triageStats.media}</div>
                <div className="text-sm text-black/65">casos que requieren respuesta hoy, con recomendación lista para el equipo.</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-semibold text-black/50">Campañas en movimiento</div>
                <div className="mt-1 text-2xl font-black">{dashboardSummary.activeCampaigns}</div>
                <div className="text-sm text-black/65">acciones comerciales programadas en WhatsApp e Instagram.</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-extrabold">Resumen de operación</div>
            <div className="text-sm text-black/60">Bloques listos para contar la historia del negocio en una reunión comercial.</div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-black/45">Equipo activo</div>
              <div className="mt-1 text-sm font-semibold text-graphite-950">{STAFF[0]?.nombre}</div>
              <div className="text-sm text-black/65">{STAFF[0]?.especialidades.join(" · ")}</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-black/45">Paciente destacado</div>
              <div className="mt-1 text-sm font-semibold text-graphite-950">{pet?.petName} · {pet?.breed ?? pet?.species}</div>
              <div className="text-sm text-black/65">
                {vaccinePreview[0]?.name
                  ? `${vaccinePreview[0].name} próximo refuerzo ${formatDateLabel(vaccinePreview[0].nextDueISO ?? vaccinePreview[0].dateISO)}`
                  : "Calendario preventivo cargado."}
              </div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-black/45">Demanda capturada</div>
              <div className="mt-1 text-sm font-semibold text-graphite-950">{leads.length} leads registrados</div>
              <div className="text-sm text-black/65">{dashboardSummary.leadChannels} canales de origen con trazabilidad básica para seguimiento.</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <Card><CardContent className="grid gap-1">
          <div className="text-xs font-semibold text-black/50">Turnos</div>
          <div className="text-2xl font-black">{ready ? apptStats.total : "…"}</div>
          <div className="flex gap-2 flex-wrap">
            <Badge tone={ready ? statTone(apptStats.pending) : "neutral"}>Pend: {ready ? apptStats.pending : "…"}</Badge>
            <Badge tone={ready ? statTone(apptStats.confirmed) : "neutral"}>Conf: {ready ? apptStats.confirmed : "…"}</Badge>
            <Badge tone={ready ? statTone(apptStats.attended) : "neutral"}>Atend: {ready ? apptStats.attended : "…"}</Badge>
            <Badge tone={ready ? (apptStats.cancelled ? "warn" : "neutral") : "neutral"}>Canc: {ready ? apptStats.cancelled : "…"}</Badge>
          </div>
        </CardContent></Card>

        <Card><CardContent className="grid gap-1">
          <div className="text-xs font-semibold text-black/50">Triage</div>
          <div className="text-2xl font-black">{ready ? triageStats.total : "…"}</div>
          <div className="flex gap-2 flex-wrap">
            <Badge tone={ready ? (triageStats.alta ? "bad" : "neutral") : "neutral"}>Alta: {ready ? triageStats.alta : "…"}</Badge>
            <Badge tone={ready ? (triageStats.media ? "warn" : "neutral") : "neutral"}>Media: {ready ? triageStats.media : "…"}</Badge>
            <Badge tone={ready ? (triageStats.baja ? "good" : "neutral") : "neutral"}>Baja: {ready ? triageStats.baja : "…"}</Badge>
          </div>
        </CardContent></Card>

        <Card><CardContent className="grid gap-1">
          <div className="text-xs font-semibold text-black/50">Mascota destacada</div>
          <div className="text-2xl font-black">{ready ? (pet?.petName ?? "—") : "…"}</div>
          <div className="text-sm text-black/60">{ready ? `${pet?.species ?? ""} · ${pet?.breed ?? "Ficha activa"}` : "Cargando"}</div>
        </CardContent></Card>

        <Card><CardContent className="grid gap-1">
          <div className="text-xs font-semibold text-black/50">Campañas</div>
          <div className="text-2xl font-black">{ready ? campaigns.length : "…"}</div>
          <div className="text-sm text-black/60">{dashboardSummary.sentCampaigns} enviadas · {campaigns.length - dashboardSummary.sentCampaigns} preparadas</div>
        </CardContent></Card>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["turnos", "triage", "mascotas", "campañas", "leads"] as Tab[]).map(t => (
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
              <div className="grid gap-3">
                <div>
                  <div className="text-sm font-extrabold">Turnos</div>
                  <div className="text-sm text-black/60">Agenda activa con contexto clínico y estado de cada turno para revisar la jornada con rapidez.</div>
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                  {filteredAppts.slice(0, 3).map(a => (
                    <div key={a.id} className="rounded-2xl border border-black/10 bg-black/[0.02] px-3 py-2 text-sm">
                      <div className="font-semibold text-graphite-950">{a.petName} · {a.time}</div>
                      <div className="text-black/65">{SERVICES.find(s => s.id === a.serviceId)?.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-xs text-black/50">Local: {BRAND.address}</div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {!ready ? (
                <div className="h-24 w-full animate-pulse rounded-2xl bg-black/5" />
              ) : filteredAppts.length === 0 ? (
                <div className="text-sm text-black/60">No encontramos coincidencias para esa búsqueda dentro de la agenda cargada.</div>
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
              <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr] lg:items-start">
                <div>
                  <div className="text-sm font-extrabold">Triage entrante</div>
                  <div className="text-sm text-black/60">Resumen de ingresos para mostrar priorización clínica y respuesta rápida del equipo.</div>
                </div>
                <div className="grid gap-2">
                  {highlightedCases.map(item => (
                    <div key={item.id} className="rounded-2xl border border-black/10 bg-black/[0.02] p-3 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-graphite-950">{item.petName}</span>
                        <Badge tone={item.priority === "alta" ? "bad" : item.priority === "media" ? "warn" : "good"}>{item.priority}</Badge>
                      </div>
                      <div className="text-black/65">{item.recommendedAction}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {!ready ? (
                <div className="h-24 w-full animate-pulse rounded-2xl bg-black/5" />
              ) : filteredTriage.length === 0 ? (
                <div className="text-sm text-black/60">Todos los casos priorizados ya fueron revisados.</div>
              ) : (
                filteredTriage.map(t => (
                  <div key={t.id} className="rounded-2xl border border-black/10 bg-white p-4 grid gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid">
                        <div className="text-sm font-extrabold">{t.petName} <span className="text-black/40">·</span> {t.ownerName}</div>
                        <div className="text-xs text-black/55">Tel: {t.phone} · {new Date(t.createdAt).toLocaleString("es-UY")}</div>
                        <div className="text-sm text-black/70">{t.recommendedAction}</div>
                      </div>
                      <Badge tone={t.priority === "alta" ? "bad" : t.priority === "media" ? "warn" : "good"}>{t.priority}</Badge>
                    </div>
                    <div className="grid gap-2 rounded-2xl bg-black/[0.02] p-3 text-sm text-black/70">
                      <div><span className="font-semibold text-graphite-950">Motivo:</span> {t.freeText}</div>
                      <div><span className="font-semibold text-graphite-950">Síntomas:</span> {t.symptoms.join(", ")}</div>
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
                <div className="text-sm font-extrabold">Mascota destacada</div>
                <div className="text-sm text-black/60">Ficha cargada con vacunas, datos clínicos y próximos hitos para consultar el estado general en segundos.</div>
              </div>
              <LinkButton href="/mi-mascota" variant="outline">Abrir portal</LinkButton>
            </CardHeader>
            <CardContent className="grid gap-4">
              {!pet || !ready ? <div className="h-24 w-full animate-pulse rounded-2xl bg-black/5" /> : (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Nombre">
                      <Input value={pet.petName} onChange={e => persistPet({ ...pet, petName: e.target.value })} />
                    </Field>
                    <Field label="Especie">
                      <Select value={pet.species} onChange={e => persistPet({ ...pet, species: e.target.value as PetProfile["species"] })}>
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
                  <div className="grid gap-3 lg:grid-cols-2">
                    {vaccinePreview.map(vaccine => (
                      <div key={vaccine.id} className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm">
                        <div className="font-extrabold text-graphite-950">{vaccine.name}</div>
                        <div className="text-black/65">Aplicada: {formatDateLabel(vaccine.dateISO)}</div>
                        <div className="text-black/65">Próximo hito: {formatDateLabel(vaccine.nextDueISO ?? vaccine.dateISO)}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm text-black/70">
                Historial preventivo visible, datos clínicos ordenados y próximos hitos de cuidado para sostener el seguimiento.
              </div>
            </CardContent>
          </Card>
        ) : null}

        {tab === "campañas" ? (
          <div className="grid gap-4 lg:grid-cols-5">
            <Card className="lg:col-span-5">
              <CardHeader>
                <div className="text-sm font-extrabold">Canales de conversión de leads</div>
                <div className="text-sm text-black/60">Eventos de contacto capturados desde agenda y landing para revisar el origen de cada conversación.</div>
              </CardHeader>
              <CardContent className="grid gap-3">
                {!ready ? (
                  <div className="h-20 w-full animate-pulse rounded-2xl bg-black/5" />
                ) : leads.length === 0 ? (
                  <div className="text-sm text-black/60">Todavía no hay eventos guardados en esta vista.</div>
                ) : (
                  leads.map((event) => (
                    <div key={event.id} className="rounded-2xl border border-black/10 bg-white p-3 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold">{event.channel}</div>
                          <div className="text-xs text-black/60">{event.sourcePage} · {event.petName ?? "Lead comercial"}</div>
                        </div>
                        <Badge tone="neutral">{event.utm?.utm_source ?? "directo"}</Badge>
                      </div>
                      <div className="mt-2 text-xs text-black/60">leadId: {event.id.split(":")[0] ?? event.id}</div>
                      <div className="text-xs text-black/55">{formatDateTimeLabel(event.createdAtISO)}</div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="text-sm font-extrabold">Campañas</div>
                <div className="text-sm text-black/60">Campañas listas para ilustrar reactivación de clientes y generación de consultas.</div>
              </CardHeader>
              <CardContent className="grid gap-3">
                {!ready ? (
                  <div className="h-20 w-full animate-pulse rounded-2xl bg-black/5" />
                ) : campaigns.length === 0 ? (
                  <div className="text-sm text-black/60">Ya hay acciones sugeridas para que la historia comercial no arranque en blanco.</div>
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
                <div className="text-sm text-black/60">Carga rápida para preparar la próxima acción comercial sin salir del panel.</div>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Field label="Título">
                  <Input value={cTitle} onChange={e => setCTitle(e.target.value)} placeholder="Ej: Vacunas al día" />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Audiencia">
                    <Select value={cAudience} onChange={e => setCAudience(e.target.value as Campaign["audience"])}>
                      <option>Clientes</option>
                      <option>Prospectos</option>
                    </Select>
                  </Field>
                  <Field label="Canal">
                    <Select value={cChannel} onChange={e => setCChannel(e.target.value as Campaign["channel"])}>
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
                  Ideal para presentar campañas estacionales, reactivación de pacientes y recordatorios preventivos en un mismo flujo.
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {tab === "leads" ? (
          <Card>
            <CardHeader className="flex items-center justify-between gap-3 flex-wrap">
              <div className="grid">
                <div className="text-sm font-extrabold">Leads</div>
                <div className="text-sm text-black/60">Base de contactos lista para seguimiento comercial y atribución básica por origen.</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={onExportCSV}>Export CSV</Button>
                <Button size="sm" variant="outline" onClick={onExportJSON}>Export JSON</Button>
                <Button size="sm" className="bg-rose-50 text-rose-800 hover:bg-rose-100" onClick={onClearLeads}>Limpiar leads</Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 overflow-x-auto">
              {!ready ? (
                <div className="h-24 w-full animate-pulse rounded-2xl bg-black/5" />
              ) : filteredLeads.length === 0 ? (
                <div className="text-sm text-black/60">No hay coincidencias para ese filtro dentro de los leads cargados.</div>
              ) : (
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-black/10 text-xs uppercase text-black/50">
                      <th className="px-2 py-2">Fecha</th>
                      <th className="px-2 py-2">Origen</th>
                      <th className="px-2 py-2">Canal</th>
                      <th className="px-2 py-2">Interés</th>
                      <th className="px-2 py-2">utm_campaign</th>
                      <th className="px-2 py-2">Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-black/5 align-top last:border-0">
                        <td className="px-2 py-2 text-black/70">{new Date(lead.createdAtISO).toLocaleString("es-UY")}</td>
                        <td className="px-2 py-2 text-black/70">{lead.sourcePage}</td>
                        <td className="px-2 py-2">
                          <Badge tone="neutral">{lead.channel}</Badge>
                        </td>
                        <td className="px-2 py-2 text-black/70">{(lead.interest ?? []).join(", ") || "—"}</td>
                        <td className="px-2 py-2 text-black/70">{lead.utm?.utm_campaign ?? "—"}</td>
                        <td className="px-2 py-2 text-black/70">{lead.note ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </Container>
  );
}
