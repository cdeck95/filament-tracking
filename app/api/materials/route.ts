import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";

async function getMaterials(): Promise<string[]> {
  const { blobs } = await list();
  const materialsBlob = blobs.find(
    (blob) => blob.pathname === "materials.json"
  );

  if (!materialsBlob) {
    return [];
  }

  const cacheBustingUrl = `${materialsBlob.url}?timestamp=${Date.now()}`;
  const response = await fetch(cacheBustingUrl, { cache: "no-store" });
  return await response.json();
}

async function saveMaterials(materials: string[]): Promise<void> {
  await put("materials.json", JSON.stringify(materials), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function GET() {
  try {
    const materials = await getMaterials();
    return new NextResponse(JSON.stringify(materials), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching materials", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { material } = await req.json();
    console.log("material", material);
    const materials = await getMaterials();
    console.log("materials", materials);

    if (!materials.includes(material)) {
      console.log("Adding material", material);
      materials.push(material);
      await saveMaterials(materials);
    }

    return NextResponse.json({ message: "Material added successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding material", error },
      { status: 500 }
    );
  }
}
