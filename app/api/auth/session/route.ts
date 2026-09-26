import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// Never cache; also keeps the try/catch below from swallowing Next's
// dynamic-usage signal from cookies() at build time
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();

    if (session) {
      return NextResponse.json({ authenticated: true, user: session.user });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (err) {
    console.error("[session]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
