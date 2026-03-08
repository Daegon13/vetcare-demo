const truthyValues = new Set(["1", "true"]);
const falsyValues = new Set(["0", "false"]);

const DEMO_TOOLS_STORAGE_KEY = "vetcare:demo_tools";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStoredFlag(): boolean {
  if (!canUseStorage()) return false;
  try {
    return truthyValues.has((localStorage.getItem(DEMO_TOOLS_STORAGE_KEY) ?? "").toLowerCase());
  } catch {
    return false;
  }
}

function writeStoredFlag(enabled: boolean) {
  if (!canUseStorage()) return;
  try {
    if (enabled) localStorage.setItem(DEMO_TOOLS_STORAGE_KEY, "1");
    else localStorage.removeItem(DEMO_TOOLS_STORAGE_KEY);
  } catch {
    // noop
  }
}

function readQueryFlag(searchParams?: URLSearchParams | null): boolean | null {
  const demoValue = searchParams?.get("demo")?.toLowerCase() ?? "";
  if (truthyValues.has(demoValue)) return true;
  if (falsyValues.has(demoValue)) return false;
  return null;
}

function readEnvFlag(): boolean | null {
  const envValue = process.env.NEXT_PUBLIC_DEMO_TOOLS?.toLowerCase() ?? "";
  if (truthyValues.has(envValue)) return true;
  if (falsyValues.has(envValue)) return false;
  return null;
}

export function getDemoToolsState(searchParams?: URLSearchParams | null) {
  const envEnabled = readEnvFlag();
  const queryEnabled = readQueryFlag(searchParams);
  const storedEnabled = readStoredFlag();

  if (envEnabled !== null) {
    return {
      enabled: envEnabled,
      source: "env" as const,
      queryEnabled,
      storedEnabled
    };
  }

  if (queryEnabled !== null) {
    return {
      enabled: queryEnabled,
      source: "query" as const,
      queryEnabled,
      storedEnabled
    };
  }

  return {
    enabled: storedEnabled,
    source: "storage" as const,
    queryEnabled,
    storedEnabled
  };
}

export function persistDemoToolsFlag(enabled: boolean) {
  writeStoredFlag(enabled);
}

export function syncDemoToolsFlagFromQuery(searchParams?: URLSearchParams | null) {
  const queryEnabled = readQueryFlag(searchParams);
  if (queryEnabled === null) return;
  writeStoredFlag(queryEnabled);
}

export function persistDemoToolsFlagIfEnabled(searchParams?: URLSearchParams | null) {
  const state = getDemoToolsState(searchParams);
  if (state.enabled) {
    writeStoredFlag(true);
  }
}

/**
 * Demo tools are meant for internal testing.
 *
 * Priority order:
 *  1) NEXT_PUBLIC_DEMO_TOOLS env var (build-time)
 *  2) URL param ?demo=1 / ?demo=true (and it persists to localStorage)
 *  3) stored localStorage flag (so navigation doesn't drop demo tools)
 */
export function isDemoToolsEnabled(searchParams?: URLSearchParams | null): boolean {
  return getDemoToolsState(searchParams).enabled;
}
