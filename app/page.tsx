"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filament } from "./types/Filament";

export default function Home() {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Filament>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchFilaments();
  }, []);

  const fetchFilaments = async () => {
    try {
      const response = await fetch("/api/filaments");
      if (!response.ok) {
        throw new Error("Failed to fetch filaments");
      }
      const data = await response.json();
      setFilaments(data);
    } catch (error) {
      console.error("Error fetching filaments:", error);
    }
  };

  const filteredFilaments = filaments.filter((filament) =>
    Object.values(filament).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedFilaments = [...filteredFilaments].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: keyof Filament) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Filament Tracker</h1>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          type="text"
          placeholder="Search filaments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-sm"
        />
        <Link href="/add-filament" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">Add New Filament</Button>
        </Link>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <Table className="min-w-full border-collapse border border-gray-200">
          <TableHeader>
            <TableRow>
              {["id", "brand", "material", "color", "weight"].map((column) => (
                <TableHead
                  key={column}
                  className="border border-gray-200 cursor-pointer"
                  onClick={() => handleSort(column as keyof Filament)}
                >
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                  {sortColumn === column &&
                    (sortDirection === "asc" ? " ▲" : " ▼")}
                </TableHead>
              ))}
              <TableHead className="border border-gray-200">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedFilaments.map((filament) => (
              <TableRow key={filament.id}>
                <TableCell className="border border-gray-200">
                  {filament.id}
                </TableCell>
                <TableCell className="border border-gray-200">
                  {filament.brand}
                </TableCell>
                <TableCell className="border border-gray-200">
                  {filament.material}
                </TableCell>
                <TableCell className="border border-gray-200">
                  {filament.color}
                </TableCell>
                <TableCell className="border border-gray-200">
                  {filament.weight}
                </TableCell>
                <TableCell className="border border-gray-200">
                  <Link href={`/filament/${filament.id}`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
