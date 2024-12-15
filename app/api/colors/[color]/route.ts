import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { Color } from "@/app/types/Color";

async function getColors(): Promise<Color[]> {
  const { blobs } = await list();
  const colorsBlob = blobs.find((blob) => blob.pathname === "colors.json");

  if (!colorsBlob) {
    return [];
  }

  const cacheBustingUrl = `${colorsBlob.url}?timestamp=${Date.now()}`;
  const response = await fetch(cacheBustingUrl, { cache: "no-store" });
  return await response.json();
}

async function saveColors(colors: Color[]): Promise<void> {
  await put("colors.json", JSON.stringify(colors), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { color: string } }
) {
  try {
    const { newColor } = await request.json();
    const colors = await getColors();
    const decodedOriginalColorName = decodeURIComponent(params.color);
    const index = colors.findIndex(
      (color) => color.name === decodedOriginalColorName
    );

    if (index === -1) {
      return NextResponse.json({ error: "Color not found" }, { status: 404 });
    }

    colors[index] = newColor;
    await saveColors(colors);

    return NextResponse.json({ message: "Color updated successfully" });
  } catch (error) {
    console.error("Error updating color:", error);
    return NextResponse.json(
      { error: "Failed to update color" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { color: string } }
) {
  try {
    const colors = await getColors();
    const decodedColorName = decodeURIComponent(params.color);
    const updatedColors = colors.filter(
      (color) => color.name !== decodedColorName
    );

    if (colors.length === updatedColors.length) {
      return NextResponse.json({ error: "Color not found" }, { status: 404 });
    }

    await saveColors(updatedColors);

    return NextResponse.json({ message: "Color deleted successfully" });
  } catch (error) {
    console.error("Error deleting color:", error);
    return NextResponse.json(
      { error: "Failed to delete color" },
      { status: 500 }
    );
  }
}
