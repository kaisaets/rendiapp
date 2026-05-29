import { Kasutaja } from "../../model/sequelize/index.js";

export async function GET() {
  try {
    const kasutajad = await Kasutaja.findAll({ order: [["id", "DESC"]] });
    return Response.json(kasutajad);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const kasutaja = await Kasutaja.create(body);
    return Response.json(kasutaja, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
