const truthyValues = new Set(["1", "true"]);

export function isDemoToolsEnabled(searchParams?: URLSearchParams | null): boolean {
  const envValue = process.env.NEXT_PUBLIC_DEMO_TOOLS?.toLowerCase() ?? "";
  if (truthyValues.has(envValue)) return true;

  if (!searchParams) return false;
  const demoValue = searchParams.get("demo")?.toLowerCase() ?? "";
  return truthyValues.has(demoValue);
}
