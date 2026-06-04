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

export async function GET(request, context) {
  try {
    const id = resolveId(request, context);

    const rentimine = await Rentimine.findByPk(id, {
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

    if (!rentimine) {
      return Response.json({ error: "Tellimust ei leitud." }, { status: 404 });
    }

    return Response.json(rentimine);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const id = resolveId(request, context);
    await Rentimine.destroy({ where: { id } });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    const id = resolveId(request, context);
    const body = await request.json();

    const rentimine = await Rentimine.findByPk(id);
    if (!rentimine) {
      return Response.json({ error: "Tellimust ei leitud." }, { status: 404 });
    }

    const allowedUpdates = {
      staatus: body?.staatus,
      lopp_kuupaev: body?.lopp_kuupaev,
      total_price: body?.total_price,
      paid: body?.paid,
      aadress: body?.aadress,
    };

    Object.entries(allowedUpdates).forEach(([key, value]) => {
      if (value !== undefined) {
        rentimine[key] = value;
      }
    });

    await rentimine.save();

    const normalizedStatus = String(rentimine.staatus ?? "").toLowerCase();
    const shouldBeAvailable = /tagastatud|returned/i.test(normalizedStatus);

    await Suuline.update(
      { staatus: shouldBeAvailable ? "Saadaval" : "Renditud" },
      { where: { id: rentimine.suuline_id } },
    );

    const updatedRentimine = await Rentimine.findByPk(id, {
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

    return Response.json(updatedRentimine);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
