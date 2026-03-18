"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";
import { addLead } from "@/lib/leads";
import { buildWhatsappUrl, getStoredUtm } from "@/lib/utm";
import { COMMERCIAL_IMPLEMENTATION_CTA, useCommercialImplementationHref } from "@/lib/commercialCta";

export function FloatingCta() {
  const pathname = usePathname();
  const [whatsappUrl, setWhatsappUrl] = React.useState(BRAND.whatsappUrl);
  const implementationUrl = useCommercialImplementationHref();

  React.useEffect(() => {
    const utm = getStoredUtm();
    setWhatsappUrl(buildWhatsappUrl(BRAND.whatsappUrl, utm, "Mi interés: implementación."));
  }, []);

  function onWhatsappClick() {
    const utm = getStoredUtm();
    addLead({
      sourcePage: pathname || window.location.pathname,
      channel: "whatsapp_click",
      utm: utm ?? undefined,
      interest: ["implementacion"],
      note: "Floating CTA"
    });
    trackEvent("cta_whatsapp_click", { location: "floating", ...(utm ?? {}) });
    trackEvent("lead_saved", { channel: "whatsapp_click", location: "floating", ...(utm ?? {}) });
  }

  function onImplementationClick() {
    trackEvent("cta_implementation_click", { location: "floating", ...(getStoredUtm() ?? {}) });
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col gap-2 sm:bottom-5 sm:right-5 lg:hidden">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        onClick={onWhatsappClick}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-cyanSoft-400 px-4 text-sm font-semibold text-graphite-950 shadow-soft hover:bg-cyanSoft-300"
      >
        Hablar por WhatsApp
      </a>
      <a
        href={implementationUrl}
        onClick={onImplementationClick}
        className="inline-flex h-10 items-center justify-center rounded-xl border border-black/10 bg-white px-4 text-xs font-semibold text-graphite-900 shadow-soft hover:bg-black/5 dark:border-white/10 dark:bg-graphite-900 dark:text-white dark:hover:bg-white/10 sm:text-sm"
      >
        {COMMERCIAL_IMPLEMENTATION_CTA.label}
      </a>
    </div>
  );
}
