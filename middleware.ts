import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const truthyValues = new Set(["1", "true"]);
const falsyValues = new Set(["0", "false"]);
const DEMO_COOKIE = "vetcare:demo_tools";

function parseFlag(raw: string | undefined): boolean | null {
  if (!raw) return null;
  const value = raw.toLowerCase();
  if (truthyValues.has(value)) return true;
  if (falsyValues.has(value)) return false;
  return null;
}

function isDemoToolsEnabledByEnv(): boolean {
  return parseFlag(process.env.NEXT_PUBLIC_DEMO_TOOLS) === true;
}

export function middleware(request: NextRequest) {
  const envEnabled = isDemoToolsEnabledByEnv();
  const queryEnabled = parseFlag(request.nextUrl.searchParams.get("demo") ?? undefined);
  const cookieEnabled = parseFlag(request.cookies.get(DEMO_COOKIE)?.value);

  if (envEnabled || queryEnabled === true || cookieEnabled === true) {
    const response = NextResponse.next();

    if (queryEnabled === true) {
      response.cookies.set(DEMO_COOKIE, "1", {
        httpOnly: false,
        sameSite: "lax",
        path: "/"
      });
    }

    if (queryEnabled === false) {
      response.cookies.delete(DEMO_COOKIE);
    }

    return response;
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/adminv1/:path*"]
};
