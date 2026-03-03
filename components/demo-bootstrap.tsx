"use client";

import * as React from "react";
import { ensureDemoSeed } from "@/lib/storage";

export function DemoBootstrap() {
  React.useEffect(() => {
    ensureDemoSeed();
  }, []);

  return null;
}
