import type { MetadataRoute } from "next";
import {
  VERIFIED_ASSISTANCE_PROGRAMS,
  VERIFIED_BAYANIHAN_POSTS,
  VERIFIED_OPPORTUNITIES,
  VERIFIED_RESOURCES,
} from "@/lib/constants/philippine-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://gabayph-red.vercel.app";
  const now = new Date();

  // Core Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/serbisyo`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trabaho`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pera`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bayanihan`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/aral`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kaligtasan`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/assistant`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic Serbisyo Guides
  const serbisyoRoutes: MetadataRoute.Sitemap = VERIFIED_RESOURCES.filter(
    (r) => r.module === "serbisyo"
  ).map((r) => ({
    url: `${baseUrl}/serbisyo/${r.slug}`,
    lastModified: new Date(r.lastVerifiedAt || now),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic Trabaho Guides / Jobs
  const trabahoRoutes: MetadataRoute.Sitemap = VERIFIED_OPPORTUNITIES.map(
    (o) => ({
      url: `${baseUrl}/trabaho/${o.slug}`,
      lastModified: new Date(o.lastVerifiedAt || now),
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  // Dynamic Pera Aid Programs
  const peraRoutes: MetadataRoute.Sitemap = VERIFIED_ASSISTANCE_PROGRAMS.map(
    (p) => ({
      url: `${baseUrl}/pera/${p.slug}`,
      lastModified: new Date(p.lastVerifiedAt || now),
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  // Dynamic Bayanihan Community Posts
  const bayanihanRoutes: MetadataRoute.Sitemap = VERIFIED_BAYANIHAN_POSTS.map(
    (b) => ({
      url: `${baseUrl}/bayanihan/${b.slug}`,
      lastModified: new Date(b.lastVerifiedAt || now),
      changeFrequency: "daily",
      priority: 0.6,
    })
  );

  return [
    ...staticRoutes,
    ...serbisyoRoutes,
    ...trabahoRoutes,
    ...peraRoutes,
    ...bayanihanRoutes,
  ];
}
