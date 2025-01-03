import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { Color } from "@/app/types/Color";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

async function getColors(kindeId: string): Promise<Color[]> {
  const { blobs } = await list();
  const colorsBlob = blobs.find(
    (blob) => blob.pathname === `${kindeId}/colors.json`
  );

  if (!colorsBlob) {
    // If user-specific colors don't exist, fall back to default colors
    const defaultColorsBlob = blobs.find(
      (blob) => blob.pathname === "colors.json"
    );
    if (defaultColorsBlob) {
      const cacheBustingUrl = `${
        defaultColorsBlob.url
      }?timestamp=${Date.now()}`;
      const response = await fetch(cacheBustingUrl, { cache: "no-store" });
      return await response.json();
    }
    return [];
  }

  const cacheBustingUrl = `${colorsBlob.url}?timestamp=${Date.now()}`;
  const response = await fetch(cacheBustingUrl, { cache: "no-store" });
  return await response.json();
}

async function saveColors(colors: Color[], kindeId: string): Promise<void> {
  await put(`${kindeId}/colors.json`, JSON.stringify(colors), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const colors = await getColors(user.id);
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
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const newColor: Color = await req.json();
    const colors = await getColors(user.id);

    if (!colors.some((color) => color.name === newColor.name)) {
      colors.push(newColor);
      await saveColors(colors, user.id);
    }

    return NextResponse.json({ message: "Color added successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding color", error },
      { status: 500 }
    );
  }
}
