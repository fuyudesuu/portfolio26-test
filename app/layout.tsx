import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import Navbar from "@/components/nav/Navbar";
import { NAV_ITEMS } from "@/lib/data";
import { getHobbies, getEvents, getAboutProfile } from "@/lib/content";
import type { SearchEntry } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Alex Nguyen — Designer & Developer",
  description:
    "Portfolio of Alex Nguyen. Crafting expressive digital experiences from Saigon.",
  openGraph: {
    title: "Alex Nguyen — Designer & Developer",
    description: "Crafting expressive digital experiences from Saigon.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Build a live search index from the actual markdown content, so search
  // reflects whatever is currently published (sections, skills, hobbies, events).
  const searchIndex: SearchEntry[] = [
    ...NAV_ITEMS.map((n) => ({ label: n.label, category: "Section" as const, navId: n.id })),
    ...getAboutProfile().skills.map((s) => ({ label: s, category: "Skill" as const, navId: "about" })),
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
