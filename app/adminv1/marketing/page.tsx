"use client";

import * as React from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { Button, Card, CardContent, CardHeader, Container, Field, Input } from "@/components/ui";
import { SectionHeading } from "@/components/section";
import { CommercialImplementationCTA } from "@/components/commercial-implementation-cta";
import { getDemoToolsState } from "@/lib/demoMode";
import { getBrowserOrigin, isLocalOrigin, resolvePublicSiteUrl } from "@/lib/siteUrl";

type Destination = {
  label: string;
  path: string;
};

type MarketingFields = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  ref: string;
};

const DESTINATIONS: Destination[] = [
  { label: "Home", path: "/" },
  { label: "Servicios", path: "/servicios" },
  { label: "Agenda", path: "/agenda" },
  { label: "Urgencias", path: "/urgencias" },
  { label: "LP", path: "/lp" }
];

const CHANNEL_PRESETS = [
  { label: "IG Reels", utm_source: "instagram", utm_medium: "reels" },
  { label: "IG Stories", utm_source: "instagram", utm_medium: "stories" },
  { label: "TikTok", utm_source: "tiktok", utm_medium: "social_video" },
  { label: "WhatsApp", utm_source: "whatsapp", utm_medium: "chat" }
];
const CAMPAIGN_PRESETS = ["demo_guiada", "vetcare_lanzamiento", "promo_control"];

const DEFAULT_FIELDS: MarketingFields = {
  utm_source: "",
  utm_medium: "social",
  utm_campaign: "",
  utm_content: "",
  utm_term: "",
  ref: ""
};

export default function AdminV1MarketingPage() {
  const [destination, setDestination] = React.useState<Destination>(DESTINATIONS[0]);
  const [fields, setFields] = React.useState<MarketingFields>(DEFAULT_FIELDS);
  const [includeDemo, setIncludeDemo] = React.useState(() => getDemoToolsState().enabled);
  const [copyFeedback, setCopyFeedback] = React.useState<"idle" | "copied" | "error">("idle");
  const [baseUrl, setBaseUrl] = React.useState(() => resolvePublicSiteUrl());

  React.useEffect(() => {
    setBaseUrl(resolvePublicSiteUrl());
    setIncludeDemo(getDemoToolsState(new URLSearchParams(window.location.search)).enabled);
  }, []);

  const generatedLink = React.useMemo(() => {
    if (!baseUrl) return "";

    const url = new URL(destination.path, baseUrl);
    const entries = Object.entries(fields) as Array<[keyof MarketingFields, string]>;

    for (const [key, value] of entries) {
      const trimmed = value.trim();
      if (trimmed) {
        url.searchParams.set(key, trimmed);
      }
    }

    if (includeDemo) {
      url.searchParams.set("demo", "1");
    }

    return url.toString();
  }, [baseUrl, destination.path, fields, includeDemo]);

  async function copyLink() {
    if (!generatedLink) {
      setCopyFeedback("error");
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopyFeedback("copied");
      trackEvent("marketing_link_copied", {
        destination: destination.path,
        utm_campaign: fields.utm_campaign || "",
        utm_source: fields.utm_source || ""
      });
    } catch {
      setCopyFeedback("error");
    }
  }

  function updateField(key: keyof MarketingFields, value: string) {
    setFields(prev => ({ ...prev, [key]: value }));
    setCopyFeedback("idle");
  }

  const resolvedOrigin = baseUrl ?? getBrowserOrigin();
  const previewContext = resolvedOrigin
    ? isLocalOrigin(resolvedOrigin)
      ? "Entorno local: usamos el origin actual para evitar previews falsos y mantener links copiables."
      : "Producción: usamos la URL pública real para que el preview coincida con lo que ve el usuario final."
    : "Resolviendo la URL pública del entorno…";

  return (
    <Container className="py-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <SectionHeading
          eyebrow="Panel de gestión"
          title="Generador de enlaces para campañas"
          desc="Generá enlaces listos para compartir con UTM y una vista previa confiable antes de publicarlos."
        />
        <div className="flex flex-wrap gap-2">
          <Link href="/adminv1" className="inline-flex h-11 items-center rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold hover:bg-black/5">
            Volver al admin
          </Link>
          <CommercialImplementationCTA location="adminv1_marketing" />
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="text-sm font-extrabold">Destino del enlace</div>
          <div className="text-sm text-black/60">Elegí la ruta base y completá parámetros UTM opcionales. Tomamos como base la URL pública configurada y, en local, usamos el origen actual para mantener el preview confiable.</div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {DESTINATIONS.map((item) => (
              <Button
                key={item.path}
                variant={destination.path === item.path ? "primary" : "outline"}
                onClick={() => setDestination(item)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="utm_source">
              <Input value={fields.utm_source} onChange={(e) => updateField("utm_source", e.target.value)} placeholder="instagram" />
            </Field>
            <Field label="utm_medium">
              <Input value={fields.utm_medium} onChange={(e) => updateField("utm_medium", e.target.value)} placeholder="social" />
            </Field>
            <Field label="utm_campaign">
              <Input value={fields.utm_campaign} onChange={(e) => updateField("utm_campaign", e.target.value)} placeholder="promo_control" />
            </Field>
            <Field label="utm_content">
              <Input value={fields.utm_content} onChange={(e) => updateField("utm_content", e.target.value)} />
            </Field>
            <Field label="utm_term">
              <Input value={fields.utm_term} onChange={(e) => updateField("utm_term", e.target.value)} />
            </Field>
            <Field label="ref">
              <Input value={fields.ref} onChange={(e) => updateField("ref", e.target.value)} />
            </Field>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="grid gap-2">
              <div className="text-sm font-semibold">Canales sugeridos</div>
              <div className="flex flex-wrap gap-2">
                {CHANNEL_PRESETS.map((preset) => (
                  <Button
                    key={preset.label}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setFields((prev) => ({
                        ...prev,
                        utm_source: preset.utm_source,
                        utm_medium: preset.utm_medium
                      }));
                      setCopyFeedback("idle");
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-semibold">Campañas sugeridas</div>
              <div className="flex flex-wrap gap-2">
                {CAMPAIGN_PRESETS.map((campaign) => (
                  <Button key={campaign} size="sm" variant="outline" onClick={() => updateField("utm_campaign", campaign)}>
                    {campaign}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-black/20"
              checked={includeDemo}
              onChange={(e) => {
                setIncludeDemo(e.target.checked);
                setCopyFeedback("idle");
              }}
            />
            Incluir recorrido guiado {includeDemo ? "(activo en esta vista)" : ""}
          </label>

          <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4">
            <div className="text-xs font-semibold uppercase text-black/50">Vista previa</div>
            <p className="mt-2 break-all font-mono text-sm">{generatedLink || "Resolviendo URL pública…"}</p>
            <p className="mt-2 text-xs text-black/60">{previewContext}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={copyLink} className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">Copiar enlace</Button>
            {copyFeedback === "copied" ? <span className="text-sm text-emerald-700">Link copiado ✅</span> : null}
            {copyFeedback === "error" ? <span className="text-sm text-rose-700">No se pudo copiar. Podés hacerlo desde la vista previa.</span> : null}
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
