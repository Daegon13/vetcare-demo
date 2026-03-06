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

/**
 * Demo tools are meant for internal testing.
 *
 * Priority order:
 *  1) NEXT_PUBLIC_DEMO_TOOLS env var (build-time)
 *  2) URL param ?demo=1 / ?demo=true (and it persists to localStorage)
 *  3) stored localStorage flag (so navigation doesn't drop demo tools)
 */
export function isDemoToolsEnabled(searchParams?: URLSearchParams | null): boolean {
  const envValue = process.env.NEXT_PUBLIC_DEMO_TOOLS?.toLowerCase() ?? "";
  if (truthyValues.has(envValue)) return true;
  if (falsyValues.has(envValue)) return false;

  const demoValue = searchParams?.get("demo")?.toLowerCase() ?? "";
  if (truthyValues.has(demoValue)) {
    writeStoredFlag(true);
    return true;
  }
  if (falsyValues.has(demoValue)) {
    writeStoredFlag(false);
    return false;
  }

  return readStoredFlag();
}
