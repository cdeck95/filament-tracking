"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function VersionBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-center relative">
      <Link href="/change-log" className="hover:underline text-sm md:text-base">
        Filament Tracker v1.1.1 - Change Log
      </Link>
      <p
        className="close cursor-pointer fixed top-3 right-4"
        onClick={() => setIsVisible(false)}
      >
        <X className="w-4 h-4" />
      </p>
    </div>
  );
}
