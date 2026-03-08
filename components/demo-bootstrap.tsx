"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { ensureDemoSeed } from "@/lib/storage";
import { persistDemoToolsFlagIfEnabled, syncDemoToolsFlagFromQuery } from "@/lib/demoMode";
import { captureUtmFromUrl } from "@/lib/utm";

/**
 * Runs once on the client to avoid an "empty" first impression in demo mode.
 * Safe: only seeds missing data and never overwrites existing user demo data.
 */
export function DemoBootstrap() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  React.useEffect(() => {
    ensureDemoSeed();
  }, []);

  React.useEffect(() => {
    syncDemoToolsFlagFromQuery(searchParams);
    persistDemoToolsFlagIfEnabled(searchParams);
  }, [searchParams]);

  React.useEffect(() => {
    captureUtmFromUrl(searchParams);
  }, [searchParams]);

  React.useEffect(() => {
    if (!pathname) return;
    trackEvent("page_view", { page: pathname });
  }, [pathname]);

  return null;
}
