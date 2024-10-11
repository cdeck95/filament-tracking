"use client";

import { useState, useEffect, useMemo } from "react";
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
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "./components/data-table-column-header";

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
  },
  {
    accessorKey: "material",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Material" />
    ),
    cell: ({ row }) => <div>{row.getValue("material")}</div>,
  },
  {
    accessorKey: "color",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Color" />
    ),
    cell: ({ row }) => <div>{row.getValue("color")}</div>,
  },
  {
    accessorKey: "weight",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Weight" />
    ),
    cell: ({ row }) => <div>{row.getValue("weight")}</div>,
  },
];

export default function Home() {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFilament, setNewFilament] = useState<Omit<Filament, "id">>({
    brand: "",
    material: "",
    color: "",
    weight: null,
  });
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

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
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      if (typeof value === "string" || typeof value === "number") {
        setSearchTerm(filterValue);
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
      setNewFilament({ brand: "", material: "", color: "", weight: 0 });
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

  const goToFilament = (id: number) => () => {
    router.push(`/filament/${id}`);
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
      const key = `${filament.brand}-${filament.material}-${filament.color}`;
      if (combined[key]) {
        combined[key].totalWeight += filament.weight || 0;
      } else {
        combined[key] = { ...filament, totalWeight: filament.weight || 0 };
      }
    });
    return Object.values(combined);
  }, [filteredFilaments]);

  // // Transforming the `filaments` array to meet the requirement of having string `id` values
  // const transformedFilaments = filteredFilaments.map((filament) => ({
  //   ...filament,
  //   id: filament.id.toString(), // Convert id from number to string
  //   label: `${filament.brand} ${filament.material} ${filament.color}`, // Create the concatenated label
  // }));

  const transformedFilaments = useMemo(() => {
    return combinedFilaments.map((filament) => ({
      id: filament.id,
      label: `${filament.brand} ${filament.material} ${filament.color}`,
      weight: filament.totalWeight,
    }));
  }, [combinedFilaments]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Filament Tracker</h1>
      <Card className="mb-6">
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
                tick={{ fontSize: 12 }}
                tickMargin={10}
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

      <div className="flex items-center py-4">
        <Input
          placeholder="Search brands, colors, materials..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
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
      </div>
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
                  data-state={row.getIsSelected() && "selected"}
                  onClick={goToFilament(row.original.id)}
                  className="cursor-pointer"
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
