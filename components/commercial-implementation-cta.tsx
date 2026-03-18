"use client";

import { trackEvent } from "@/lib/analytics";
import { getStoredUtm } from "@/lib/utm";
import { COMMERCIAL_IMPLEMENTATION_CTA, useCommercialImplementationHref } from "@/lib/commercialCta";
import { LinkButton } from "@/components/ui";

type CommercialImplementationCTAProps = {
  className?: string;
  variant?: "primary" | "outline" | "ghost";
  location?: string;
};

export function CommercialImplementationCTA({ className, variant = "outline", location }: CommercialImplementationCTAProps) {
  const href = useCommercialImplementationHref();

  function onClick() {
    trackEvent("cta_implementation_click", {
      location: location ?? "unknown",
      ...(getStoredUtm() ?? {})
    });
  }

  return (
    <LinkButton href={href} variant={variant} className={className} onClick={onClick}>
      {COMMERCIAL_IMPLEMENTATION_CTA.label}
    </LinkButton>
  );
}
