"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import Link from "next/link";
import { LogOut, Home, Menu, Tag, Shell, Brush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { SheetTrigger, SheetContent } from "@/components/ui/sheet";
import DRNFullLogo from "@/public/Fullsize_Transparent.png";
import { DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "@/components/ui/modetoggle";

function MenuHeader() {
  const { user, isAuthenticated, getToken, isLoading } =
    useKindeBrowserClient();
  //console.log("user in menuheader: ", user);
  const token = getToken();
  const pathname = usePathname();

  const { toast } = useToast();

  return (
    <header className="flex justify-between h-14 items-center gap-4 border-b bg-muted/40 lg:h-[60px] px-2 lg:px-4 lg:min-h-[60px]">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col overflow-auto">
          <>
            <div className="flex h-14 items-center border-b px-1 mr-2 lg:h-[60px] lg:px-6 pb-2 gap-2">
              <div className="flex items-center gap-2 font-semibold tracking-tight p-2">
                <Image
                  src={DRNFullLogo}
                  width={0}
                  height={0}
                  alt="Disc Rescue Network"
                  style={{ width: "auto", height: "auto" }} // optional
                />
              </div>
            </div>

            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <DialogTrigger asChild>
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
              </DialogTrigger>

              <h2 className="my-4 px-4 text-lg font-semibold tracking-tight">
                Manage Data
              </h2>

              <DialogTrigger asChild>
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
              </DialogTrigger>
              <DialogTrigger asChild>
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
              </DialogTrigger>
              <DialogTrigger asChild>
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
              </DialogTrigger>
            </nav>
          </>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-4">
        <ModeToggle />
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                {isLoading ? (
                  <Skeleton className="h-8 w-8 rounded-full" />
                ) : (
                  <Avatar>
                    <AvatarImage
                      src={user?.picture || ""}
                      alt="profile picture"
                    />
                    <AvatarFallback>
                      {user?.given_name?.slice(0, 1)}
                      {user?.family_name?.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                )}

                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthenticated ? (
                <LogoutLink>
                  {" "}
                  <DropdownMenuItem asChild>
                    <div className="flex items-center gap-3 rounded-lg px-1 py-2 text-muted-foreground transition-all hover:text-primary">
                      <LogOut className="h-4 w-4" />
                      Log out
                    </div>
                  </DropdownMenuItem>
                </LogoutLink>
              ) : (
                <></>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Button variant="ghost">
              <LoginLink postLoginRedirectURL="/">Sign in</LoginLink>
            </Button>

            <Button variant="default">
              <RegisterLink postLoginRedirectURL="/">Sign up</RegisterLink>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
export default MenuHeader;
