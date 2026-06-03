import { Kasutaja, Rentimine, Suuline } from "../../model/sequelize/index.js";

export async function GET() {
  try {
    const rentimised = await Rentimine.findAll({
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
