"use client";

import { useState, useEffect, useMemo } from "react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Loader2, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "./components/data-table-column-header";
import { DataTablePagination } from "./components/data-table-pagination";
import { format, set } from "date-fns";
import { DataTableToolbar } from "./components/data-table-toolbar";
import { Color } from "./types/Color";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTableToolbarEmpty } from "./components/data-table-toolbar-empty";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [emptyFilaments, setEmptyFilaments] = useState<Filament[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newFilament, setNewFilament] = useState<Omit<Filament, "id">>({
    brand: "",
    material: "",
    color: {
      name: "",
      hex: "",
    },
    weight: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const router = useRouter();
  const [showQRCode, setShowQRCode] = useState(true);
  const [newBrand, setNewBrand] = useState("");
  const [newMaterial, setNewMaterial] = useState("");
  const [newColor, setNewColor] = useState<Partial<Color>>({
    name: "",
    hex: "",
  });
  const [brands, setBrands] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddBrandDialogOpen, setIsAddBrandDialogOpen] = useState(false);
  const [isAddMaterialDialogOpen, setIsAddMaterialDialogOpen] = useState(false);
  const [isAddColorDialogOpen, setIsAddColorDialogOpen] = useState(false);

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

  const deleteFilament = async (filament: Filament) => {
    if (!filament) return;

    try {
      const response = await fetch(`/api/filaments/${filament.id}`, {
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
      setFilaments((prevFilaments) =>
        prevFilaments.filter((f) => f.id !== filament.id)
      );
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

  const handleEditClick = (filament: Filament) => {
    router.push(`/filament/${filament.id}`);
  };

  const columns: ColumnDef<Filament>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => {
        const filament = row.original;

        return (
          <div onClick={() => handleEditClick(filament)}>
            {row.getValue("id")}
          </div>
        );
      },
    },
    {
      accessorKey: "brand",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Brand" />
      ),
      cell: ({ row }) => {
        const filament = row.original;

        return (
          <div onClick={() => handleEditClick(filament)}>
            {row.getValue("brand")}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        // console.log("Filtering:", {
        //   rowValue: row.getValue(id),
        //   filterValue: value,
        // });
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "material",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Material" />
      ),
      cell: ({ row }) => {
        const filament = row.original;

        return (
          <div onClick={() => handleEditClick(filament)}>
            {row.getValue("material")}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        // console.log("Filtering:", {
        //   rowValue: row.getValue(id),
        //   filterValue: value,
        // });
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "color",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Color" />
      ),
      cell: ({ row }) => {
        const filament = row.original;
        if (!row.getValue("color")) return null;
        return (
          <div
            className="flex items-center min-w-fit"
            onClick={() => handleEditClick(filament)}
          >
            <div
              className="w-4 h-4 rounded-full mr-2 min-w-[16px]"
              style={{
                backgroundColor: (row.getValue("color") as { hex: string }).hex,
              }}
            />
            <Label>{(row.getValue("color") as { name: string }).name}</Label>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        const colorName = (row.getValue(id) as Color).name;
        return value.includes(colorName); // Filter based on color name
      },
    },
    {
      accessorKey: "weight",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Weight" />
      ),
      cell: ({ row }) => {
        const filament = row.original;
        const originalWeight = row.original.startingWeight;
        const weight = row.original.weight;

        let diff = 0;
        if (originalWeight && weight) {
          diff = Math.round(weight - originalWeight);
        }

        return (
          <div onClick={() => handleEditClick(filament)}>
            {row.getValue("weight")}g{" "}
            {diff !== 0 && `(${diff > 0 ? "+" : ""}${diff}g)`}
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location" />
      ),
      cell: ({ row }) => {
        const filament = row.original;
        return (
          <div onClick={() => handleEditClick(filament)}>
            {row.getValue("location")}
          </div>
        );
      },
    },
    {
      accessorKey: "notes",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Notes" />
      ),
      cell: ({ row }) => {
        const filament = row.original;
        return (
          <div onClick={() => handleEditClick(filament)}>
            {row.getValue("notes")}
          </div>
        );
      },
    },
    // {
    //   accessorKey: "createdAt",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Created At" />
    //   ),
    //   cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
    // },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated At" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        const formattedDate = format(date, "MM/dd/yyyy h:mm a");
        const filament = row.original;
        return (
          <div onClick={() => handleEditClick(filament)}>{formattedDate}</div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const filament = row.original;

        const goToFilament = (id: number) => () => {
          router.push(`/filament/${id}`);
        };

        const emptyFilament = () => {
          console.log("Marking filament as empty:", filament);
          const newFilament = { ...filament, weight: 0 };
          fetch(`/api/filaments/${filament.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newFilament),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to mark filament as empty");
              }
              return response.json();
            })
            .then(() => {
              fetchFilaments();
              toast({
                title: "Success",
                description: "Filament marked as empty",
                variant: "default",
                duration: 3000,
              });
            })
            .catch((error) => {
              console.error("Error marking filament as empty:", error);
              toast({
                title: "Error",
                description: "Failed to mark filament as empty",
                variant: "destructive",
                duration: 3000,
              });
            });
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={goToFilament(row.original.id)}>
                  <Pencil className="h-4 w-4 mr-2" />{" "}
                  <Label className="text-xs">Edit</Label>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={emptyFilament}>
                  <X className="h-4 w-4 mr-2" />{" "}
                  <Label className="text-xs">Mark as empty</Label>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => deleteFilament(filament)}
                className="text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <Label className="text-xs">Delete</Label>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const initialSorting: SortingState = [
    {
      id: "updatedAt",
      desc: true,
    },
  ];

  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [activeTab, setActiveTab] = useState("active");

  const table = useReactTable({
    data: activeTab === "active" ? filaments : emptyFilaments,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFacetedUniqueValues: getFacetedUniqueValues(), // Add this line
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (row, columnId, filterValue) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getValue = (obj: any, path: string) => {
        const keys = path.split(".");
        return keys.reduce(
          (acc, key) => (acc && acc[key] !== undefined ? acc[key] : null),
          obj
        );
      };

      const searchableFields = [
        "id",
        "brand",
        "material",
        "color.name",
        "weight",
        "location",
        "notes",
      ];

      return searchableFields.some((field) => {
        const value = getValue(row.original, field);
        const safeValue = value !== null ? String(value).toLowerCase() : "";
        return safeValue.includes(filterValue.toLowerCase());
      });
    },
    // globalFilterFn: (row, columnId, filterValue) => {
    //   const value = row.getValue(columnId);
    //   if (typeof value === "string" || typeof value === "number") {
    //     return String(value)
    //       .toLowerCase()
    //       .includes(String(filterValue).toLowerCase());
    //   }
    //   return false;
    // },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleGlobalFilter = (value: string) => {
    setGlobalFilter(value);
    table.setGlobalFilter(value);
  };

  const table2 = useReactTable({
    data: emptyFilaments,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFacetedUniqueValues: getFacetedUniqueValues(), // Add this line
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      if (typeof value === "string" || typeof value === "number") {
        return String(value)
          .toLowerCase()
          .includes(String(filterValue).toLowerCase());
      }
      return false;
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  table.getState().pagination.pageSize = 50;
  table2.getState().pagination.pageSize = 50;

  useEffect(() => {
    fetchFilaments();
  }, []);

  const fetchFilaments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/filaments");
      if (!response.ok) {
        throw new Error("Failed to fetch filaments");
      }
      const data = await response.json();
      console.log("Filaments fetched:", data);
      const emptySpools = data.filter(
        (filament: Filament) => filament.weight === 0
      );
      const filteredData = data.filter(
        (filament: Filament) => filament.weight && filament.weight > 0
      );

      console.log(emptySpools);

      setFilaments(filteredData);
      setEmptyFilaments(emptySpools);
    } catch (error) {
      console.error("Error fetching filaments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFilament = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
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
      const data = await response.json();
      const filamentToAdd = data.filament as Filament;
      setFilaments((prevFilaments) => [...prevFilaments, filamentToAdd]);
      setIsAddDialogOpen(false);
      setNewFilament({
        brand: "",
        material: "",
        color: {
          name: "",
          hex: "",
        },
        weight: 0,
        startingWeight: 0,
        notes: "",
      });
      fetchFilaments();
      toast({
        title: "Success",
        description: "Filament added successfully",
        variant: "default",
        duration: 3000,
      });
      if (showQRCode) {
        router.push(`/filament/${filamentToAdd.id}?showQR=${showQRCode}`);
      }
    } catch (error) {
      console.error("Error adding filament:", error);
      toast({
        title: "Error",
        description: "Failed to add filament",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFilaments = filaments.filter((filament) =>
    Object.values(filament).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const combinedFilaments = useMemo(() => {
    const combined: { [key: string]: Filament & { totalWeight: number } } = {};
    filteredFilaments.forEach((filament) => {
      const key = `${filament.brand}-${filament.material}-${filament.color.name}`;
      const weightAsNumber = filament.weight
        ? parseFloat(filament.weight.toString())
        : 0; // Convert weight to a number
      if (combined[key]) {
        combined[key].totalWeight += weightAsNumber; // Add converted weight
      } else {
        combined[key] = { ...filament, totalWeight: weightAsNumber }; // Initialize with converted weight
      }
    });
    return Object.values(combined);
  }, [filteredFilaments]);

  const transformedFilaments = useMemo(() => {
    // Use filtered rows from the table instead of the raw data
    const filteredData = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);

    const combined: { [key: string]: Filament & { totalWeight: number } } = {};

    filteredData.forEach((filament) => {
      const key = `${filament.brand}-${filament.material}-${filament.color.name}`;
      const weightAsNumber = filament.weight
        ? parseFloat(filament.weight.toString())
        : 0;

      if (combined[key]) {
        combined[key].totalWeight += weightAsNumber;
      } else {
        combined[key] = { ...filament, totalWeight: weightAsNumber };
      }
    });

    return Object.values(combined).map((filament) => ({
      id: filament.id,
      label: `${filament.brand} ${filament.material} ${filament.color.name}`,
      weight: filament.totalWeight,
      color: filament.color.hex, // Include the color hex value
    }));
  }, [table.getFilteredRowModel().rows]);

  const handleAddBrand = async () => {
    try {
      const response = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: newBrand }),
      });
      if (response.ok) {
        setIsAddBrandDialogOpen(false);
        setBrands([...brands, newBrand]);
        setNewFilament({ ...newFilament, brand: newBrand });
        setNewBrand("");
        toast({
          title: "Success",
          description: "Brand added successfully",
          variant: "default",
          duration: 3000,
        });
      } else {
        console.error("Failed to add brand");
        toast({
          title: "Error",
          description: "Failed to add brand",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error adding brand:", error);
      toast({
        title: "Error",
        description: "Failed to add brand",
        variant: "destructive",
        duration: 3000,
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
        setIsAddMaterialDialogOpen(false);
        setNewMaterial("");
        setMaterials([...materials, newMaterial]);
        setNewFilament({ ...newFilament, material: newMaterial });
        toast({
          title: "Success",
          description: "Material added successfully",
          variant: "default",
          duration: 3000,
        });
      } else {
        console.error("Failed to add material");
        toast({
          title: "Error",
          description: "Failed to add material",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error adding material:", error);
      toast({
        title: "Error",
        description: "Failed to add material",
        variant: "destructive",
        duration: 3000,
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
        setIsAddColorDialogOpen(false);
        setNewColor({ name: "", hex: "" });
        setColors([...colors, newColor as Color]);
        setNewFilament({
          ...newFilament,
          color: newColor as Color,
        });
        toast({
          title: "Success",
          description: "Color added successfully",
          variant: "default",
          duration: 3000,
        });
      } else {
        console.error("Failed to add color");
        toast({
          title: "Error",
          description: "Failed to add color",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error adding color:", error);
      toast({
        title: "Error",
        description: "Failed to add color",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-2 p-2">
      <h1 className="text-3xl font-bold mb-2 text-center">Filament Tracker</h1>
      <Card className="mb-2 hidden lg:block">
        <CardHeader>
          <CardTitle>Filament Stock Overview</CardTitle>
          <CardDescription>
            Visual representation of your current filament stock
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              weight: {
                label: "Weight (g)",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="max-h-[350px]"
          >
            <BarChart
              data={transformedFilaments.sort((a, b) => b.weight - a.weight)} // Sort by weight descending // Use transformed filaments with string id
              layout="vertical" // Set layout to vertical
              margin={{ top: 10, right: 10, bottom: 10, left: 20 }}
              barCategoryGap="20%" // Adjust the gap between categories
              barGap={5} // Adjust the gap between bars within a category
            >
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                label={{
                  value: "Weight (g)",
                  position: "insideBottom",
                  offset: -5,
                }}
                domain={[0, "auto"]} // Set range from 0 to auto
              />
              <YAxis
                type="category"
                dataKey="label" // Using the new concatenated label for y-axis
                tick={{ fontSize: 10 }}
                tickMargin={20} // Increase tick margin for more space between labels
                interval={0} // Show all labels
                textAnchor="end"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="weight" fill="var(--color-weight)">
                {transformedFilaments.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.color !== "#FFFFFF" ? entry.color : "black" // Use black color for white filaments
                    }
                  />
                ))}
                <LabelList
                  dataKey="weight"
                  position="right"
                  formatter={(value: number) => `${value}g`}
                  style={{ fontSize: "12px" }}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="mb-4 flex flex-col sm:flex-row justify-end items-center gap-2">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-[200px] md:w-auto">+ Add Filament</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90%] max-h-[90%] overflow-y-auto z-50">
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
                  onValueChange={(value) => {
                    if (value === "add_new") {
                      setIsAddBrandDialogOpen(true);
                    } else {
                      setNewFilament({ ...newFilament, brand: value });
                    }
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
                    <Separator className="my-1" />
                    <SelectItem value="add_new">+ Add New Brand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="material">Material</Label>
                <Select
                  value={newFilament.material}
                  onValueChange={(value) => {
                    if (value === "add_new") {
                      setIsAddMaterialDialogOpen(true);
                    } else {
                      setNewFilament({ ...newFilament, material: value });
                    }
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
                    <Separator className="my-1" />
                    <SelectItem value="add_new">+ Add New Material</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Select
                  value={newFilament.color.name}
                  onValueChange={(value) => {
                    if (value === "add_new") {
                      setIsAddColorDialogOpen(true);
                    } else {
                      const selectedColor = colors.find(
                        (c) => c.name === value
                      );
                      setNewFilament({
                        ...newFilament,
                        color: selectedColor || { name: "", hex: "" },
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((color) => (
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
                    <Separator className="my-1" />
                    <SelectItem value="add_new">+ Add New Color</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weight">Weight (g)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter weight"
                  value={newFilament.weight || ""}
                  onChange={(e) =>
                    setNewFilament({
                      ...newFilament,
                      weight: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="weight">Starting Weight (g)</Label>
                <Input
                  id="startingWeight"
                  type="number"
                  placeholder="Enter starting weight"
                  value={newFilament.weight || ""}
                  onChange={(e) =>
                    setNewFilament({
                      ...newFilament,
                      startingWeight: Number(e.target.value),
                    })
                  }
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="weight">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Enter notes"
                  value={newFilament.notes}
                  onChange={(e) =>
                    setNewFilament({
                      ...newFilament,
                      notes: e.target.value,
                    })
                  }
                />
              </div>
              <Button type="submit">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <Label>Please wait</Label>
                  </>
                ) : (
                  "Add Filament"
                )}
              </Button>
            </form>
            <DialogFooter>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-qr-code"
                  checked={showQRCode}
                  onCheckedChange={() => setShowQRCode(!showQRCode)}
                />
                <Label htmlFor="show-qr-code">Show QR Code After Adding</Label>
              </div>
            </DialogFooter>
          </DialogContent>
          <Dialog
            open={isAddBrandDialogOpen}
            onOpenChange={setIsAddBrandDialogOpen}
          >
            <DialogContent className="max-w-[90%] max-h-[90%] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Brand</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newBrand">Brand Name</Label>
                  <Input
                    id="newBrand"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="Enter new brand name"
                  />
                </div>
                <Button onClick={handleAddBrand}>Add Brand</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isAddMaterialDialogOpen}
            onOpenChange={setIsAddMaterialDialogOpen}
          >
            <DialogContent className="max-w-[90%] max-h-[90%] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Material</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newMaterial">Material Name</Label>
                  <Input
                    id="newMaterial"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    placeholder="Enter new material name"
                  />
                </div>
                <Button onClick={handleAddMaterial}>Add Material</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isAddColorDialogOpen}
            onOpenChange={setIsAddColorDialogOpen}
          >
            <DialogContent className="max-w-[90%] max-h-[90%] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Color</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newColorName">Color Name</Label>
                  <Input
                    id="newColorName"
                    value={newColor.name}
                    onChange={(e) =>
                      setNewColor({ ...newColor, name: e.target.value })
                    }
                    placeholder="Enter new color name"
                  />
                </div>
                <div>
                  <Label htmlFor="newColorHex">Color Hex Code</Label>
                  <Input
                    id="newColorHex"
                    value={newColor.hex}
                    onChange={(e) =>
                      setNewColor({ ...newColor, hex: e.target.value })
                    }
                    placeholder="Enter color hex code (e.g., #FF0000)"
                  />
                </div>
                <Button onClick={handleAddColor}>Add Color</Button>
              </div>
            </DialogContent>
          </Dialog>
        </Dialog>
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 w-[80%] md:w-[400px] justify-center mx-auto">
            <TabsTrigger value="active" onClick={() => setActiveTab("active")}>
              Active
            </TabsTrigger>
            <TabsTrigger value="empty" onClick={() => setActiveTab("empty")}>
              Empty
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle>Active Spools</CardTitle>
                <CardDescription>
                  View and manage your active spools here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 p-4 md:p-6">
                {!isLoading && (
                  <DataTableToolbar
                    table={table}
                    globalFilter={globalFilter}
                    handleGlobalFilter={handleGlobalFilter}
                    setSearchTerm={setSearchTerm}
                  />
                )}

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => {
                            return (
                              <TableHead key={header.id}>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </TableHead>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            {columns.map((column, cellIndex) => (
                              <TableCell key={cellIndex}>
                                <Skeleton className="w-full h-6" />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            // data-state={row.getIsSelected() && "selected"}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <DataTablePagination table={table} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="empty" className="w-full h-full">
            <Card className="h-full w-full">
              <CardHeader className="p-4 md:p-6">
                <CardTitle>Empty Spools</CardTitle>
                <CardDescription>
                  View and manage your empty spools here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 p-4 md:p-6">
                {!isLoading && (
                  <DataTableToolbarEmpty
                    table={table2}
                    globalFilter={globalFilter}
                    handleGlobalFilter={handleGlobalFilter}
                    setSearchTerm={setSearchTerm}
                  />
                )}

                {emptyFilaments.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                              return (
                                <TableHead key={header.id}>
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                </TableHead>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                              {columns.map((column, cellIndex) => (
                                <TableCell key={cellIndex}>
                                  <Skeleton className="w-full h-6" />
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row) => (
                            <TableRow
                              key={row.id}
                              // data-state={row.getIsSelected() && "selected"}
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={columns.length}
                              className="h-24 text-center"
                            >
                              No results.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-lg text-gray-500">No empty spools</p>
                  </div>
                )}
                <DataTablePagination table={table2} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
