"use client";

import * as React from "react";

import { Button, Field, Input, Textarea } from "@/components/ui";
import { BRAND } from "@/lib/data";
import { buildWhatsappUrl, getStoredUtm } from "@/lib/utm";

export function ContactoDemoForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const [whatsappUrl, setWhatsappUrl] = React.useState(BRAND.whatsappUrl);

  React.useEffect(() => {
    const utm = getStoredUtm();
    setWhatsappUrl(buildWhatsappUrl(BRAND.whatsappUrl, utm, "Mi interés: implementación para mi veterinaria."));
  }, []);

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre y apellido">
          <Input required name="nombre" placeholder="Tu nombre" />
        </Field>
        <Field label="Veterinaria">
          <Input required name="veterinaria" placeholder="Nombre de la veterinaria" />
        </Field>
        <Field label="Ciudad">
          <Input required name="ciudad" placeholder="Ciudad" />
        </Field>
        <Field label="WhatsApp o email">
          <Input required name="contacto" placeholder="+598... o correo@dominio.com" />
        </Field>
      </div>

      <Field label="¿Qué necesitás resolver primero?">
        <Textarea
          required
          name="necesidad"
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
          Hablar por WhatsApp
        </a>
      </div>

      {submitted ? (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ¡Gracias! En esta demo registramos tu interés localmente y el próximo paso recomendado es abrir WhatsApp para coordinar la implementación.
        </div>
      ) : null}
    </form>
  );
}
