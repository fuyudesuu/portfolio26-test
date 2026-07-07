import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import Navbar from "@/components/nav/Navbar";
import { NAV_LEAVES } from "@/lib/data";
import { getHobbies, getEvents, getResume, getAboutProfile } from "@/lib/content";
import type { SearchEntry } from "@/lib/constants";

// Derive metadata from the CMS profile so the tab title / link preview always
// reflect the current name, instead of a hardcoded value.
export function generateMetadata(): Metadata {
  const profile = getAboutProfile();
  const name = profile.name || "Portfolio";
  const title = profile.title ? `${name} — ${profile.title}` : name;
  const description =
    profile.tagline || (profile.title ? `${name}, ${profile.title}.` : name);

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Build a live search index from the actual markdown content, so search
  // reflects whatever is currently published.
  const resume = getResume();
  const searchIndex: SearchEntry[] = [
    ...NAV_LEAVES.map((n) => ({ label: n.label, category: "Section" as const, navId: n.id })),
    ...resume.skills.flatMap((c) => c.items).map((s) => ({ label: s, category: "Skill" as const, navId: "resume" })),
    ...resume.projects.map((p) => ({ label: p.name, category: "Project" as const, navId: "resume" })),
    ...getHobbies().map((h) => ({ label: h.title, category: "Hobby" as const, navId: "hobbies" })),
    ...getEvents().map((e) => ({ label: e.title, category: "Event" as const, navId: "events" })),
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      {/* 
        To use Inter from Google Fonts, replace this <head> with:
        import { Inter } from "next/font/google";
        const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
        Then add className={inter.variable} to <body>
      */}
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <Navbar searchIndex={searchIndex} />
          <main className="pb-24 sm:pb-0">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
