import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

async function getUserBrands(kindeId: string): Promise<string[]> {
  const { blobs } = await list();
  const userBrandsBlob = blobs.find(
    (blob) => blob.pathname === `${kindeId}/brands.json`
  );

  if (userBrandsBlob) {
    const cacheBustingUrl = `${userBrandsBlob.url}?timestamp=${Date.now()}`;
    const response = await fetch(cacheBustingUrl, { cache: "no-store" });
    return await response.json();
  }

  // If user-specific brands don't exist, fall back to default brands
  const defaultBrandsBlob = blobs.find(
    (blob) => blob.pathname === "brands.json"
  );
  if (defaultBrandsBlob) {
    const cacheBustingUrl = `${defaultBrandsBlob.url}?timestamp=${Date.now()}`;
    const response = await fetch(cacheBustingUrl, { cache: "no-store" });
    return await response.json();
  }

  return []; // Return empty array if no brands found
}

export async function getBrands(kindeId: string): Promise<string[]> {
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

export async function saveBrands(
  brands: string[],
  kindeId: string
): Promise<void> {
  await put(`${kindeId}/brands.json`, JSON.stringify(brands), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const brands = await getBrands(user.id);
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching brands", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const { brand } = await req.json();
    const brands = await getBrands(user.id);
    const normalizedBrand = brand.trim();

    if (!brands.includes(normalizedBrand)) {
      brands.push(normalizedBrand);
      await saveBrands(brands, user.id);
    }

    return NextResponse.json({ message: "Brand added successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding brand", error },
      { status: 500 }
    );
  }
}
