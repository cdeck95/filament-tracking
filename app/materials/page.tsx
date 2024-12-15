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

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<string[]>([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [editingMaterial, setEditingMaterial] = useState<{
    original: string;
    edited: string;
  } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch("/api/materials");
      if (response.ok) {
        const data = await response.json();
        setMaterials(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch materials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast({
        title: "Error",
        description: "Failed to fetch materials",
        variant: "destructive",
      });
    }
  };

  const handleAddMaterial = async () => {
    try {
      const response = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ material: newMaterial }),
      });
      if (response.ok) {
        setIsAddDialogOpen(false);
        setNewMaterial("");
        fetchMaterials();
        toast({
          title: "Success",
          description: "Material added successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add material",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding material:", error);
      toast({
        title: "Error",
        description: "Failed to add material",
        variant: "destructive",
      });
    }
  };

  const handleEditMaterial = async () => {
    if (!editingMaterial) return;
    try {
      const response = await fetch(
        `/api/materials/${editingMaterial.original}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newMaterial: editingMaterial.edited }),
        }
      );
      if (response.ok) {
        setIsEditDialogOpen(false);
        setEditingMaterial(null);
        fetchMaterials();
        toast({
          title: "Success",
          description: "Material updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update material",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating material:", error);
      toast({
        title: "Error",
        description: "Failed to update material",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMaterial = async () => {
    if (!materialToDelete) return;
    try {
      const response = await fetch(`/api/materials/${materialToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setMaterialToDelete(null);
        fetchMaterials();
        toast({
          title: "Success",
          description: "Material deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete material",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting material:", error);
      toast({
        title: "Error",
        description: "Failed to delete material",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Materials</h1>
      <Button onClick={() => setIsAddDialogOpen(true)} className="mb-4">
        Add New Material
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material}>
              <TableCell>{material}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => {
                    setEditingMaterial({
                      original: material,
                      edited: material,
                    });
                    setIsEditDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setMaterialToDelete(material);
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
            <DialogTitle>Add New Material</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddMaterial}>
              Add Material
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editingMaterial?.edited || ""}
                onChange={(e) =>
                  setEditingMaterial((prev) =>
                    prev ? { ...prev, edited: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditMaterial}>
              Update Material
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Material</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this material? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMaterial}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
