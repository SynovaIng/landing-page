import { NextResponse } from "next/server";

const MATERIAL_ICONS_METADATA_URL = "https://fonts.google.com/metadata/icons";
const CACHE_TTL_MS = 1000 * 60 * 60;

let cachedIconNames: string[] | null = null;
let cachedAt = 0;

const parseIconsMetadata = (raw: string): string[] => {
  const sanitized = raw.startsWith(")]}\'\n") ? raw.slice(5) : raw;
  const parsed = JSON.parse(sanitized) as {
    icons?: { name?: string }[];
  };

  return (parsed.icons ?? [])
    .map((item) => String(item.name ?? "").trim())
    .filter((name) => name.length > 0);
};

const getAllMaterialIconNames = async (): Promise<string[]> => {
  const now = Date.now();

  if (cachedIconNames && now - cachedAt < CACHE_TTL_MS) {
    return cachedIconNames;
  }

  const response = await fetch(MATERIAL_ICONS_METADATA_URL, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el catálogo de iconos");
  }

  const raw = await response.text();
  const iconNames = parseIconsMetadata(raw);

  cachedIconNames = iconNames;
  cachedAt = now;

  return iconNames;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = String(searchParams.get("q") ?? "").trim().toLowerCase();
  const limit = Number(searchParams.get("limit") ?? 40);

  if (!query) {
    return NextResponse.json({ icons: [] });
  }

  try {
    const allIcons = await getAllMaterialIconNames();
    const filtered = allIcons
      .filter((iconName) => iconName.toLowerCase().includes(query))
      .slice(0, Number.isFinite(limit) ? Math.max(1, Math.min(limit, 100)) : 40);

    return NextResponse.json({ icons: filtered });
  } catch {
    return NextResponse.json({ icons: [] });
  }
}
