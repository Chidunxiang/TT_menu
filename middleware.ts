import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allowlist
  if (
    pathname.startsWith("/unlock") ||
    pathname.startsWith("/api/unlock") ||
    pathname.startsWith("/api/order") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.match(/\.(png|jpg|jpeg|webp|svg|ico)$/)
  ) {
    return NextResponse.next();
  }

  const authed = req.cookies.get("tt_menu_authed")?.value === "1";
  if (authed) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};