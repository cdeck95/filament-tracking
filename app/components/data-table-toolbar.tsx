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
  handleGlobalFilter: (value: string) => void;
  setSearchTerm: (value: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  globalFilter,
  handleGlobalFilter,
  setSearchTerm,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const columnHeadersArray: { [key: string]: string } = {
    brand: "Brand",
    color: "Color",
    material: "Material",
    price: "Price",
    weight: "Weight",
    location: "Location",
    notes: "Notes",
    startingWeight: "Starting Weight",
    id: "ID",
    createdAt: "Created At",
    updatedAt: "Updated At",
  };

  const uniqueBrands = useMemo(() => {
    const values = table
      .getCoreRowModel()
      .flatRows.map((row) => row.getValue("brand")) as string[];
    return Array.from(new Set(values));
  }, [table]);

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

  const materialOptions = Array.from(uniqueMaterials).map((material) => ({
    value: material,
    label: material,
  }));

  const uniqueColors = useMemo(() => {
    const values = table
      .getCoreRowModel()
      .flatRows.map((row) => row.getValue("color")) as Color[];
    return Array.from(new Set(values.map((color) => JSON.stringify(color))));
  }, [table]);

  const colorOptions = Array.from(uniqueColors).map((colorString) => {
    const color = JSON.parse(colorString) as Color;
    return {
      value: color.name,
      label: color.name,
      hex: color.hex,
    };
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
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
                placeholder="Search all columns..."
                value={globalFilter}
                onChange={(event) => handleGlobalFilter(event.target.value)}
                className="h-8 w-[150px] lg:w-[250px]"
              />
            </div>
            <div className="flex flex-row items-start w-full gap-4">
              {table.getColumn("brand") && brandOptions.length > 0 && (
                <DataTableFacetedFilter
                  column={table.getColumn("brand")}
                  title="Brand"
                  options={brandOptions}
                />
              )}
              {table.getColumn("material") && materialOptions.length > 0 && (
                <DataTableFacetedFilter
                  column={table.getColumn("material")}
                  title="Material"
                  options={materialOptions}
                />
              )}
            </div>
            <div className="flex flex-row items-start">
              {table.getColumn("color") && colorOptions.length > 0 && (
                <DataTableFacetedFilter
                  column={table.getColumn("color")}
                  title="Color"
                  options={colorOptions}
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
              placeholder="Search all columns..."
              value={globalFilter}
              onChange={(event) => handleGlobalFilter(event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
            {table.getColumn("brand") && brandOptions.length > 0 && (
              <DataTableFacetedFilter
                column={table.getColumn("brand")}
                title="Brand"
                options={brandOptions}
              />
            )}
            {table.getColumn("material") && materialOptions.length > 0 && (
              <DataTableFacetedFilter
                column={table.getColumn("material")}
                title="Material"
                options={materialOptions}
              />
            )}
            {table.getColumn("color") && colorOptions.length > 0 && (
              <DataTableFacetedFilter
                column={table.getColumn("color")}
                title="Color"
                options={colorOptions}
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
