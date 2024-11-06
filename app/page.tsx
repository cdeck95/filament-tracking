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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import brands from "./data/Brands";
import materials from "./data/Materials";
import { useRouter } from "next/navigation";
import { Loader2, MoreHorizontal, Pencil, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { DataTableColumnHeader } from "./components/data-table-column-header";
import { colors } from "./data/Colors";
import { DataTablePagination } from "./components/data-table-pagination";
import { format } from "date-fns";
import { DataTableToolbar } from "./components/data-table-toolbar";
import { Color } from "./types/Color";
import { revalidatePath } from "next/cache";

export default function Home() {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Filament>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "brand",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Brand" />
      ),
      cell: ({ row }) => <div>{row.getValue("brand")}</div>,
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
      cell: ({ row }) => <div>{row.getValue("material")}</div>,
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
      cell: ({ row }) => (
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded-full mr-2"
            style={{
              backgroundColor: (row.getValue("color") as { hex: string }).hex,
            }}
          />
          {(row.getValue("color") as { name: string }).name}
        </div>
      ),
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
      cell: ({ row }) => <div>{row.getValue("weight")}</div>,
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location" />
      ),
      cell: ({ row }) => <div>{row.getValue("location")}</div>,
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
        return <div>{formattedDate}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const filament = row.original;
        const router = useRouter();

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
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filaments,
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
      setFilaments(data);
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
      setIsAddDialogOpen(false);
      setNewFilament({
        brand: "",
        material: "",
        color: {
          name: "",
          hex: "",
        },
        weight: 0,
      });
      fetchFilaments();
      toast({
        title: "Success",
        description: "Filament added successfully",
        variant: "default",
        duration: 3000,
      });
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
    }));
  }, [table.getFilteredRowModel().rows]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Filament Tracker</h1>
      <Card className="mb-6 hidden lg:block">
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
              data={transformedFilaments} // Use transformed filaments with string id
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
                <LabelList
                  dataKey="weight"
                  position="right"
                  formatter={(value: number) => `${value}g`}
                  style={{ fill: "var(--color-weight)", fontSize: "12px" }}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* <Input
          type="text"
          placeholder="Search filaments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-sm"
        /> */}

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">+ Add New Filament</Button>
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
                <Select
                  value={newFilament.color.name}
                  onValueChange={(value) => {
                    const selectedColor = colors.find((c) => c.name === value);
                    setNewFilament({
                      ...newFilament,
                      color: selectedColor || { name: "", hex: "" },
                    });
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
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {/* <div className="flex items-center py-4">
          <Input
            placeholder="Search brands, colors, materials..."
            value={globalFilter}
            onChange={(event) => {
              setGlobalFilter(event.target.value);
              setSearchTerm(event.target.value);
            }}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
        {!isLoading && (
          <DataTableToolbar
            table={table}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
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
      </div>
    </div>
  );
}
