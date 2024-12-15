import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";

async function getBrands(): Promise<string[]> {
  const { blobs } = await list();
  const brandsBlob = blobs.find((blob) => blob.pathname === "brands.json");

  if (!brandsBlob) {
    return [];
  }

  const cacheBustingUrl = `${brandsBlob.url}?timestamp=${Date.now()}`;
  const response = await fetch(cacheBustingUrl, { cache: "no-store" });
  return await response.json();
}

async function saveBrands(brands: string[]): Promise<void> {
  await put("brands.json", JSON.stringify(brands), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function GET() {
  try {
    const brands = await getBrands();
    return new NextResponse(JSON.stringify(brands), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching brands", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { brand } = await req.json();
    const brands = await getBrands();

    if (!brands.includes(brand)) {
      brands.push(brand);
      await saveBrands(brands);
    }

    return NextResponse.json({ message: "Brand added successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding brand", error },
      { status: 500 }
    );
  }
}
