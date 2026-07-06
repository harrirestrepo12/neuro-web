import type { MetadataRoute } from "next";
import { SEO_PAGES, canonicalUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return SEO_PAGES.map((page) => ({
    url: canonicalUrl(page.path),
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
