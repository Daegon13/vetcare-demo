"use client";

import { BRAND } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";

export function FloatingCta() {
  function onWhatsappClick() {
    trackEvent("cta_whatsapp_click", { location: "floating" });
  }

  function onImplementationClick() {
    trackEvent("cta_implementation_click", { location: "floating" });
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col gap-2 sm:bottom-5 sm:right-5">
      <a
        href={BRAND.whatsappUrl}
        target="_blank"
        rel="noreferrer"
        onClick={onWhatsappClick}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-cyanSoft-400 px-4 text-sm font-semibold text-graphite-950 shadow-soft hover:bg-cyanSoft-300"
      >
        Hablar por WhatsApp
      </a>
      <a
        href={BRAND.implementationCtaUrl}
        target="_blank"
        rel="noreferrer"
        onClick={onImplementationClick}
        className="inline-flex h-10 items-center justify-center rounded-xl border border-black/10 bg-white px-4 text-xs font-semibold text-graphite-900 shadow-soft hover:bg-black/5 sm:text-sm"
      >
        {BRAND.implementationCtaLabel}
      </a>
    </div>
  );
}
