import { NextResponse, type NextRequest } from "next/server";
import { universalSearchSchema } from "@/lib/validations/schemas";
import { queryUniversalSearch } from "@/lib/constants/philippine-data";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function GET(request: NextRequest) {
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anonymous";
  const rate = checkRateLimit(`search:${clientIp}`, 60, 60_000);

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many search requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const parsed = universalSearchSchema.safeParse({
    q: searchParams.get("q") || "",
    module: searchParams.get("module") || "all",
    region: searchParams.get("region") || "ALL",
    verification: searchParams.get("verification") || "all",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid search filter parameters." },
      { status: 400 }
    );
  }

  const results = queryUniversalSearch(parsed.data);

  return NextResponse.json(
    {
      query: parsed.data,
      total: results.length,
      results,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "X-RateLimit-Remaining": String(rate.remaining),
      },
    }
  );
}
