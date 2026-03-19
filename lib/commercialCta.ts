import * as React from "react";

import { BRAND } from "@/lib/data";
import { appendUtmToUrl, getStoredUtm } from "@/lib/utm";

export const COMMERCIAL_IMPLEMENTATION_CTA = {
  label: BRAND.implementationCtaLabel,
  href: BRAND.implementationCtaUrl,
  secondaryWhatsappLabel: BRAND.implementationSecondaryCtaLabel
} as const;

export function resolveCommercialImplementationHref() {
  return appendUtmToUrl(COMMERCIAL_IMPLEMENTATION_CTA.href, getStoredUtm());
}

export function useCommercialImplementationHref() {
  const [href, setHref] = React.useState(COMMERCIAL_IMPLEMENTATION_CTA.href);

  React.useEffect(() => {
    setHref(resolveCommercialImplementationHref());
  }, []);

  return href;
}
