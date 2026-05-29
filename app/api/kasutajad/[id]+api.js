import { Kasutaja } from "../../../model/sequelize/index.js";

export async function DELETE(_request, { params }) {
  try {
    await Kasutaja.destroy({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
