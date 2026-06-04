import { Kasutaja } from "../../../model/sequelize/index.js";

function normalizeTelefon(value) {
  if (value == null) {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function getClerkIdFromUrl(request) {
  const url = new URL(request.url);
  return (url.searchParams.get("clerk_id") || "").trim();
}

export async function GET(request) {
  try {
    const clerkId = getClerkIdFromUrl(request);

    if (!clerkId) {
      return Response.json({ error: "Puudub clerk_id." }, { status: 400 });
    }

    const kasutaja = await Kasutaja.findOne({ where: { clerk_id: clerkId } });

    if (!kasutaja) {
      return Response.json({ error: "Kasutajat ei leitud." }, { status: 404 });
    }

    const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;

    if (
      kasutaja.email && 
      SUPER_ADMIN_EMAIL && // Turvakontroll
      kasutaja.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() && 
      kasutaja.roll !== "admin"
    ) {
      kasutaja.roll = "admin";
      await kasutaja.save(); // Salvestab "admin" rolli andmebaasi kohe
    }

    return Response.json(kasutaja);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { clerk_id: clerkId, telefon, nimi } = body ?? {};

    const normalizedClerkId = typeof clerkId === "string" ? clerkId.trim() : "";

    if (!normalizedClerkId) {
      return Response.json({ error: "Puudub clerk_id." }, { status: 400 });
    }

    const kasutaja = await Kasutaja.findOne({
      where: { clerk_id: normalizedClerkId },
    });

    if (!kasutaja) {
      return Response.json({ error: "Kasutajat ei leitud." }, { status: 404 });
    }

    if (typeof nimi === "string") {
      kasutaja.nimi = nimi.trim() || null;
    }

    if (typeof telefon === "string" || telefon == null) {
      kasutaja.telefon = normalizeTelefon(telefon);
    }

    const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
    
    if (
      kasutaja.email &&
      SUPER_ADMIN_EMAIL &&
      kasutaja.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
    ) {
      kasutaja.roll = "admin";
    }

    await kasutaja.save();

    return Response.json(kasutaja);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}