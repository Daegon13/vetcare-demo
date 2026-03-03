"use client";

import * as React from "react";
import { ensureDemoSeed } from "@/lib/storage";

/**
 * Runs once on the client to avoid an "empty" first impression in demo mode.
 * Safe: only seeds missing data and never overwrites existing user demo data.
 */
export function DemoBootstrap() {
  React.useEffect(() => {
    ensureDemoSeed();
  }, []);

  return null;
}
