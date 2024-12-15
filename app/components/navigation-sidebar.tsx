"use client";

import * as React from "react";
import { Brush, ChevronRight, Shell, Tag } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import DRNLogo from "@/public/Fullsize_Transparent.png";
import { usePathname } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { UserMenu } from "./user-menu";
import { ModeToggle } from "@/components/ui/modetoggle";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

const navItems = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: Home,
    },
    {
      title: "Manage Data",
      url: "#",
      items: [
        {
          title: "Brands",
          url: "/brands",
          icon: Tag,
        },
        {
          title: "Colors",
          url: "/colors",
          icon: Brush,
        },
        {
          title: "Materials",
          url: "/materials",
          icon: Shell,
        },
      ],
    },
    // {
    //   title: "Graphs",
    //   url: "/graphs",
    //   items: [],
    // },
  ],
};

export function AppSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  console.log("Full Pathname: ", pathname);
  const pathAfterDomain = "/" + pathname.split("/").slice(1).join("/");
  console.log("Pathname after domain", pathAfterDomain);

  const role = pathname.split("/")[1];

  const { user } = useKindeBrowserClient();

  if (!user || pathname === "/login") {
    return <div className="p-0 m-0 w-full h-full">{children}</div>;
  }
  return (
    <SidebarProvider>
      <Sidebar {...props}>
        <SidebarHeader>
          <Image src={DRNLogo} width={200} height={200} alt="DRN Logo" />
        </SidebarHeader>
        <SidebarContent className="gap-0">
          {/* We create a collapsible SidebarGroup for each parent. */}
          {navItems.navMain.map((item) =>
            item.items && item.items.length > 0 ? (
              <Collapsible
                key={item.title}
                title={item.title}
                defaultOpen
                className="group/collapsible"
              >
                <SidebarGroup>
                  <SidebarGroupLabel
                    asChild
                    className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <CollapsibleTrigger>
                      {item.title}{" "}
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {item.items.map((subItem) => (
                          <SidebarMenuItem key={subItem.title}>
                            <SidebarMenuButton
                              asChild
                              isActive={pathAfterDomain === subItem.url}
                            >
                              <a href={subItem.url}>{subItem.title}</a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            ) : (
              <SidebarGroup key={item.title}>
                <SidebarGroupLabel className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <SidebarMenuButton
                    asChild
                    isActive={pathAfterDomain === item.url}
                  >
                    <a href={item.url}>{item.title}</a>
                  </SidebarMenuButton>
                </SidebarGroupLabel>
              </SidebarGroup>
            )
          )}
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col gap-4 p-1">
            {user && <UserMenu user={user} />}
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
    </SidebarProvider>
  );
}
