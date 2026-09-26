import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[logout]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
