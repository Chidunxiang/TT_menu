
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = await req.json().catch(() => ({ code: "" }));
  const pass = process.env.SITE_PASSCODE ?? "";

  if (!pass) return new NextResponse("Missing SITE_PASSCODE", { status: 500 });
  if (String(code) !== pass) return new NextResponse("Invalid", { status: 401 });

  const res = new NextResponse("OK", { status: 200 });
  res.cookies.set("tt_menu_authed", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
