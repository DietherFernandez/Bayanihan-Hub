import React from "react";
import type { Metadata } from "next";
import { ModuleDetailView } from "@/components/modules/module-detail-view";
import { VERIFIED_ASSISTANCE_PROGRAMS, VERIFIED_RESOURCES } from "@/lib/constants/philippine-data";

export async function generateStaticParams() {
  const progSlugs = VERIFIED_ASSISTANCE_PROGRAMS.map((p) => ({ slug: p.slug }));
  const resSlugs = VERIFIED_RESOURCES.filter((r) => r.module === "pera").map((r) => ({ slug: r.slug }));
  return [...progSlugs, ...resSlugs];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const prog = VERIFIED_ASSISTANCE_PROGRAMS.find((p) => p.slug === decoded);
  const res = VERIFIED_RESOURCES.find((r) => r.module === "pera" && r.slug === decoded);
  const title = prog?.programName || res?.title || "Financial Assistance Guide";
  const description = prog?.description || res?.summary || "Verified financial assistance, loan guide, or social welfare program for Filipinos.";

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

export default async function PeraDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ModuleDetailView module="pera" slug={decodeURIComponent(slug)} />;
}
