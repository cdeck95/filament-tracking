import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { Filament } from "@/app/types/Filament";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

async function getFilaments(kindeId: string): Promise<Filament[]> {
  const { blobs } = await list();
  const filamentsBlob = blobs.find(
    (blob) => blob.pathname === `${kindeId}/filaments.json`
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
  //console.log("Filaments updated:", updatedFilaments);

  await saveFilaments(kindeId, updatedFilaments);

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

export async function GET() {
  try {
    console.log("Fetching and checking filaments...");
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let filaments = await getFilaments(user.id);
    let updated = false;

    filaments = filaments.map((filament) => {
      if (typeof filament.weight === "string") {
        const numWeight = parseFloat(filament.weight);
        if (!isNaN(numWeight)) {
          filament.weight = numWeight;
          updated = true;
        } else if (filament.weight === "0" || filament.weight === "") {
          filament.weight = 0;
          updated = true;
        }
      }
      return filament;
    });

    if (updated) {
      console.log("Updating filaments with corrected weight values...");
      await saveFilaments(user.id, filaments);
    }

    return NextResponse.json(filaments);
  } catch (error) {
    console.error("Error fetching and updating filaments:", error);
    return NextResponse.json(
      { message: "Error fetching and updating filaments", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Adding new filament...");
    const newFilament: Omit<Filament, "id"> = await req.json();
    console.log("New filament:", newFilament);

    const filaments = await getFilaments(user.id);
    const newId =
      filaments.length > 0 ? Math.max(...filaments.map((f) => f.id)) + 1 : 1;
    const filamentWithId: Filament = { ...newFilament, id: newId };

    filaments.push(filamentWithId);
    await saveFilaments(user.id, filaments);

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
