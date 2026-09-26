import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";
import { isSameOrigin } from "@/lib/validate";

export async function POST(request: NextRequest) {
  // Stops a cross-site page from logging the admin out
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    await clearSessionCookie();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[logout]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
