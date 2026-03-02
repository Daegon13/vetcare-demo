"use client";

import * as React from "react";
import { ensureDemoSeed } from "@/lib/storage";

/**
 * Runs once on the client to avoid an "empty" feeling in the demo.
 * Safe: does not overwrite user-created demo data.
 */
export function DemoBootstrap() {
  React.useEffect(() => {
    ensureDemoSeed();
  }, []);

  return null;
}
