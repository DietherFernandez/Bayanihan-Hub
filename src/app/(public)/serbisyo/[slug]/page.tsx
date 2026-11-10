import React from "react";
import { ModuleDetailView } from "@/components/modules/module-detail-view";

export default async function SerbisyoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ModuleDetailView module="serbisyo" slug={decodeURIComponent(slug)} />;
}
