"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { ensureDemoSeed } from "@/lib/storage";
import { captureUtmFromUrl } from "@/lib/utm";

/**
 * Runs once on the client to avoid an "empty" first impression in demo mode.
 * Safe: only seeds missing data and never overwrites existing user demo data.
 */
export function DemoBootstrap() {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    ensureDemoSeed();
  }, []);

  React.useEffect(() => {
    captureUtmFromUrl(searchParams);
  }, [searchParams]);

  return null;
}
