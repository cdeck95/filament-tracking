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
  const filaments = (await response.json()) as Filament[];

  const today = new Date();

  // Check for missing createdAt and updatedAt fields and update them
  const updatedFilaments = filaments.map((filament) => ({
    ...filament,
    createdAt: filament.createdAt || today, // Set createdAt if not present
    updatedAt: filament.updatedAt || today, // Set updatedAt if not present
  }));

  await saveFilaments(updatedFilaments);

  return updatedFilaments;
}

async function saveFilaments(filaments: Filament[]): Promise<void> {
  await put("filaments.json", JSON.stringify(filaments), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function GET() {
  try {
    console.log("Fetching filaments...");
    const filaments = await getFilaments();
    return NextResponse.json(filaments);
  } catch (error) {
    console.error("Error fetching filaments:", error);
    return NextResponse.json(
      { message: "Error fetching filaments", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("Adding new filament...");
    const newFilament: Omit<Filament, "id"> = await req.json();
    console.log("New filament:", newFilament);

    const filaments = await getFilaments();
    const newId =
      filaments.length > 0 ? Math.max(...filaments.map((f) => f.id)) + 1 : 1;
    const filamentWithId: Filament = { ...newFilament, id: newId };

    filaments.push(filamentWithId);
    await saveFilaments(filaments);

    return NextResponse.json({
      message: "Filament added successfully",
      filament: filamentWithId,
    });
  } catch (error) {
    console.error("Error adding filament:", error);
    return NextResponse.json(
      { message: "Error adding filament", error },
      { status: 500 }
    );
  }
}
