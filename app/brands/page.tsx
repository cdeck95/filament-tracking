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

export default function BrandsPage() {
  const [brands, setBrands] = useState<string[]>([]);
  const [newBrand, setNewBrand] = useState("");
  const [editingBrand, setEditingBrand] = useState<{
    original: string;
    edited: string;
  } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/brands");
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch brands",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast({
        title: "Error",
        description: "Failed to fetch brands",
        variant: "destructive",
      });
    }
  };

  const handleAddBrand = async () => {
    try {
      const response = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: newBrand }),
      });
      if (response.ok) {
        setIsAddDialogOpen(false);
        setNewBrand("");
        fetchBrands();
        toast({
          title: "Success",
          description: "Brand added successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add brand",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding brand:", error);
      toast({
        title: "Error",
        description: "Failed to add brand",
        variant: "destructive",
      });
    }
  };

  const handleEditBrand = async () => {
    if (!editingBrand) return;
    try {
      const encodedOriginalBrand = encodeURIComponent(editingBrand.original);
      const response = await fetch(`/api/brands/${encodedOriginalBrand}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newBrand: editingBrand.edited }),
      });
      if (response.ok) {
        setIsEditDialogOpen(false);
        setEditingBrand(null);
        fetchBrands();
        toast({
          title: "Success",
          description: "Brand updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update brand",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating brand:", error);
      toast({
        title: "Error",
        description: "Failed to update brand",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBrand = async () => {
    if (!brandToDelete) return;
    try {
      const encodedBrand = encodeURIComponent(brandToDelete);
      const response = await fetch(`/api/brands/${encodedBrand}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setBrandToDelete(null);
        fetchBrands();
        toast({
          title: "Success",
          description: "Brand deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete brand",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast({
        title: "Error",
        description: "Failed to delete brand",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Brands</h1>
      <Button onClick={() => setIsAddDialogOpen(true)} className="mb-4">
        Add New Brand
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Brand Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand) => (
            <TableRow key={brand}>
              <TableCell>{brand}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => {
                    setEditingBrand({ original: brand, edited: brand });
                    setIsEditDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setBrandToDelete(brand);
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
            <DialogTitle>Add New Brand</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddBrand}>
              Add Brand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editingBrand?.edited || ""}
                onChange={(e) =>
                  setEditingBrand((prev) =>
                    prev ? { ...prev, edited: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditBrand}>
              Update Brand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Brand</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this brand? This action cannot be
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
            <Button variant="destructive" onClick={handleDeleteBrand}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
