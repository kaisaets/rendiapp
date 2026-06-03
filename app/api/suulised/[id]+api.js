import { Suuline } from "../../../model/sequelize/index.js";

function resolveId(request, context) {
  const fromParams = context?.params?.id;
  if (fromParams) {
    return String(fromParams);
  }

  const segments = new URL(request.url).pathname.split("/").filter(Boolean);
  return segments[segments.length - 1];
}

export async function GET(request, context) {
  try {
    const id = resolveId(request, context);
    const suuline = await Suuline.findByPk(id);

    if (!suuline) {
      return Response.json({ error: "Suulist ei leitud." }, { status: 404 });
    }

    return Response.json(suuline);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const id = resolveId(request, context);
    await Suuline.destroy({ where: { id } });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
