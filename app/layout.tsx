import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ModeToggle } from "@/components/ui/modetoggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Filament Tracking App",
  description: "A simple filament tracking app built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed top-4 left-4 z-50">
            <ModeToggle />
          </div>
          <div className="mt-[10px]">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
