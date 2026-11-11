import React from "react";
import type { Metadata } from "next";
import { ModuleDetailView } from "@/components/modules/module-detail-view";
import { VERIFIED_RESOURCES } from "@/lib/constants/philippine-data";

export async function generateStaticParams() {
  return VERIFIED_RESOURCES.filter((r) => r.module === "serbisyo").map((r) => ({
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
    (r) => r.module === "serbisyo" && r.slug === decoded
  );

  if (!resource) {
    return {
      title: "Government Service Guide | GabayPH",
      description: "Verified public service guide for Philippine citizens.",
    };
  }

  return {
    title: `${resource.title} | GabayPH`,
    description: resource.summary,
    openGraph: {
      title: `${resource.title} | GabayPH`,
      description: resource.summary,
      siteName: "GabayPH",
      type: "article",
    },
  };
}

export default async function SerbisyoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ModuleDetailView module="serbisyo" slug={decodeURIComponent(slug)} />;
}
