import React from "react";
import type { Metadata } from "next";
import { ModuleDetailView } from "@/components/modules/module-detail-view";
import { VERIFIED_RESOURCES } from "@/lib/constants/philippine-data";

export async function generateStaticParams() {
  return VERIFIED_RESOURCES.filter((r) => r.module === "kaligtasan").map((r) => ({
    slug: r.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const resource = VERIFIED_RESOURCES.find(
    (r) => r.module === "kaligtasan" && r.slug === decoded
  );

  const title = resource?.title || "Kaligtasan & Emergency Resource";
  const description = resource?.summary || "Verified emergency hotline, evacuation advisory, or disaster preparedness guide.";

  return {
    title: title,
    description,
    openGraph: {
      title: `${title} | GabayPH`,
      description,
      siteName: "GabayPH",
      type: "article",
    },
  };
}

export default async function KaligtasanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <ModuleDetailView module="kaligtasan" slug={decodeURIComponent(slug)} />
  );
}
