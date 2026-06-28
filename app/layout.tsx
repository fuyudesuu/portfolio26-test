import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import Navbar from "@/components/nav/Navbar";

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
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
