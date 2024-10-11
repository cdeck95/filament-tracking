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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import brands from "./data/Brands";
import materials from "./data/Materials";

export default function Home() {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFilament, setNewFilament] = useState<Omit<Filament, "id">>({
    brand: "",
    material: "",
    color: "",
    weight: 0,
  });

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

  const handleAddFilament = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/filaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFilament),
      });
      if (!response.ok) {
        throw new Error("Failed to add filament");
      }
      setIsAddDialogOpen(false);
      setNewFilament({ brand: "", material: "", color: "", weight: 0 });
      fetchFilaments();
    } catch (error) {
      console.error("Error adding filament:", error);
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

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">Add New Filament</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90%]">
            <DialogHeader>
              <DialogTitle>Add New Filament</DialogTitle>
              <DialogDescription>
                Enter the details of the new filament roll.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddFilament} className="space-y-4">
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Select
                  value={newFilament.brand}
                  onValueChange={(value) =>
                    setNewFilament({ ...newFilament, brand: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="material">Material</Label>
                <Select
                  value={newFilament.material}
                  onValueChange={(value) =>
                    setNewFilament({ ...newFilament, material: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material} value={material}>
                        {material}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={newFilament.color}
                  placeholder="Enter color"
                  onChange={(e) =>
                    setNewFilament({ ...newFilament, color: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (g)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter weight"
                  value={newFilament.weight}
                  onChange={(e) =>
                    setNewFilament({
                      ...newFilament,
                      weight: Number(e.target.value),
                    })
                  }
                />
              </div>
              <Button type="submit">Add Filament</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto mx-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Weight (g)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFilaments.map((filament) => (
              <TableRow key={filament.id}>
                <TableCell>
                  <Link href={`/filament/${filament.id}`}>{filament.id}</Link>
                </TableCell>
                <TableCell>{filament.brand}</TableCell>
                <TableCell>{filament.material}</TableCell>
                <TableCell>{filament.color}</TableCell>
                <TableCell>{filament.weight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
