import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

async function getBrands(kindeId: string): Promise<string[]> {
  const { blobs } = await list();
  const brandsBlob = blobs.find(
    (blob) => blob.pathname === `${kindeId}/brands.json`
  );

  if (!brandsBlob) {
    // If user-specific brands don't exist, fall back to default brands
    const defaultBrandsBlob = blobs.find(
      (blob) => blob.pathname === "brands.json"
    );
    if (defaultBrandsBlob) {
      const cacheBustingUrl = `${
        defaultBrandsBlob.url
      }?timestamp=${Date.now()}`;
      const response = await fetch(cacheBustingUrl, { cache: "no-store" });
      return await response.json();
    }
    return [];
  }

  const cacheBustingUrl = `${brandsBlob.url}?timestamp=${Date.now()}`;
  const response = await fetch(cacheBustingUrl, { cache: "no-store" });
  return await response.json();
}

async function saveBrands(brands: string[], kindeId: string): Promise<void> {
  await put(`${kindeId}/brands.json`, JSON.stringify(brands), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

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
