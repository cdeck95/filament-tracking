"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { useEffect, useMemo, useState } from "react";
import { Color } from "../types/Color";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter: string;
  setSearchTerm: (value: string) => void;
  setGlobalFilter: (value: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
  setSearchTerm,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const columnHeadersArray: { [key: string]: string } = {
    brand: "Brand",
    color: "Color",
    material: "Material",
    price: "Price",
    weight: "Weight",
    id: "ID",
    createdAt: "Created At",
    updatedAt: "Updated At",
  };

  // Assuming `tableData` is the data fed into the table
  const uniqueBrands = useMemo(() => {
    const values = table
      .getCoreRowModel()
      .flatRows.map((row) => row.getValue("brand")) as string[];
    return Array.from(new Set(values));
  }, [table]);

  // console.log("uniqueBrands", uniqueBrands);

  // Convert the Set to an array and map it to the format needed for the options
  const brandOptions = Array.from(uniqueBrands).map((brand) => ({
    value: brand,
    label: brand,
  }));

  const uniqueMaterials = useMemo(() => {
    const values = table
      .getCoreRowModel()
      .flatRows.map((row) => row.getValue("material")) as string[];
    return Array.from(new Set(values));
  }, [table]);

  // console.log("uniqueMaterials", uniqueMaterials);

  // Convert the Set to an array and map it to the format needed for the options
  const materialOptions = Array.from(uniqueMaterials).map((material) => ({
    value: material,
    label: material,
  }));

  const uniqueColors = useMemo(() => {
    const values = table
      .getCoreRowModel()
      .flatRows.map((row) => row.getValue("color")) as Color[];
    return Array.from(new Set(values.map((color) => color.name)));
  }, [table]);

  // console.log("uniqueColors", uniqueColors);

  // Convert the Set to an array and map it to the format needed for the options
  const colorOptions = Array.from(uniqueColors).map((colorName) => {
    const color = table
      .getCoreRowModel()
      .flatRows.map((row) => row.getValue("color"))
      .find((color) => (color as Color).name === colorName) as Color;
    return {
      value: color.name,
      label: `${color.name}`,
    };
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // console.log("width: ", width);
      setIsMobile(width <= 1080);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div
        className={
          isMobile
            ? "flex flex-1 flex-col items-start gap-2"
            : "flex flex-1 flex-col items-center"
        }
      >
        {isMobile ? (
          <>
            <div className="flex flex-row items-start w-full">
              <Input
                placeholder="Search brands, colors, materials..."
                value={globalFilter}
                onChange={(event) => {
                  setGlobalFilter(event.target.value);
                  setSearchTerm(event.target.value);
                }}
                className="max-w-sm"
              />
            </div>
            <div className="flex flex-row items-start w-full gap-4">
              {table.getColumn("brand") && brandOptions.length > 0 && (
                <DataTableFacetedFilter
                  column={table.getColumn("brand")}
                  title="Brand"
                  options={brandOptions}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  setSearchTerm={setSearchTerm}
                />
              )}
              {table.getColumn("material") && materialOptions.length > 0 && (
                <DataTableFacetedFilter
                  column={table.getColumn("material")}
                  title="Material"
                  options={materialOptions}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  setSearchTerm={setSearchTerm}
                />
              )}
            </div>
            <div className="flex flex-row items-start">
              {table.getColumn("color") && colorOptions.length > 0 && (
                <DataTableFacetedFilter
                  column={table.getColumn("color")}
                  title="Color"
                  options={colorOptions}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  setSearchTerm={setSearchTerm}
                />
              )}
              {isFiltered && (
                <Button
                  variant="ghost"
                  onClick={() => table.resetColumnFilters()}
                  className="h-8 px-2 lg:px-3"
                >
                  Reset
                  <Cross2Icon className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-row items-center space-x-2">
            <Input
              placeholder="Search brands, colors, materials..."
              value={globalFilter}
              onChange={(event) => {
                setGlobalFilter(event.target.value);
                setSearchTerm(event.target.value);
              }}
              className="max-w-sm"
            />
            {table.getColumn("brand") && brandOptions.length > 0 && (
              <DataTableFacetedFilter
                column={table.getColumn("brand")}
                title="Brand"
                options={brandOptions}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                setSearchTerm={setSearchTerm}
              />
            )}
            {table.getColumn("material") && materialOptions.length > 0 && (
              <DataTableFacetedFilter
                column={table.getColumn("material")}
                title="Material"
                options={materialOptions}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                setSearchTerm={setSearchTerm}
              />
            )}
            {table.getColumn("color") && colorOptions.length > 0 && (
              <DataTableFacetedFilter
                column={table.getColumn("color")}
                title="Color"
                options={colorOptions}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                setSearchTerm={setSearchTerm}
              />
            )}
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 lg:px-3"
              >
                Reset
                <Cross2Icon className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      <DataTableViewOptions table={table} columnHeaders={columnHeadersArray} />
    </div>
  );
}
