import { BRAND } from "@/lib/data";
import { appendUtmToUrl, getStoredUtm } from "@/lib/utm";

export const COMMERCIAL_IMPLEMENTATION_CTA = {
  label: BRAND.implementationCtaLabel,
  href: BRAND.implementationCtaUrl,
  secondaryWhatsappLabel: "Hablar por WhatsApp"
} as const;

export function getCommercialImplementationHref() {
  return COMMERCIAL_IMPLEMENTATION_CTA.href;
}

export function getCommercialImplementationLabel() {
  return COMMERCIAL_IMPLEMENTATION_CTA.label;
}

export function getCommercialImplementationHrefWithUtm() {
  return appendUtmToUrl(COMMERCIAL_IMPLEMENTATION_CTA.href, getStoredUtm());
}
