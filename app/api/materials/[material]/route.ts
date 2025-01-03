import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

async function getMaterials(kindeId: string): Promise<string[]> {
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

async function saveMaterials(
  materials: string[],
  kindeId: string
): Promise<void> {
  await put(`${kindeId}/materials.json`, JSON.stringify(materials), {
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
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const { newMaterial } = await request.json();
    const materials = await getMaterials(user.id);
    const decodedOriginalMaterial = decodeURIComponent(params.material);
    const index = materials.indexOf(decodedOriginalMaterial);

    if (index === -1) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 }
      );
    }

    materials[index] = newMaterial;
    await saveMaterials(materials, user.id);

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
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const materials = await getMaterials(user.id);
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

    await saveMaterials(updatedMaterials, user.id);

    return NextResponse.json({ message: "Material deleted successfully" });
  } catch (error) {
    console.error("Error deleting material:", error);
    return NextResponse.json(
      { error: "Failed to delete material" },
      { status: 500 }
    );
  }
}
