"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Color } from "../types/Color";

export default function ColorsPage() {
  const [colors, setColors] = useState<Color[]>([]);
  const [newColor, setNewColor] = useState<Color>({ name: "", hex: "" });
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<Color | null>(null);

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const response = await fetch("/api/colors");
      if (response.ok) {
        const data = await response.json();
        setColors(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch colors",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
      toast({
        title: "Error",
        description: "Failed to fetch colors",
        variant: "destructive",
      });
    }
  };

  const handleAddColor = async () => {
    try {
      const response = await fetch("/api/colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newColor),
      });
      if (response.ok) {
        setIsAddDialogOpen(false);
        setNewColor({ name: "", hex: "" });
        fetchColors();
        toast({
          title: "Success",
          description: "Color added successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add color",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding color:", error);
      toast({
        title: "Error",
        description: "Failed to add color",
        variant: "destructive",
      });
    }
  };

  const handleEditColor = async () => {
    if (!editingColor) return;
    try {
      const response = await fetch(`/api/colors/${editingColor.name}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingColor),
      });
      if (response.ok) {
        setIsEditDialogOpen(false);
        setEditingColor(null);
        fetchColors();
        toast({
          title: "Success",
          description: "Color updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update color",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating color:", error);
      toast({
        title: "Error",
        description: "Failed to update color",
        variant: "destructive",
      });
    }
  };

  const handleDeleteColor = async () => {
    if (!colorToDelete) return;
    try {
      const response = await fetch(`/api/colors/${colorToDelete.name}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setColorToDelete(null);
        fetchColors();
        toast({
          title: "Success",
          description: "Color deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete color",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting color:", error);
      toast({
        title: "Error",
        description: "Failed to delete color",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Colors</h1>
      <Button onClick={() => setIsAddDialogOpen(true)} className="mb-4">
        Add New Color
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Color Name</TableHead>
            <TableHead>Hex Code</TableHead>
            <TableHead>Preview</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {colors.map((color) => (
            <TableRow key={color.name}>
              <TableCell>{color.name}</TableCell>
              <TableCell>{color.hex}</TableCell>
              <TableCell>
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: color.hex }}
                ></div>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => {
                    setEditingColor(color);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setColorToDelete(color);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Color</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newColor.name}
                onChange={(e) =>
                  setNewColor({ ...newColor, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hex" className="text-right">
                Hex
              </Label>
              <Input
                id="hex"
                value={newColor.hex}
                onChange={(e) =>
                  setNewColor({ ...newColor, hex: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddColor}>
              Add Color
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Color</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editName" className="text-right">
                Name
              </Label>
              <Input
                id="editName"
                value={editingColor?.name || ""}
                onChange={(e) =>
                  setEditingColor((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editHex" className="text-right">
                Hex
              </Label>
              <Input
                id="editHex"
                value={editingColor?.hex || ""}
                onChange={(e) =>
                  setEditingColor((prev) =>
                    prev ? { ...prev, hex: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditColor}>
              Update Color
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Color</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this color? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteColor}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
