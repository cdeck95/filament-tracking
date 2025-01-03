import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ModeToggle } from "@/components/ui/modetoggle";
import Link from "next/link";
import { VersionBanner } from "./components/version-banner";
import { AppSidebar } from "./components/navigation-sidebar";
import SideMenu from "./components/sidemenu";
import MenuHeader from "./components/menuheader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import LoginPage from "./login/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Filament Tracking App",
  description: "A simple filament tracking app built with Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LoginPage />
          </ThemeProvider>
        </body>
      </html>
    );
  }
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-dvh">
            <SideMenu />
            <div className="flex flex-col flex-1 w-full h-full">
              <MenuHeader />
              <VersionBanner />
              <ScrollArea className="h-dvh w-full">
                <main className="flex-1 overflow-auto p-0 m-0 md:p-4">
                  {children}
                </main>
              </ScrollArea>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
