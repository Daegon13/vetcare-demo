"use client";

import * as React from "react";
import { BRAND, SERVICES } from "@/lib/data";
import { LeadCTA } from "@/components/LeadCTA";
import { CommercialImplementationCTA } from "@/components/commercial-implementation-cta";
import type { Appointment, ServiceId } from "@/lib/types";
import { buildDailySlots, getService, makeICS } from "@/lib/schedule";
import { loadAppointments, saveAppointments } from "@/lib/storage";
import { formatDateLong, uid } from "@/lib/utils";
import { Container, Card, CardContent, CardHeader, Field, Input, Select, Textarea, Button, Badge } from "@/components/ui";
import { SectionHeading } from "@/components/section";

const todayISO = () => new Date().toISOString().slice(0, 10);

function resolveInitialDate(initialAppointments: Appointment[]) {
  return initialAppointments[0]?.dateISO ?? todayISO();
}

type AgendaClientPageProps = {
  initialAppointments: Appointment[];
  initialServiceId: ServiceId;
  initialDateISO: string;
};

export default function AgendaClientPage({ initialAppointments, initialServiceId, initialDateISO }: AgendaClientPageProps) {
  const bookingRef = React.useRef<HTMLDivElement | null>(null);
  const [serviceId, setServiceId] = React.useState<ServiceId>(initialServiceId);
  const [dateISO, setDateISO] = React.useState<string>(initialDateISO || resolveInitialDate(initialAppointments));
  const [time, setTime] = React.useState<string>("");
  const [petName, setPetName] = React.useState("");
  const [ownerName, setOwnerName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [appts, setAppts] = React.useState<Appointment[]>(initialAppointments);
  const [justCreated, setJustCreated] = React.useState<Appointment | null>(null);

  React.useEffect(() => {
    setAppts(loadAppointments());
  }, []);

  React.useEffect(() => {
    setTime("");
    setJustCreated(null);
  }, [serviceId, dateISO]);

  const slots = React.useMemo(() => buildDailySlots(dateISO, serviceId, appts), [dateISO, serviceId, appts]);
  const quickSlots = React.useMemo(() => slots.filter(s => s.isAvailable).slice(0, 6), [slots]);
  const svc = React.useMemo(() => getService(serviceId), [serviceId]);
  const upcomingVisible = React.useMemo(
    () => appts.slice().sort((a, b) => (a.dateISO + a.time).localeCompare(b.dateISO + b.time)).slice(0, 5),
    [appts]
  );

  function persist(next: Appointment[]) {
    setAppts(next);
    saveAppointments(next);
  }

  function canSubmit() {
    if (!time) return false;
    if (!petName.trim()) return false;
    if (!ownerName.trim()) return false;
    if (phone.replace(/\D/g, "").length < 8) return false;
    return true;
  }

  function createAppointment() {
    if (!canSubmit()) return;

    const item: Appointment = {
      id: uid("ap"),
      createdAt: new Date().toISOString(),
      dateISO,
      time,
      serviceId,
      petName: petName.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      notes: notes.trim() || undefined,
      status: "pendiente"
    };

    persist([item, ...appts].sort((a, b) => (a.dateISO + a.time).localeCompare(b.dateISO + b.time)));
    setJustCreated(item);
  }

  function cancelAppointment(id: string) {
    const next = appts.map(a => (a.id === id ? { ...a, status: "cancelado" as const } : a));
    persist(next);
  }

  function downloadICS(item: Appointment) {
    const itemService = getService(item.serviceId);
    const ics = makeICS({
      title: `Turno VetCare — ${SERVICES.find(s => s.id === item.serviceId)?.name ?? "Servicio"}`,
      dateISO: item.dateISO,
      time: item.time,
      minutes: itemService.durationMin,
      description: `Mascota: ${item.petName}\nTitular: ${item.ownerName}\nTel: ${item.phone}${item.notes ? `\nNotas: ${item.notes}` : ""}`,
      location: BRAND.address
    });
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `turno-${item.dateISO}-${item.time.replace(":", "")}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function jumpToBooking() {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Agenda"
        title="Reservá un turno"
        desc="Disponibilidad confirmada para hoy y próximos días, con agenda activa y próximos turnos visibles desde el primer segundo."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr,1fr]">
        <Card className="overflow-hidden border border-cyanSoft-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(157,240,255,0.28),_transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))]">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <Badge tone="good" className="bg-emerald-100 text-emerald-800">Disponibilidad activa</Badge>
                <div className="mt-3 text-xl font-black tracking-tight text-graphite-950 sm:text-2xl">Primeros espacios listos para confirmar hoy mismo.</div>
                <div className="mt-2 text-sm text-black/65">
                  Elegí un bloque recomendado, mantené el CTA principal visible y avanzá a la reserva sin pantallas vacías ni mensajes técnicos.
                </div>
              </div>
              <div className="grid min-w-[220px] gap-2 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Hoy en agenda</div>
                <div className="flex items-center gap-2 text-sm text-black/70">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  {quickSlots.length} horarios destacados disponibles
                </div>
                <div className="flex items-center gap-2 text-sm text-black/70">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyanSoft-500" />
                  {upcomingVisible.length} próximos turnos visibles
                </div>
                <div className="text-xs text-black/50">{formatDateLong(dateISO)}</div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {upcomingVisible.slice(0, 3).map((a) => (
                <div key={`hero-${a.id}`} className="rounded-2xl border border-black/10 bg-white/85 p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-graphite-950">{a.time}</div>
                      <div className="text-xs text-black/50">{formatDateLong(a.dateISO)}</div>
                    </div>
                    <Badge tone={a.status === "confirmado" ? "good" : a.status === "cancelado" ? "bad" : "neutral"}>{a.status}</Badge>
                  </div>
                  <div className="mt-3 text-sm font-semibold text-graphite-950">{a.petName}</div>
                  <div className="text-sm text-black/65">{SERVICES.find(s => s.id === a.serviceId)?.name}</div>
                  <div className="mt-1 text-xs text-black/50">Titular: {a.ownerName}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-black/5 bg-graphite-950 text-white">
          <CardContent className="p-5 sm:p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Acción rápida</div>
            <div className="mt-3 text-2xl font-black tracking-tight">Reservá o resolvé por WhatsApp en la misma vista.</div>
            <div className="mt-2 text-sm text-white/72">Disponibilidad primero, acción principal siempre a mano y soporte inmediato por chat para resolver más rápido.</div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button onClick={jumpToBooking} className="h-11 px-5 bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">
                Reservar ahora
              </Button>
              <LeadCTA interest="turnos" label="Consultar por WhatsApp" variant="outline" />
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              Confirmación en pocos pasos, con turno visible en agenda y opción de exportar al calendario apenas se reserva.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-extrabold">Disponibilidad inmediata</div>
            <Badge tone="neutral">{formatDateLong(dateISO)}</Badge>
          </div>
          <div className="mt-2 text-xs text-black/55">Seleccioná un bloque sugerido para avanzar más rápido con la reserva.</div>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {quickSlots.length > 0 ? (
              quickSlots.map(s => (
                <button
                  key={s.time}
                  onClick={() => setTime(s.time)}
                  className={[
                    "h-10 rounded-xl border text-sm font-semibold transition",
                    time === s.time
                      ? "border-cyanSoft-400/60 bg-cyanSoft-50 ring-2 ring-cyanSoft-200"
                      : "border-black/10 bg-white hover:bg-black/5"
                  ].join(" ")}
                >
                  {s.time}
                </button>
              ))
            ) : (
              <div className="col-span-full rounded-xl border border-black/10 bg-black/[0.02] p-3 text-sm text-black/60">
                No hay bloques disponibles para este servicio en la fecha seleccionada.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div ref={bookingRef} className="mt-8 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex items-center justify-between">
            <div className="grid">
              <div className="text-sm font-extrabold">Paso 1 — Elegí servicio y fecha</div>
              <div className="text-sm text-black/60">{formatDateLong(dateISO)}</div>
            </div>
            <Badge tone="neutral">{svc.durationMin} min</Badge>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Servicio" hint="Define duración y buffer">
                <Select value={serviceId} onChange={e => setServiceId(e.target.value as ServiceId)}>
                  {SERVICES.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Fecha">
                <Input type="date" value={dateISO} onChange={e => setDateISO(e.target.value)} min={todayISO()} />
              </Field>
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-extrabold">Paso 2 — Seleccioná un horario</div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {slots.map(s => (
                  <button
                    key={s.time}
                    disabled={!s.isAvailable}
                    onClick={() => setTime(s.time)}
                    className={[
                      "h-10 rounded-xl border text-sm font-semibold transition",
                      s.isAvailable
                        ? "border-black/10 bg-white hover:bg-black/5"
                        : "cursor-not-allowed border-black/5 bg-black/5 text-black/30",
                      time === s.time ? "ring-2 ring-cyanSoft-200 border-cyanSoft-400/60" : ""
                    ].join(" ")}
                    title={s.reason ?? ""}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
              <div className="text-xs text-black/50">La disponibilidad se ajusta automáticamente según duración del servicio y agenda activa.</div>
            </div>

            <div className="grid gap-3 pt-2">
              <div className="text-sm font-extrabold">Paso 3 — Datos</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Nombre de la mascota">
                  <Input value={petName} onChange={e => setPetName(e.target.value)} placeholder="Ej: Milo" />
                </Field>
                <Field label="Tu nombre">
                  <Input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Ej: Sofía" />
                </Field>
                <Field label="WhatsApp / Teléfono" hint="te contactaremos por este medio">
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ej: 09 123 456" />
                </Field>
                <div />
                <Field label="Notas (opcional)" hint="síntomas, preferencia, etc.">
                  <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ej: viene con tos hace 2 días..." />
                </Field>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button onClick={createAppointment} disabled={!canSubmit()} className="h-11 px-5 bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">
                  Confirmar turno
                </Button>
                <LeadCTA interest="turnos" label="Consultar por WhatsApp" variant="outline" />
                {justCreated ? (
                  <Button variant="ghost" onClick={() => downloadICS(justCreated)}>
                    Añadir al calendario (.ics)
                  </Button>
                ) : null}
              </div>
              <div className="pt-1">
                <CommercialImplementationCTA location="agenda" />
              </div>

              {justCreated ? (
                <Card className="bg-emerald-50 ring-emerald-200/60">
                  <CardContent className="grid gap-1">
                    <div className="text-sm font-extrabold">Turno reservado</div>
                    <div className="text-sm text-black/70">
                      {SERVICES.find(s => s.id === justCreated.serviceId)?.name} · {justCreated.dateISO} · {justCreated.time}
                    </div>
                    <div className="text-xs text-black/55">Te enviaremos confirmación y recordatorio por tu canal de contacto preferido.</div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="text-sm font-extrabold">Próximos turnos</div>
            <div className="text-sm text-black/60">Vista rápida para tutor y recepción</div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Badge tone="neutral">Agenda visible desde el inicio</Badge>
            {upcomingVisible.map(a => (
              <div key={a.id} className="grid gap-1 rounded-2xl border border-black/10 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-extrabold">{a.petName}</div>
                  <Badge tone={a.status === "cancelado" ? "bad" : a.status === "confirmado" ? "good" : "neutral"}>
                    {a.status}
                  </Badge>
                </div>
                <div className="text-sm text-black/70">{SERVICES.find(s => s.id === a.serviceId)?.name} · {a.dateISO} · {a.time}</div>
                <div className="text-xs text-black/55">Titular: {a.ownerName} · Tel: {a.phone}</div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    className="rounded-xl bg-black/5 px-3 py-2 text-xs font-semibold hover:bg-black/10"
                    onClick={() => downloadICS(a)}
                  >
                    .ics
                  </button>
                  {a.status !== "cancelado" ? (
                    <button
                      className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-100"
                      onClick={() => cancelAppointment(a.id)}
                    >
                      Cancelar
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
