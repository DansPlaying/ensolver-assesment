import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
  title: "Notes App",
  description: "A simple notes application with tags and filtering",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                  document.documentElement.classList.toggle( "dark",
                      localStorage.theme === "dark" ||
                      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
                );
              } catch (_) { }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <ThemeProvider>
          <Header />
          <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
