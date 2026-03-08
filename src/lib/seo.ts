/**
 * SEO utility functions for WallNova
 */

const SITE_NAME = "WallNova";
const SITE_URL = "https://wallnova.com";

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateWallpaperTitle(title: string, category: string, type: string): string {
  const resolution = type === "4k" ? "4K" : type === "mobile" ? "Mobile" : "HD";
  return `${title} – ${resolution} ${category} Wallpaper | ${SITE_NAME}`;
}

export function generateWallpaperDescription(
  title: string,
  description: string,
  category: string,
  resolution: string,
  tags: string[]
): string {
  const tagStr = tags.slice(0, 3).join(", ");
  const base = description
    ? `${description.slice(0, 100)}. `
    : `${title} wallpaper. `;
  return `${base}Download free ${resolution} ${category} wallpaper. Tags: ${tagStr}. High-quality wallpapers on ${SITE_NAME}.`.slice(0, 160);
}

export function generateImageAlt(title: string, category: string, type: string): string {
  const resolution = type === "4k" ? "4K" : type === "mobile" ? "mobile" : "desktop";
  return `${title} – ${category} ${resolution} wallpaper download`;
}

export function wallpaperJsonLd(wallpaper: {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  resolution: string;
  creator: { name: string };
  createdAt: string;
  downloads: number;
  rating: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: wallpaper.title,
    description: wallpaper.description,
    contentUrl: wallpaper.imageUrl,
    thumbnailUrl: wallpaper.imageUrl,
    genre: wallpaper.category,
    width: wallpaper.resolution.split("x")[0],
    height: wallpaper.resolution.split("x")[1],
    author: {
      "@type": "Person",
      name: wallpaper.creator.name,
    },
    datePublished: wallpaper.createdAt,
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/DownloadAction",
        userInteractionCount: wallpaper.downloads,
      },
    ],
    aggregateRating: wallpaper.rating > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: wallpaper.rating,
          bestRating: 5,
          ratingCount: Math.max(1, Math.round(wallpaper.downloads * 0.1)),
        }
      : undefined,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Download free HD, 4K, and mobile wallpapers from talented creators worldwide.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/explore?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function collectionJsonLd(name: string, description: string, wallpapers: { title: string; imageUrl: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: wallpapers.length,
      itemListElement: wallpapers.slice(0, 20).map((w, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "ImageObject",
          name: w.title,
          contentUrl: w.imageUrl,
        },
      })),
    },
  };
}

export { SITE_NAME, SITE_URL };
