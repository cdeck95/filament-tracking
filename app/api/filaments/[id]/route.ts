import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { Filament } from "@/app/types/Filament";

async function getFilaments(): Promise<Filament[]> {
  const { blobs } = await list();
  const filamentsBlob = blobs.find((blob) =>
    blob.pathname.startsWith("filaments.json")
  );

  if (!filamentsBlob) {
    return [];
  }

  const blobUrl = filamentsBlob.url;
  const cacheBustingUrl = `${blobUrl}?timestamp=${Date.now()}`;
  const response = await fetch(cacheBustingUrl, { cache: "no-store" });
  return await response.json();
}

async function saveFilaments(filaments: Filament[]): Promise<void> {
  await put("filaments.json", JSON.stringify(filaments), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Fetching filament with ID: ${params.id}`);

    const filaments = await getFilaments();
    const filament = filaments.find((f) => f.id === parseInt(params.id));

    if (!filament) {
      console.log(`Filament with ID ${params.id} not found`);
      return NextResponse.json(
        { message: "Filament not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(filament);
  } catch (error) {
    console.error(`Error fetching filament with ID ${params.id}:`, error);
    return NextResponse.json(
      { message: "Error fetching filament", error },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Updating filament with ID: ${params.id}`);

    const updatedFilament: Filament = await req.json();
    const filaments = await getFilaments();
    const index = filaments.findIndex((f) => f.id === parseInt(params.id));

    if (index === -1) {
      console.log(`Filament with ID ${params.id} not found`);
      return NextResponse.json(
        { message: "Filament not found" },
        { status: 404 }
      );
    }

    filaments[index] = { ...filaments[index], ...updatedFilament };
    await saveFilaments(filaments);

    return NextResponse.json(filaments[index]);
  } catch (error) {
    console.error(`Error updating filament with ID ${params.id}:`, error);
    return NextResponse.json(
      { message: "Error updating filament", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Deleting filament with ID: ${params.id}`);

    const filaments = await getFilaments();
    const index = filaments.findIndex((f) => f.id === parseInt(params.id));

    if (index === -1) {
      console.log(`Filament with ID ${params.id} not found`);
      return NextResponse.json(
        { message: "Filament not found" },
        { status: 404 }
      );
    }

    filaments.splice(index, 1);
    await saveFilaments(filaments);

    return NextResponse.json({ message: "Filament deleted successfully" });
  } catch (error) {
    console.error(`Error deleting filament with ID ${params.id}:`, error);
    return NextResponse.json(
      { message: "Error deleting filament", error },
      { status: 500 }
    );
  }
}
