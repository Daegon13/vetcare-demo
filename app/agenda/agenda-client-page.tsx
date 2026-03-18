"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { BRAND, SERVICES } from "@/lib/data";
import { LeadCTA } from "@/components/LeadCTA";
import { CommercialImplementationCTA } from "@/components/commercial-implementation-cta";
import type { Appointment, ServiceId } from "@/lib/types";
import { buildDailySlots, getService, makeICS } from "@/lib/schedule";
import { getSeedPreview, loadAppointments, saveAppointments } from "@/lib/storage";
import { formatDateLong, uid } from "@/lib/utils";
import { Container, Card, CardContent, CardHeader, Field, Input, Select, Textarea, Button, Badge } from "@/components/ui";
import { SectionHeading } from "@/components/section";

const todayISO = () => new Date().toISOString().slice(0, 10);

function buildDemoUpcomingAppointments(): Appointment[] {
  const day = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  };

  return [
    {
      id: "demo_ap_1",
      createdAt: new Date().toISOString(),
      dateISO: day(0),
      time: "11:00",
      serviceId: "consulta",
      petName: "Mora",
      ownerName: "Paula Díaz",
      phone: "09 222 113",
      status: "confirmado"
    },
    {
      id: "demo_ap_2",
      createdAt: new Date().toISOString(),
      dateISO: day(0),
      time: "16:30",
      serviceId: "vacunacion",
      petName: "Simón",
      ownerName: "Agustín Pérez",
      phone: "09 714 540",
      status: "pendiente"
    },
    {
      id: "demo_ap_3",
      createdAt: new Date().toISOString(),
      dateISO: day(1),
      time: "10:30",
      serviceId: "control",
      petName: "Kira",
      ownerName: "Natalia Silva",
      phone: "09 665 390",
      status: "pendiente"
    }
  ];
}

export default function AgendaPage() {
  return (
    <React.Suspense fallback={<AgendaPageSkeleton />}>
      <AgendaPageInner />
    </React.Suspense>
  );
}

function AgendaPageInner() {
  const sp = useSearchParams();
  const pre = sp.get("service") as ServiceId | null;

  const [serviceId, setServiceId] = React.useState<ServiceId>(pre ?? "consulta");
  const [dateISO, setDateISO] = React.useState<string>(todayISO());
  const [time, setTime] = React.useState<string>("");
  const [petName, setPetName] = React.useState("");
  const [ownerName, setOwnerName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [appts, setAppts] = React.useState<Appointment[]>(() => getSeedPreview().appointments);
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
  const upcomingReal = React.useMemo(
    () => appts.slice().sort((a, b) => (a.dateISO + a.time).localeCompare(b.dateISO + b.time)),
    [appts]
  );
  const upcomingDemo = React.useMemo(() => buildDemoUpcomingAppointments(), []);
  const showingDemo = upcomingReal.length === 0;
  const upcomingVisible = showingDemo ? upcomingDemo : upcomingReal;

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
    const ics = makeICS({
      title: `Turno VetCare — ${SERVICES.find(s => s.id === item.serviceId)?.name ?? "Servicio"}`,
      dateISO: item.dateISO,
      time: item.time,
      minutes: svc.durationMin,
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

  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Agenda"
        title="Reservá un turno"
        desc="Disponibilidad confirmada para hoy y próximos días, con agenda activa y próximos turnos visibles desde el primer segundo."
      />

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

      <div className="mt-8 grid gap-4 lg:grid-cols-5">
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
            {showingDemo ? <Badge tone="neutral">Agenda de ejemplo cargada</Badge> : null}
            {upcomingVisible.map(a => (
              <div key={a.id} className="grid gap-1 rounded-2xl border border-black/10 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-extrabold">{a.petName}</div>
                  {!showingDemo ? (
                    <Badge tone={a.status === "cancelado" ? "bad" : a.status === "confirmado" ? "good" : "neutral"}>
                      {a.status}
                    </Badge>
                  ) : null}
                </div>
                <div className="text-sm text-black/70">{SERVICES.find(s => s.id === a.serviceId)?.name} · {a.dateISO} · {a.time}</div>
                <div className="text-xs text-black/55">Titular: {a.ownerName} · Tel: {a.phone}</div>

                {!showingDemo ? (
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
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

function AgendaPageSkeleton() {
  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Agenda"
        title="Reservá un turno"
        desc="Agenda profesional con disponibilidad activa, bloques sugeridos y seguimiento de turnos desde la primera carga."
      />
      <div className="mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="h-5 w-52 animate-pulse rounded bg-black/10" />
            <div className="mt-2 text-xs text-black/55">Seleccioná un bloque sugerido para avanzar más rápido con la reserva.</div>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-xl bg-black/5" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <div className="grid gap-3">
              <div className="h-5 w-56 animate-pulse rounded bg-black/10" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-black/5" />
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded-xl bg-black/5" />
                ))}
              </div>
              <div className="h-28 w-full animate-pulse rounded-2xl bg-black/5" />
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="grid gap-3">
              <div className="h-5 w-44 animate-pulse rounded bg-black/10" />
              <div className="h-20 w-full animate-pulse rounded-2xl bg-black/5" />
              <div className="h-20 w-full animate-pulse rounded-2xl bg-black/5" />
              <div className="h-20 w-full animate-pulse rounded-2xl bg-black/5" />
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
