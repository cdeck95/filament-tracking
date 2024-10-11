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

export async function PUT(req: NextRequest) {
  try {
    console.log("Updating filament...");
    const updatedFilament: Filament = await req.json();
    console.log("Updated filament:", updatedFilament);

    const filaments = await getFilaments();
    const index = filaments.findIndex((f) => f.id === updatedFilament.id);

    if (index === -1) {
      return NextResponse.json(
        { message: "Filament not found" },
        { status: 404 }
      );
    }

    filaments[index] = updatedFilament;
    await saveFilaments(filaments);

    return NextResponse.json({
      message: "Filament updated successfully",
      filament: updatedFilament,
    });
  } catch (error) {
    console.error("Error updating filament:", error);
    return NextResponse.json(
      { message: "Error updating filament", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    console.log("Deleting filament...");
    const { id } = await req.json();
    console.log("Filament ID to delete:", id);

    const filaments = await getFilaments();
    const initialLength = filaments.length;
    const updatedFilaments = filaments.filter((f) => f.id !== id);

    if (updatedFilaments.length === initialLength) {
      return NextResponse.json(
        { message: "Filament not found" },
        { status: 404 }
      );
    }

    await saveFilaments(updatedFilaments);

    return NextResponse.json({ message: "Filament deleted successfully" });
  } catch (error) {
    console.error("Error deleting filament:", error);
    return NextResponse.json(
      { message: "Error deleting filament", error },
      { status: 500 }
    );
  }
}
