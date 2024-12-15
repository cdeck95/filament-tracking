"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function VersionBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const pathName = usePathname();

  if (!isVisible || pathName === "/login") {
    return null;
  }

  return (
    <div className="flex items-center justify-center bg-primary text-primary-foreground p-2 w-full z-50 relative">
      <Link href="/change-log" className="hover:underline text-sm md:text-base">
        Filament Tracker v1.2 - Change Log
      </Link>
      <p
        className="close cursor-pointer text-xs lg:text-sm mr-4 top-[50%] right-0 absolute transform -translate-y-1/2"
        onClick={() => setIsVisible(false)}
      >
        <X />
      </p>
    </div>
  );
}
