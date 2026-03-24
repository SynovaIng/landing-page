const DEFAULT_SERVICE_SLUG = "servicio";

export function normalizeServiceSlug(value: string): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || DEFAULT_SERVICE_SLUG;
}

export function buildUniqueServiceSlug(baseSlug: string, existingSlugs: Iterable<string>): string {
  const normalizedBase = normalizeServiceSlug(baseSlug);
  const takenSlugs = new Set(
    Array.from(existingSlugs, (slug) => String(slug).trim().toLowerCase()).filter(Boolean),
  );

  if (!takenSlugs.has(normalizedBase)) {
    return normalizedBase;
  }

  let suffix = 2;
  let nextSlug = `${normalizedBase}-${suffix}`;

  while (takenSlugs.has(nextSlug)) {
    suffix += 1;
    nextSlug = `${normalizedBase}-${suffix}`;
  }

  return nextSlug;
}
