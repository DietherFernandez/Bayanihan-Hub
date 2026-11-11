import React from "react";
import type { Metadata } from "next";
import { ModuleDetailView } from "@/components/modules/module-detail-view";
import { VERIFIED_OPPORTUNITIES, VERIFIED_RESOURCES } from "@/lib/constants/philippine-data";

export async function generateStaticParams() {
  const oppSlugs = VERIFIED_OPPORTUNITIES.map((o) => ({ slug: o.slug }));
  const resSlugs = VERIFIED_RESOURCES.filter((r) => r.module === "trabaho").map((r) => ({ slug: r.slug }));
  return [...oppSlugs, ...resSlugs];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const opp = VERIFIED_OPPORTUNITIES.find((o) => o.slug === decoded);
  const res = VERIFIED_RESOURCES.find((r) => r.module === "trabaho" && r.slug === decoded);
  const title = opp?.title || res?.title || "Trabaho & Career Guide";
  const description = opp?.description || res?.summary || "Verified employment opportunity, training program, or job assistance guide for Filipinos.";

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

export default async function TrabahoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ModuleDetailView module="trabaho" slug={decodeURIComponent(slug)} />;
}
