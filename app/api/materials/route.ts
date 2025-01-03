import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function getMaterials(kindeId: string): Promise<string[]> {
  const { blobs } = await list();
  const materialsBlob = blobs.find(
    (blob) => blob.pathname === `${kindeId}/materials.json`
  );

  if (!materialsBlob) {
    // If user-specific materials don't exist, fall back to default materials
    const defaultMaterialsBlob = blobs.find(
      (blob) => blob.pathname === "materials.json"
    );
    if (defaultMaterialsBlob) {
      const cacheBustingUrl = `${
        defaultMaterialsBlob.url
      }?timestamp=${Date.now()}`;
      const response = await fetch(cacheBustingUrl, { cache: "no-store" });
      return await response.json();
    }
    return [];
  }

  const cacheBustingUrl = `${materialsBlob.url}?timestamp=${Date.now()}`;
  const response = await fetch(cacheBustingUrl, { cache: "no-store" });
  return await response.json();
}

export async function saveMaterials(
  materials: string[],
  kindeId: string
): Promise<void> {
  await put(`${kindeId}/materials.json`, JSON.stringify(materials), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const materials = await getMaterials(user.id);
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
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const { material } = await req.json();
    console.log("material", material);
    const materials = await getMaterials(user.id);
    console.log("materials", materials);

    if (!materials.includes(material)) {
      console.log("Adding material", material);
      materials.push(material);
      await saveMaterials(materials, user.id);
    }

    return NextResponse.json({ message: "Material added successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding material", error },
      { status: 500 }
    );
  }
}
