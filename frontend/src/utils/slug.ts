/**
 * Build an SEO-friendly URL slug from a title (e.g. "Fresh mangoes" -> "fresh-mangoes").
 * Lowercase, trim, replace spaces with hyphens, remove/replace special characters.
 */
export function slugify(title: string): string {
  if (!title || typeof title !== 'string') return '';
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '') // remove non-word except hyphen
    .replace(/\-\-+/g, '-')   // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');  // trim hyphens from ends
}

/**
 * Product URL path segment: use API slug when available (no id exposed), else slugify(title), else id (legacy fallback).
 */
export function productUrlSlug(product: { slug?: string | null; title?: string | null; id?: string | null; name?: string | null }): string {
  if (product?.slug && typeof product.slug === 'string' && product.slug.trim()) return product.slug.trim();
  const title = product?.title ?? product?.name ?? '';
  const slug = slugify(title);
  if (slug) return slug;
  return String(product?.id ?? '').trim() || 'product';
}
