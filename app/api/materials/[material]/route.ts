import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { getMaterials, saveMaterials } from "../route";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

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
