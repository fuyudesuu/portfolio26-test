import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

// Server-side auth guard for everything under /admin/dashboard. Lives here
// rather than in middleware because session verification needs Node crypto.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin");

  return <>{children}</>;
}
