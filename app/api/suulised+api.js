import { Suuline } from "../../model/sequelize/index.js";

export async function GET() {
  try {
    const suulised = await Suuline.findAll({ order: [["id", "DESC"]] });
    return Response.json(suulised);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const suuline = await Suuline.create(body);
    return Response.json(suuline, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
