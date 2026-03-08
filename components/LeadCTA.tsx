"use client";

import * as React from "react";

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
  const [href, setHref] = React.useState(BRAND.whatsappUrl);

  React.useEffect(() => {
    const utm = getStoredUtm();

    if (leadPayload) {
      setHref(buildLeadWhatsappUrl(BRAND.whatsappUrl, utm, leadPayload));
      return;
    }

    setHref(buildWhatsappUrl(BRAND.whatsappUrl, utm, INTEREST_MESSAGE[interest]));
  }, [interest, leadPayload]);

  return (
    <LinkButton href={href} target="_blank" rel="noreferrer" variant={variant} className={className} onClick={onClick}>
      {label}
    </LinkButton>
  );
}
