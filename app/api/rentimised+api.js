import { Kasutaja, Rentimine, Suuline } from "../../model/sequelize/index.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const kasutajaIdParam = searchParams.get("kasutaja_id");

    let where;
    if (kasutajaIdParam !== null) {
      const kasutajaId = Number.parseInt(kasutajaIdParam, 10);

      if (Number.isNaN(kasutajaId) || kasutajaId <= 0) {
        return Response.json(
          { error: "Vigane kasutaja_id query parameeter." },
          { status: 400 },
        );
      }

      where = { kasutaja_id: kasutajaId };
    }

    const rentimised = await Rentimine.findAll({
      where,
      include: [
        {
          model: Kasutaja,
          as: "kasutaja",
          required: false,
        },
        {
          model: Suuline,
          as: "suuline",
          required: false,
        },
      ],
      order: [["id", "DESC"]],
    });

    return Response.json(rentimised);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const rentimine = await Rentimine.create(body);

    await Suuline.update(
      { staatus: "Renditud" },
      { where: { id: rentimine.suuline_id } },
    );

    const rentimineWithRelations = await Rentimine.findByPk(rentimine.id, {
      include: [
        {
          model: Kasutaja,
          as: "kasutaja",
          required: false,
        },
        {
          model: Suuline,
          as: "suuline",
          required: false,
        },
      ],
    });

    return Response.json(rentimineWithRelations, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
