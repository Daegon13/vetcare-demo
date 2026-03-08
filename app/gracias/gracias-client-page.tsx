"use client";

import * as React from "react";
import { Container, Badge } from "@/components/ui";
import { LeadCTA } from "@/components/LeadCTA";
import { trackEvent } from "@/lib/analytics";
import { addLead } from "@/lib/leads";
import { getStoredUtm, type LeadPayload } from "@/lib/utm";

type StoredLead = LeadPayload & {
  leadId?: string;
};

export default function GraciasPage() {
  const [leadPayload, setLeadPayload] = React.useState<StoredLead | undefined>(undefined);

  React.useEffect(() => {
    const utm = getStoredUtm();

    try {
      const raw = localStorage.getItem("vetcare:lead");
      if (!raw) {
        trackEvent("lead_thanks_view", { ...(utm ?? {}) });
        return;
      }

      const lead = JSON.parse(raw) as StoredLead;
      setLeadPayload(lead);

      trackEvent("lead_thanks_view", { leadId: lead.leadId, ...(utm ?? {}) });

      const hasInterest = Array.isArray(lead.interes) && lead.interes.length > 0;
      const hasUtm = Boolean(utm && Object.values(utm).some(Boolean));
      if ((hasInterest || hasUtm) && lead.leadId) {
        addLead({
          leadId: lead.leadId,
          sourcePage: window.location.pathname,
          channel: "thank_you",
          utm: utm ?? undefined,
          interest: hasInterest ? lead.interes : ["implementacion"],
          note: "Thank you page visit",
          phone: lead.whatsapp
        });
        trackEvent("lead_saved", { channel: "thank_you", location: "gracias", ...(utm ?? {}) });
      }
    } catch {
      trackEvent("lead_thanks_view", { ...(utm ?? {}) });
      setLeadPayload(undefined);
    }
  }, []);

  function onWhatsappClick() {
    trackEvent("cta_whatsapp_click", { location: "gracias", ...(getStoredUtm() ?? {}) });
  }

  return (
    <div className="bg-gradient-to-b from-white to-warm-100 py-10 dark:from-graphite-950 dark:to-graphite-900 sm:py-14">
      <Container className="grid max-w-2xl gap-4 text-center">
        <Badge className="mx-auto w-fit">Lead recibido</Badge>
        <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Recibido, te respondemos por WhatsApp</h1>
        <p className="text-sm text-black/65 dark:text-white/70 sm:text-lg">
          Gracias por completar la precalificación. Si querés acelerar, abrí WhatsApp y te respondemos con el plan ideal.
        </p>
        <div className="flex justify-center">
          <LeadCTA
            interest="general"
            label="Abrir WhatsApp"
            onClick={onWhatsappClick}
            leadPayload={leadPayload}
            className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300"
          />
        </div>
      </Container>
    </div>
  );
}
