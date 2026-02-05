"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { BRAND, SERVICES } from "@/lib/data";
import type { Appointment, ServiceId } from "@/lib/types";
import { buildDailySlots, getService, makeICS } from "@/lib/schedule";
import { loadAppointments, saveAppointments } from "@/lib/storage";
import { formatDateLong, toWhatsAppLink, uid } from "@/lib/utils";
import { Container, Card, CardContent, CardHeader, Field, Input, Select, Textarea, Button, Badge } from "@/components/ui";
import { SectionHeading } from "@/components/section";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function AgendaPage() {
  const sp = useSearchParams();
  const pre = sp.get("service") as ServiceId | null;

  const [serviceId, setServiceId] = React.useState<ServiceId>(pre ?? "consulta");
  const [dateISO, setDateISO] = React.useState<string>(todayISO());
  const [time, setTime] = React.useState<string>("");
  const [petName, setPetName] = React.useState("");
  const [ownerName, setOwnerName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [appts, setAppts] = React.useState<Appointment[]>([]);
  const [justCreated, setJustCreated] = React.useState<Appointment | null>(null);

  React.useEffect(() => {
    const items = loadAppointments();
    setAppts(items);
  }, []);

  React.useEffect(() => {
    setTime("");
    setJustCreated(null);
  }, [serviceId, dateISO]);

  const slots = React.useMemo(() => buildDailySlots(dateISO, serviceId, appts), [dateISO, serviceId, appts]);
  const svc = React.useMemo(() => getService(serviceId), [serviceId]);

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

  const waText = justCreated
    ? `Hola! Quiero confirmar un turno:\n- Servicio: ${SERVICES.find(s => s.id === justCreated.serviceId)?.name}\n- Fecha: ${justCreated.dateISO}\n- Hora: ${justCreated.time}\n- Mascota: ${justCreated.petName}\n- Titular: ${justCreated.ownerName}`
    : `Hola! Quiero agendar un turno.`;

  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Agenda"
        title="Reservá un turno"
        desc="Elegí servicio y horario disponible. En esta demo, el sistema simula disponibilidad real con duración + buffer."
      />

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
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {slots.map(s => (
                  <button
                    key={s.time}
                    disabled={!s.isAvailable}
                    onClick={() => setTime(s.time)}
                    className={[
                      "h-10 rounded-xl text-sm font-semibold transition border",
                      s.isAvailable ? "border-black/10 bg-white hover:bg-black/5" : "border-black/5 bg-black/5 text-black/30 cursor-not-allowed",
                      time === s.time ? "ring-2 ring-cyanSoft-200 border-cyanSoft-400/60" : ""
                    ].join(" ")}
                    title={s.reason ?? ""}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
              <div className="text-xs text-black/50">
                Tip: los turnos ocupados se bloquean automáticamente por duración + buffer.
              </div>
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
                <Field label="WhatsApp / Teléfono" hint="solo demo">
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ej: 09 123 456" />
                </Field>
                <div />
                <Field label="Notas (opcional)" hint="síntomas, preferencia, etc.">
                  <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ej: viene con tos hace 2 días..." />
                </Field>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={createAppointment} disabled={!canSubmit()} className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">
                  Confirmar (demo)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(toWhatsAppLink(BRAND.whatsapp, waText), "_blank")}
                >
                  Enviar por WhatsApp
                </Button>
                {justCreated ? (
                  <Button variant="ghost" onClick={() => downloadICS(justCreated)}>
                    Añadir al calendario (.ics)
                  </Button>
                ) : null}
              </div>

              {justCreated ? (
                <Card className="bg-emerald-50 ring-emerald-200/60">
                  <CardContent className="grid gap-1">
                    <div className="text-sm font-extrabold">Turno creado (modo demo)</div>
                    <div className="text-sm text-black/70">
                      {SERVICES.find(s => s.id === justCreated.serviceId)?.name} · {justCreated.dateISO} · {justCreated.time}
                    </div>
                    <div className="text-xs text-black/55">
                      En un sitio real: acá se envía confirmación por WhatsApp/SMS + email y se sincroniza con Google Calendar del local.
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="text-sm font-extrabold">Turnos guardados en este navegador</div>
            <div className="text-sm text-black/60">localStorage (demo)</div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {appts.length === 0 ? (
              <div className="text-sm text-black/60">Todavía no hay turnos creados.</div>
            ) : (
              appts
                .slice()
                .sort((a, b) => (a.dateISO + a.time).localeCompare(b.dateISO + b.time))
                .map(a => (
                  <div key={a.id} className="rounded-2xl border border-black/10 bg-white p-4 grid gap-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-extrabold">{a.petName}</div>
                      <Badge tone={a.status === "cancelado" ? "bad" : a.status === "confirmado" ? "good" : "neutral"}>
                        {a.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-black/70">
                      {SERVICES.find(s => s.id === a.serviceId)?.name} · {a.dateISO} · {a.time}
                    </div>
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
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
