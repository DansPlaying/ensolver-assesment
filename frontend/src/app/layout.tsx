import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/providers/theme-provider";
import { SessionProvider } from "@/providers/session-provider";
import { ToastProvider } from "@/providers/toast-provider";

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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md focus:outline-none"
        >
          Skip to main content
        </a>
        <SessionProvider>
          <ThemeProvider>
            <ToastProvider>
              <Header />
              <main id="main-content" className="max-w-6xl mx-auto px-4 py-6 sm:py-8" tabIndex={-1}>
                {children}
              </main>
            </ToastProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
