"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface ChangeLogEntry {
  version: string;
  date: string;
  changes: string[];
}

const initialRelease: ChangeLogEntry = {
  version: "1.0.0",
  date: "2024-10-11",
  changes: [
    "Initial release of Filament Tracker",
    "Add, edit, and delete filament entries",
    "View filament inventory in a sortable and filterable table",
    "Visualize filament stock with a bar chart",
    "Search functionality across all filament properties",
    "Color-coded filament entries with predefined color options",
  ],
};

const updates: ChangeLogEntry[] = [
  {
    version: "1.0.1",
    date: "2024-11-15",
    changes: ["Added new colors, brands, and materials"],
  },
  {
    version: "1.0.2",
    date: "2024-11-20",
    changes: [
      "Changed default rows per page to 50",
      "Set default filament order to descending based on 'updatedAt'",
      "Added starting weight and current weight tracking for each filament",
    ],
  },
  {
    version: "1.0.3",
    date: "2024-11-27",
    changes: ["Added new colors, brands, and materials"],
  },

  {
    version: "1.1.0",
    date: "2024-12-14",
    changes: [
      "Clicking anywhere in the row now opens the edit filament page",
      "Added a delete button in the actions menu for quick deletion",
      "Added 'close' and 'home' buttons on the QR code page for easier navigation",
      "Added a 'notes' field to the filament object",
      "Added the 'notes' column to the filament table",
      "Added a toggle to auto-open the QR code after adding a filament",
      "Added Change Log page to track version history",
      "Added a 'empty spools' tab to the filament table. When a filament is marked as empty, it will automatically be moved to this tab",
      "Added the ability to add custom colors, brands, and materials",
    ],
  },
  {
    version: "1.1.1",
    date: "2024-12-15",
    changes: [
      "Centered the QR code on the Filament page",
      "Fixed a bug where the column headers would not display correctly",
      "Added a 'diff' calculation to the filament weight column to show the difference between the starting weight and current weight",
      "Fixed the search functionality to include all fields in the table",
      "Bar Chart is now sorted by weight descending",
      "Bar Chart now uses the color of the filament for the color of the bar",
    ],
  },
];

export default function ChangeLog() {
  const [changeLog, setChangeLog] = useState<ChangeLogEntry[]>([
    initialRelease,
    ...updates,
  ]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Change Log</h1>

      {changeLog
        .sort((a, b) => (a.date > b.date ? -1 : 1))
        .map((entry, index) => (
          <Card key={index} className="mb-6">
            <CardHeader>
              <CardTitle>Version {entry.version}</CardTitle>
              <CardDescription>{entry.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {entry.changes.map((change, changeIndex) => (
                  <li key={changeIndex}>{change}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
