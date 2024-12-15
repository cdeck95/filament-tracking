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

export async function GET() {
  try {
    const colors = await getColors();
    return new NextResponse(JSON.stringify(colors), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching colors", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const newColor: Color = await req.json();
    const colors = await getColors();

    if (!colors.some((color) => color.name === newColor.name)) {
      colors.push(newColor);
      await saveColors(colors);
    }

    return NextResponse.json({ message: "Color added successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding color", error },
      { status: 500 }
    );
  }
}
