"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Filament } from "@/app/types/Filament";
import FilamentQRCode from "@/app/components/QRCode";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft, Loader2, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Color } from "@/app/types/Color";
import { Separator } from "@/components/ui/separator";

export default function FilamentDetail({
  params,
}: {
  params: { filament_id: string };
}) {
  const filament_id = params.filament_id;
  console.log("filament_id", filament_id);
  const id = Array.isArray(filament_id)
    ? parseInt(filament_id[0] ?? "0", 10)
    : parseInt(filament_id ?? "0", 10);
  console.log("id", id);
  const [filament, setFilament] = useState<Filament>({
    id: 0,
    brand: "",
    material: "",
    color: {
      name: "",
      hex: "",
    },
    weight: 0,
    startingWeight: 0,
    location: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    notes: "",
  });
  const [showQR, setShowQR] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [brands, setBrands] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [colors, setColors] = useState<Color[]>([]);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    const [brandsResponse, materialsResponse, colorsResponse] =
      await Promise.all([
        fetch("/api/brands"),
        fetch("/api/materials"),
        fetch("/api/colors"),
      ]);
    const [brandsData, materialsData, colorsData] = await Promise.all([
      brandsResponse.json(),
      materialsResponse.json(),
      colorsResponse.json(),
    ]);
    setBrands(brandsData);
    setMaterials(materialsData);
    setColors(colorsData);
  };

  useEffect(() => {
    if (searchParams.get("showQR") === "true") {
      setShowQR(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (id) {
      fetchFilamentById(id);
    }
  }, [id]);

  const fetchFilamentById = async (id: number) => {
    try {
      const response = await fetch(`/api/filaments/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch filament");
      }
      const data = await response.json();
      // Use the filament data here
      console.log(data);
      setFilament(data);
    } catch (error) {
      console.error("Error fetching filament:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    console.log("handleChange", e.target.name, e.target.value);
    setFilament({ ...filament, [e.target.name]: e.target.value });
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    e.preventDefault();
    if (!filament) return;

    try {
      const response = await fetch(`/api/filaments/${params.filament_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filament),
      });
      if (!response.ok) {
        throw new Error("Failed to update filament");
      }
      toast({
        title: "Success",
        description: `Filament #${filament.id} updated successfully`,
        variant: "default",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating filament:", error);
      toast({
        title: "Error",
        description: "Failed to update filament",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
      setHasChanges(false);
    }
  };

  const saveStartingWeight = async (newFilament: Filament) => {
    if (!newFilament) return;

    try {
      const response = await fetch(`/api/filaments/${params.filament_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFilament),
      });
      if (!response.ok) {
        throw new Error("Failed to update filament");
      }
      // toast({
      //   title: "Success",
      //   description: `Filament #${filament.id} updated successfully`,
      //   variant: "default",
      //   duration: 3000,
      // });
      setHasChanges(false);
    } catch (error) {
      console.error("Error updating filament:", error);
      toast({
        title: "Error",
        description: "Failed to update filament",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const deleteFilament = async () => {
    if (!filament) return;

    try {
      const response = await fetch(`/api/filaments/${params.filament_id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete filament");
      }
      toast({
        title: "Success",
        description: `Filament #${filament.id} deleted successfully`,
        variant: "default",
        duration: 3000,
      });
      router.push("/");
    } catch (error) {
      console.error("Error deleting filament:", error);
      toast({
        title: "Error",
        description: "Failed to delete filament",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handlePrintQR = () => {
    setShowQR(true);
    setTimeout(() => {
      window.print();
      setShowQR(false);
    }, 100);
  };

  const showQRCode = () => {
    setShowQR(true);
  };

  useEffect(() => {
    if (loading) return;
    if (!filament.startingWeight && filament.weight) {
      const newFilament = { ...filament, startingWeight: filament.weight };
      setFilament(newFilament);
      setHasChanges(true);
      saveStartingWeight(newFilament);
    }
  }, [filament, loading]);

  if (!filament) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 relative">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              // onClick={deleteFilament}
              variant="destructive"
              className="absolute top-2 right-4"
            >
              <Trash className="m-0 p-0 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90%]">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this filament?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-between">
              <DialogClose>
                <Button variant="destructive" onClick={deleteFilament}>
                  Delete
                </Button>
              </DialogClose>
              <DialogClose>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Filament #{filament.id}</CardTitle>
          <CardDescription>
            Update the details of your filament roll.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="w-full h-10" /> {/* ID */}
              <Skeleton className="w-full h-10" /> {/* Brand */}
              <Skeleton className="w-full h-10" /> {/* Material */}
              <Skeleton className="w-full h-10" /> {/* Color */}
              <div className="flex items-center space-x-4">
                <Skeleton className="w-24 h-10" /> {/* Weight Input */}
                <Skeleton className="flex-grow h-10" /> {/* Weight Slider */}
              </div>
              <div className="flex flex-row gap-4 justify-start items-center">
                <Skeleton className="w-32 h-10" /> {/* Print QR Code Button */}
                <Skeleton className="w-32 h-10" /> {/* Show QR Code Button */}
              </div>
              <div className="flex flex-row gap-4 justify-start items-center">
                <Skeleton className="w-32 h-10" /> {/* Notes Text Area */}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="id">ID</Label>
                <Input id="id" value={filament.id} readOnly disabled />
              </div>

              <div>
                <Label htmlFor="brand">Brand</Label>
                <Select
                  name="brand"
                  value={filament.brand}
                  onValueChange={(value) => {
                    setFilament({ ...filament, brand: value });
                    setHasChanges(true);
                  }}
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
                  name="material"
                  value={filament.material}
                  onValueChange={(value) => {
                    setFilament({ ...filament, material: value });
                    setHasChanges(true);
                  }}
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
                <Select
                  value={filament.color.name}
                  onValueChange={(value) => {
                    const selectedColor = colors.find((c) => c.name === value);
                    if (selectedColor) {
                      setFilament({
                        ...filament,
                        color: selectedColor,
                      });
                      setHasChanges(true);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.name} value={color.name}>
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="weight">Weight (g)</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={filament.weight || ""}
                    onChange={handleChange}
                    className="w-24"
                  />
                  <Slider
                    value={[filament.weight || 0]}
                    onValueChange={(value) => {
                      setFilament({ ...filament, weight: value[0] });
                      setHasChanges(true);
                    }}
                    max={1000}
                    step={1}
                    className="flex-grow"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="startingWeight">Starting Weight (g)</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="startingWeight"
                    name="startingWeight"
                    type="number"
                    value={filament.startingWeight || ""}
                    onChange={handleChange}
                    className="w-24"
                  />
                  <Slider
                    value={[filament.startingWeight || 0]}
                    onValueChange={(value) => {
                      setFilament({ ...filament, startingWeight: value[0] });
                      setHasChanges(true);
                    }}
                    max={1000}
                    step={1}
                    className="flex-grow"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={filament.location || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="updated_at">Notes</Label>

                <Textarea
                  id="notes"
                  name="notes"
                  value={filament.notes}
                  onChange={handleChange}
                  placeholder="Enter notes"
                  className="min-h-[9.5rem]"
                />
              </div>
              <div>
                <Label htmlFor="created_at">Created At</Label>
                <Input
                  id="created_at"
                  value={
                    filament.createdAt
                      ? new Date(filament.createdAt).toLocaleString()
                      : ""
                  }
                  readOnly
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="updated_at">Updated At</Label>
                <Input
                  id="updated_at"
                  value={
                    filament.updatedAt
                      ? new Date(filament.updatedAt).toLocaleString()
                      : ""
                  }
                  readOnly
                  disabled
                />
              </div>
              <div className="flex flex-row gap-4 justify-start items-center">
                <Button
                  type="button"
                  variant="default"
                  className="mt-2"
                  onClick={handlePrintQR}
                >
                  Print QR Code
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={showQRCode}
                  className="mt-2"
                >
                  Show QR Code
                </Button>
              </div>
              {hasChanges && (
                <div className="fixed bottom-0 left-0 right-0 border-t border-border p-4 flex justify-center items-center">
                  <Button type="submit" onClick={() => handleSubmit}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <Label>Please wait</Label>
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              )}
            </form>
          )}
        </CardContent>
      </Card>

      {showQR && (
        <div className="fixed inset-0 bg-white text-black z-50 flex items-center justify-center print:bg-transparent">
          <div className="text-center justify-center items-center">
            <FilamentQRCode {...filament} />
            <div className="flex flex-col">
              <Button onClick={() => setShowQR(false)} className="mt-4">
                Close
              </Button>
              <Button onClick={() => router.push("/")} className="mt-4">
                Home
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
