import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { Suuline } from "../../model/sequelize/index.js";

const UPLOAD_DIR = path.join(process.cwd(), "src", "uploads");

function inferExtension(originalName, mimeType) {
  const fromName = originalName ? path.extname(originalName).toLowerCase() : "";
  if (fromName) {
    return fromName;
  }

  const mimeMap = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };

  return mimeMap[mimeType] ?? ".bin";
}

async function saveImageToUploads({
  image_base64,
  image_mime_type,
  image_original_name,
}) {
  if (!image_base64) {
    return { image_path: null, image_filename: null };
  }

  const normalizedBase64 = image_base64.includes(",")
    ? image_base64.split(",").pop()
    : image_base64;

  if (!normalizedBase64) {
    throw new Error("Pildi andmed on vigased.");
  }

  const extension = inferExtension(image_original_name, image_mime_type);
  const fileName = `suuline-${Date.now()}-${randomUUID()}${extension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(filePath, Buffer.from(normalizedBase64, "base64"));

  return {
    image_path: `src/uploads/${fileName}`,
    image_filename: fileName,
  };
}

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
    const {
      image_base64,
      image_mime_type,
      image_original_name,
      ...createData
    } = body;

    const imageData = await saveImageToUploads({
      image_base64,
      image_mime_type,
      image_original_name,
    });

    const suuline = await Suuline.create({
      ...createData,
      ...imageData,
    });

    return Response.json(suuline, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
