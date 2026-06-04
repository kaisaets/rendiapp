import { Kasutaja } from "../../../model/sequelize/index.js";
import { Op } from "sequelize";

function normalizeString(value, maxLen) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLen);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      clerk_id: clerkId,
      email,
      nimi = null,
      google_id: googleId = null,
      telefon = null,
    } = body ?? {};

    const normalizedEmail = normalizeString(email, 100) || "";
    const normalizedClerkId = normalizeString(clerkId, 100) || "";
    const normalizedGoogleId = normalizeString(googleId, 100);
    const normalizedNimi = normalizeString(nimi, 100);
    const normalizedTelefon = normalizeString(telefon, 20);

    if (!normalizedEmail || !normalizedClerkId) {
      return Response.json(
        { error: "Puudub email või clerk_id." },
        { status: 400 },
      );
    }

    const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
    const määratudRoll =
      SUPER_ADMIN_EMAIL &&
      normalizedEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
        ? "admin"
        : "kasutaja";

    const matchConditions = [
      { clerk_id: normalizedClerkId },
      { email: normalizedEmail },
    ];

    if (normalizedGoogleId) {
      matchConditions.push({ google_id: normalizedGoogleId });
    }

    const existingUser = await Kasutaja.findOne({
      where: {
        [Op.or]: matchConditions,
      },
    });

    if (!existingUser) {
      const created = await Kasutaja.create({
        clerk_id: normalizedClerkId,
        google_id: normalizedGoogleId,
        email: normalizedEmail,
        nimi: normalizedNimi,
        telefon: normalizedTelefon,
        roll: määratudRoll,
      });

      return Response.json(created, { status: 201 });
    }

    existingUser.clerk_id = normalizedClerkId;
    existingUser.google_id = normalizedGoogleId;
    existingUser.email = normalizedEmail;
    existingUser.nimi = normalizedNimi;
    existingUser.telefon = normalizedTelefon;
    existingUser.roll = määratudRoll;

    await existingUser.save();

    return Response.json(existingUser);
  } catch (e) {
    return Response.json(
      {
        error: e?.message || "Kasutaja sünkroniseerimine ebaõnnestus.",
        name: e?.name || "Error",
      },
      { status: 500 },
    );
  }
}