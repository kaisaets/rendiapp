import {
  Kasutaja,
  Rentimine,
  Suuline,
} from "../../../model/sequelize/index.js";

function resolveId(request, context) {
  const fromParams = context?.params?.id;
  if (fromParams) {
    return String(fromParams);
  }

  const segments = new URL(request.url).pathname.split("/").filter(Boolean);
  return segments[segments.length - 1];
}

export async function DELETE(request, context) {
  try {
    const id = resolveId(request, context);
    await Kasutaja.destroy({ where: { id } });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(request, context) {
  try {
    const id = resolveId(request, context);
    const kasutaja = await Kasutaja.findByPk(id, {
      include: [
        {
          model: Rentimine,
          as: "rentimised",
          required: false,
          include: [
            {
              model: Suuline,
              as: "suuline",
              required: false,
            },
          ],
        },
      ],
    });

    if (!kasutaja) {
      return Response.json({ error: "Kasutajat ei leitud." }, { status: 404 });
    }

    return Response.json(kasutaja);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
