import { readFile } from "node:fs/promises";
import { join } from "node:path";

const FILE_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/i;

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ file: string }> },
) {
  const { file } = await context.params;

  if (!FILE_PATTERN.test(file)) {
    return new Response("Not found", { status: 404 });
  }

  const extension = file.split(".").pop()?.toLowerCase() ?? "jpg";

  try {
    const image = await readFile(join(process.cwd(), "data", "avatars", file));

    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": CONTENT_TYPES[extension] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
