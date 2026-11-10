import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/env";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    platform: "GabayPH",
    supabaseConfigured: isSupabaseConfigured(),
    timestamp: new Date().toISOString(),
  });
}
