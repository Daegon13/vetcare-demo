"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { Button, Field, Input, Textarea } from "@/components/ui";
import { COMMERCIAL_IMPLEMENTATION_CTA } from "@/lib/commercialCta";
import { trackEvent } from "@/lib/analytics";
import { BRAND } from "@/lib/data";
import { addLead } from "@/lib/leads";
import { buildWhatsappUrl, getStoredUtm } from "@/lib/utm";

type ContactFormState = {
  nombre: string;
  veterinaria: string;
  ciudad: string;
  contacto: string;
  necesidad: string;
};

const INITIAL_STATE: ContactFormState = {
  nombre: "",
  veterinaria: "",
  ciudad: "",
  contacto: "",
  necesidad: ""
};

export function ContactoForm() {
  const pathname = usePathname();
  const [submitted, setSubmitted] = React.useState(false);
  const [form, setForm] = React.useState<ContactFormState>(INITIAL_STATE);

  const whatsappUrl = React.useMemo(() => {
    const utm = getStoredUtm();
    const chunks = [
      "Solicitud de implementación VetCare:",
      `- Nombre: ${form.nombre || "(sin completar)"}`,
      `- Veterinaria: ${form.veterinaria || "(sin completar)"}`,
      `- Ciudad: ${form.ciudad || "(sin completar)"}`,
      `- Contacto: ${form.contacto || "(sin completar)"}`,
      `- Necesidad: ${form.necesidad || "(sin completar)"}`
    ];

    return buildWhatsappUrl(BRAND.whatsappUrl, utm, chunks.join("\n"));
  }, [form]);

  function updateField<K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const utm = getStoredUtm();
    addLead({
      sourcePage: pathname || "/contacto",
      channel: "implementation_form",
      utm: utm ?? undefined,
      interest: ["implementacion"],
      note: `Nombre: ${form.nombre} | Veterinaria: ${form.veterinaria} | Ciudad: ${form.ciudad} | Contacto: ${form.contacto} | Necesidad: ${form.necesidad}`
    });

    trackEvent("implementation_form_submitted", {
      location: pathname || "/contacto",
      has_whatsapp: Number(form.contacto.includes("+") || /\d{6,}/.test(form.contacto))
    });

    setSubmitted(true);
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre y apellido">
          <Input required name="nombre" value={form.nombre} onChange={(event) => updateField("nombre", event.target.value)} placeholder="Tu nombre" />
        </Field>
        <Field label="Veterinaria">
          <Input required name="veterinaria" value={form.veterinaria} onChange={(event) => updateField("veterinaria", event.target.value)} placeholder="Nombre de la veterinaria" />
        </Field>
        <Field label="Ciudad">
          <Input required name="ciudad" value={form.ciudad} onChange={(event) => updateField("ciudad", event.target.value)} placeholder="Ciudad" />
        </Field>
        <Field label="WhatsApp o email">
          <Input required name="contacto" value={form.contacto} onChange={(event) => updateField("contacto", event.target.value)} placeholder="+598... o correo@dominio.com" />
        </Field>
      </div>

      <Field label="¿Qué necesitás resolver primero?">
        <Textarea
          required
          name="necesidad"
          value={form.necesidad}
          onChange={(event) => updateField("necesidad", event.target.value)}
          placeholder="Ej: reducir ausencias, ordenar urgencias, mejorar seguimiento comercial..."
          rows={5}
        />
      </Field>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">
          Enviar interés
        </Button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-graphite-900 hover:bg-black/5 dark:border-white/15 dark:bg-graphite-900 dark:text-white dark:hover:bg-white/10"
        >
          {COMMERCIAL_IMPLEMENTATION_CTA.secondaryWhatsappLabel}
        </a>
      </div>

      {submitted ? (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ¡Gracias! Recibimos tu interés y ya podés continuar por WhatsApp con tu información precargada.
        </div>
      ) : null}
    </form>
  );
}
