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
import brands from "@/app/data/Brands";
import materials from "@/app/data/Materials";
import { toast } from "@/hooks/use-toast";

// Simulating data fetch and update to Vercel Blob storage
const fetchFilamentById = async (id: number) => {
  // In a real app, this would be an API call to fetch data from Vercel Blob storage
  return {
    id,
    brand: "Prusament",
    material: "PLA",
    color: "Galaxy Black",
    weight: 850,
  };
};

export default function FilamentDetail({
  params,
}: {
  params: { filament_id: string };
}) {
  const filament_id = params.filament_id;
  const id = Array.isArray(filament_id)
    ? parseInt(filament_id[0] ?? "0", 10)
    : parseInt(filament_id ?? "0", 10);
  const [filament, setFilament] = useState<Filament>({
    id: 0,
    brand: "",
    material: "",
    color: "",
    weight: 0,
  });
  const [showQR, setShowQR] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (id) {
      fetchFilamentById(id).then(setFilament);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilament({ ...filament, [e.target.name]: e.target.value });
    setHasChanges(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateFilament(filament);
  };

  const updateFilament = async (filament: Filament) => {
    if (!filament.id) return;
    toast({
      title: "Success",
      description: `Filament #${filament.id} updated successfully`,
      variant: "default",
      duration: 3000,
    });
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

  if (!filament) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Filament #{filament.id}</CardTitle>
          <CardDescription>
            Update the details of your filament roll.{" "}
            <strong>Changes are saved automatically.</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                onValueChange={(value) =>
                  setFilament({ ...filament, brand: value })
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
                name="material"
                value={filament.material}
                onValueChange={(value) =>
                  setFilament({ ...filament, material: value })
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
                name="color"
                value={filament.color}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="weight">Weight (g)</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={filament.weight}
                  onChange={handleChange}
                  className="w-24"
                />
                <Slider
                  value={[filament.weight]}
                  onValueChange={(value) =>
                    setFilament({ ...filament, weight: value[0] })
                  }
                  max={1000}
                  step={1}
                  className="flex-grow"
                />
              </div>
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
              {hasChanges && (
                <Button type="submit" className="mt-2">
                  Save Changes
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      {showQR && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center print:bg-transparent">
          <div className="text-center">
            <FilamentQRCode {...filament} />
            <p className="mt-4 text-lg font-semibold">
              Filament #{filament.id}
            </p>
            <p>
              {filament.brand} - {filament.material} - {filament.color}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
