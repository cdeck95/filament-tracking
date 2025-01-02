import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { Filament } from "@/app/types/Filament";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

async function getFilaments(kindeId: string): Promise<Filament[]> {
  const { blobs } = await list();
  const filamentsBlob = blobs.find((blob) =>
    blob.pathname.startsWith(`${kindeId}/filaments.json`)
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

  return updatedFilaments;
}

async function saveFilaments(
  kindeId: string,
  filaments: Filament[]
): Promise<void> {
  await put(`${kindeId}/filaments.json`, JSON.stringify(filaments), {
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
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const filaments = await getFilaments(user.id);
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
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedFilament: Filament = await req.json();
    const filaments = await getFilaments(user.id);
    const index = filaments.findIndex((f) => f.id === parseInt(params.id));

    if (index === -1) {
      console.log(`Filament with ID ${params.id} not found`);
      return NextResponse.json(
        { message: "Filament not found" },
        { status: 404 }
      );
    }

    // Update the filament and set updatedAt to the current date and time
    filaments[index] = {
      ...filaments[index],
      ...updatedFilament,
      updatedAt: new Date(), // Set updatedAt to the current date and time
    };

    await saveFilaments(user.id, filaments);

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
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const filaments = await getFilaments(user.id);
    const index = filaments.findIndex((f) => f.id === parseInt(params.id));

    if (index === -1) {
      console.log(`Filament with ID ${params.id} not found`);
      return NextResponse.json(
        { message: "Filament not found" },
        { status: 404 }
      );
    }

    filaments.splice(index, 1);
    await saveFilaments(user.id, filaments);

    return NextResponse.json({ message: "Filament deleted successfully" });
  } catch (error) {
    console.error(`Error deleting filament with ID ${params.id}:`, error);
    return NextResponse.json(
      { message: "Error deleting filament", error },
      { status: 500 }
    );
  }
}
