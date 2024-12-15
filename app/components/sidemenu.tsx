"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BadgeDollarSign,
  BadgePlus,
  BellRing,
  Brush,
  Handshake,
  Home,
  LayoutDashboardIcon,
  ScrollText,
  Shell,
  Tag,
  X,
} from "lucide-react";
import DRNFullLogo from "@/public/Fullsize_Transparent.png";
import DRNDarkModeLogo from "@/public/Fullsize_White.png";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import Cookies from "js-cookie";
import { Label } from "@/components/ui/label";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { ScrollArea } from "@/components/ui/scroll-area";

function SideMenu() {
  const pathname = usePathname();
  const { user, isAuthenticated, getToken } = useKindeBrowserClient();
  const token = getToken();

  const [systemTheme, setSystemTheme] = useState("light"); // Default to light theme
  const { theme } = useTheme();

  // Step 1: Declare a state variable for the logo
  const [logo, setLogo] = useState(DRNFullLogo);

  useEffect(() => {
    // Existing logic to determine if the system theme is dark
    if (typeof window !== "undefined") {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setSystemTheme("dark");
      } else {
        setSystemTheme("light");
      }
    }

    // Step 2 & 3: Move the logo determination logic into the useEffect
    const currentLogo =
      theme === "system"
        ? systemTheme === "dark"
          ? DRNDarkModeLogo
          : DRNFullLogo
        : theme === "dark"
        ? DRNDarkModeLogo
        : DRNFullLogo;

    // Update the logo state
    setLogo(currentLogo);
  }, [theme, systemTheme]);

  return (
    <div className="hidden border-r bg-muted/40 lg:block md:w-3/7 lg:w-1/5 max-w-[270px]">
      <div className="flex h-full max-h-dvh flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 py-6 lg:h-[60px] lg:px-6">
          <div className="flex items-center gap-2 font-semibold tracking-tight p-2">
            <Image
              src={logo}
              width={0}
              height={0}
              alt="Disc Rescue Network"
              style={{ width: "auto", height: "auto" }} // optional
            />
          </div>
        </div>
        <ScrollArea>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Button
                asChild
                variant={pathname === "/" ? "secondary" : "ghost"}
                className="w-full justify-start flex gap-2 my-1"
              >
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>

              <h2 className="my-4 px-4 text-lg font-semibold tracking-tight">
                Manage Data
              </h2>

              <Button
                asChild
                variant={pathname === "/brands" ? "secondary" : "ghost"}
                className="w-full justify-start flex gap-2 my-1"
              >
                <Link
                  href="/brands"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Tag className="h-4 w-4" />
                  Brands
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname === "/colors" ? "secondary" : "ghost"}
                className="w-full justify-start flex gap-2 my-1"
              >
                <Link
                  href="/colors"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Brush className="h-4 w-4" />
                  Colors
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname === "/materials" ? "secondary" : "ghost"}
                className="w-full justify-start flex gap-2 my-1"
              >
                <Link
                  href="/materials"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Shell className="h-4 w-4" />
                  Materials
                </Link>
              </Button>
            </nav>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default SideMenu;
