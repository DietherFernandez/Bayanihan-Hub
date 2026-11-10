import React from "react";
import { ModuleDetailView } from "@/components/modules/module-detail-view";

export default async function PeraDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ModuleDetailView module="pera" slug={decodeURIComponent(slug)} />;
}
