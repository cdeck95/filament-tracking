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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { material: string } }
) {
  try {
    const { newMaterial } = await request.json();
    const materials = await getMaterials();
    const decodedOriginalMaterial = decodeURIComponent(params.material);
    const index = materials.indexOf(decodedOriginalMaterial);

    if (index === -1) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 }
      );
    }

    materials[index] = newMaterial;
    await saveMaterials(materials);

    return NextResponse.json({ message: "Material updated successfully" });
  } catch (error) {
    console.error("Error updating material:", error);
    return NextResponse.json(
      { error: "Failed to update material" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { material: string } }
) {
  try {
    const materials = await getMaterials();
    const decodedMaterial = decodeURIComponent(params.material);
    const updatedMaterials = materials.filter(
      (material) => material !== decodedMaterial
    );

    if (materials.length === updatedMaterials.length) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 }
      );
    }

    await saveMaterials(updatedMaterials);

    return NextResponse.json({ message: "Material deleted successfully" });
  } catch (error) {
    console.error("Error deleting material:", error);
    return NextResponse.json(
      { error: "Failed to delete material" },
      { status: 500 }
    );
  }
}
