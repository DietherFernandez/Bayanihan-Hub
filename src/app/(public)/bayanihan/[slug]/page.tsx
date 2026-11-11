import React from "react";
import type { Metadata } from "next";
import { ModuleDetailView } from "@/components/modules/module-detail-view";
import { VERIFIED_BAYANIHAN_POSTS, VERIFIED_RESOURCES } from "@/lib/constants/philippine-data";

export async function generateStaticParams() {
  const postSlugs = VERIFIED_BAYANIHAN_POSTS.map((b) => ({ slug: b.slug }));
  const resSlugs = VERIFIED_RESOURCES.filter((r) => r.module === "bayanihan").map((r) => ({ slug: r.slug }));
  return [...postSlugs, ...resSlugs];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const post = VERIFIED_BAYANIHAN_POSTS.find((b) => b.slug === decoded);
  const res = VERIFIED_RESOURCES.find((r) => r.module === "bayanihan" && r.slug === decoded);
  const title = post?.title || res?.title || "Bayanihan Community Effort";
  const description = post?.summary || res?.summary || "Verified community donation drive, relief initiative, or volunteer opportunity.";

  return {
    title: `${title} | GabayPH`,
    description,
    openGraph: {
      title: `${title} | GabayPH`,
      description,
      siteName: "GabayPH",
      type: "article",
    },
  };
}

export default async function BayanihanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ModuleDetailView module="bayanihan" slug={decodeURIComponent(slug)} />;
}
