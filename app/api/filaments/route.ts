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
