"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { trackEvent } from "@/lib/analytics";
import { BRAND } from "@/lib/data";
import { buildLeadWhatsappUrl, buildWhatsappUrl, getStoredUtm, type LeadPayload } from "@/lib/utm";
import { LinkButton } from "@/components/ui";

type LeadInterest = "turnos" | "urgencias" | "servicios" | "general";

const INTEREST_MESSAGE: Record<LeadInterest, string> = {
  turnos: "Mi interés: turnos.",
  urgencias: "Mi interés: urgencias.",
  servicios: "Mi interés: servicios.",
  general: "Mi interés: información general."
};

type LeadCTAProps = {
  interest: LeadInterest;
  label: string;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  leadPayload?: LeadPayload;
};

export function LeadCTA({ interest, label, variant = "primary", className, onClick, leadPayload }: LeadCTAProps) {
  const pathname = usePathname();
  const [href, setHref] = React.useState(BRAND.whatsappUrl);

  React.useEffect(() => {
    const utm = getStoredUtm();

    if (leadPayload) {
      setHref(buildLeadWhatsappUrl(BRAND.whatsappUrl, utm, leadPayload));
      return;
    }

    setHref(buildWhatsappUrl(BRAND.whatsappUrl, utm, INTEREST_MESSAGE[interest]));
  }, [interest, leadPayload]);

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    trackEvent("cta_click", {
      interest,
      page: pathname || "unknown"
    });

    onClick?.(event);
  };

  return (
    <LinkButton href={href} target="_blank" rel="noreferrer" variant={variant} className={className} onClick={handleClick}>
      {label}
    </LinkButton>
  );
}
