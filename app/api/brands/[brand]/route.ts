import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getBrands, saveBrands } from "../route";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { brand: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const { newBrand } = await request.json();
    const brands = await getBrands(user.id);
    const decodedBrand = decodeURIComponent(params.brand);
    const index = brands.findIndex((brand) => brand === decodedBrand);

    if (index === -1) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    brands[index] = newBrand;
    await saveBrands(brands, user.id);

    return NextResponse.json({ message: "Brand updated successfully" });
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      { error: "Failed to update brand" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { brand: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const brands = await getBrands(user.id);
    const decodedBrand = decodeURIComponent(params.brand);
    const updatedBrands = brands.filter((brand) => brand !== decodedBrand);

    if (brands.length === updatedBrands.length) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    await saveBrands(updatedBrands, user.id);

    return NextResponse.json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { error: "Failed to delete brand" },
      { status: 500 }
    );
  }
}
