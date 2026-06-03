import { Kasutaja } from "../../../model/sequelize/index.js";

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

    const normalizedEmail = typeof email === "string" ? email.trim() : "";
    const normalizedClerkId = typeof clerkId === "string" ? clerkId.trim() : "";
    const normalizedTelefon =
      typeof telefon === "string" ? telefon.trim() || null : null;

    if (!normalizedEmail || !normalizedClerkId) {
      return Response.json(
        { error: "Puudub email või clerk_id." },
        { status: 400 },
      );
    }

    const existingByClerk = await Kasutaja.findOne({
      where: { clerk_id: normalizedClerkId },
    });

    if (!existingByClerk) {
      const created = await Kasutaja.create({
        clerk_id: normalizedClerkId,
        google_id: googleId,
        email: normalizedEmail,
        nimi,
        telefon: normalizedTelefon,
        roll: "kasutaja",
      });

      return Response.json(created, { status: 201 });
    }

    existingByClerk.google_id = googleId;
    existingByClerk.email = normalizedEmail;
    existingByClerk.nimi = nimi;
    existingByClerk.telefon = normalizedTelefon;
    // Sisselogitud lõppkasutaja roll on alati "kasutaja".
    existingByClerk.roll = "kasutaja";

    await existingByClerk.save();

    return Response.json(existingByClerk);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
