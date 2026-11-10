import React from "react";
import { ModuleDetailView } from "@/components/modules/module-detail-view";

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
