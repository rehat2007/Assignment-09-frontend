import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { auth } from "@/lib/auth";

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_BYTES = 2 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "No image provided" }, { status: 400 });
  }

  const extension = TYPES[file.type];
  if (!extension) {
    return Response.json(
      { error: "Use a JPG, PNG or WEBP image" },
      { status: 415 },
    );
  }

  if (file.size > MAX_BYTES) {
    return Response.json(
      { error: "Image must be under 2 MB" },
      { status: 413 },
    );
  }

  const directory = join(process.cwd(), "data", "avatars");
  await mkdir(directory, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  await writeFile(
    join(directory, filename),
    Buffer.from(await file.arrayBuffer()),
  );

  return Response.json({ url: `/api/avatar/${filename}` });
}
